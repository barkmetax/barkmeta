"""
DDL clean-room engine -- event-driven core with an explicit priority / chain stack.

Design axis (deliberately different from the existing sequential/heuristic branch):
  * Every game action raises an EVENT.
  * After an action, a PRIORITY WINDOW opens: turn player then opponent may respond.
  * Responses / triggered abilities push CHAIN LINKS onto a STACK that resolves LIFO.
  * REPLACEMENT / prevention effects (Helios heal-redirect, Warded, Plague Doctor,
    cost floors) modify the EVENT itself and never touch the stack.

This module is the rules core only. Card behaviours live in carddata.py and register
against the hooks exposed here. Nothing in here reads the other branch's engine.

Global constants are explicit assumptions (the brief does not state base HP / mana ramp /
board width); they are surfaced in REPORT.md so they can be challenged.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Optional, Callable, Any
import random

# ---- explicit, challengeable assumptions -----------------------------------
START_HP = 30
MAX_HP = 40            # ruling 4: hard cap, no overheal
HAND_CAP = 10         # ruling 18
BOARD_CAP = 7
MAX_MANA = 10
DECK_SIZE = 30


# ============================================================================
# Static card data
# ============================================================================
@dataclass(frozen=True)
class Card:
    name: str
    cls: str                 # Bows/Crowns/Pirates/Wizards/Zombies/Neutral
    cost: int
    ctype: str               # creature / spell / trap
    atk: int = 0
    hp: int = 0
    rarity: str = "B"
    keywords: tuple = ()     # static keywords: rush charge taunt warded poisonous vamp wildfury stealth
    text: str = ""
    live: bool = False       # the 3 tunable cards


# ============================================================================
# Runtime creature instance
# ============================================================================
class Creature:
    _uid = 0

    def __init__(self, card: Card, owner: "Player"):
        Creature._uid += 1
        self.uid = Creature._uid
        self.card = card
        self.owner = owner
        self.plus_atk = 0          # permanent buffs (+/-)
        self.plus_hp = 0
        self.temp_atk = 0          # "this turn" buffs
        self.warded = "warded" in card.keywords
        self.frozen_until = -1     # turn index until which it cannot attack
        self.cannot_attack_until = -1
        self.summoned_turn = -1
        self.attacked_this_turn = False
        self.ability_used_this_turn = 0
        self.temp_keywords: set[str] = set()   # e.g. poisonous from Coat the Blades, rush from Loose
        self.dead = False

    # effective stats are computed live so aura add/remove is always consistent (no stale layers)
    def eff_atk(self, game: "Game") -> int:
        return max(0, self.card.atk + self.plus_atk + self.temp_atk + game.aura_atk(self))

    def eff_hp(self, game: "Game") -> int:
        return self.card.hp + self.plus_hp + game.aura_hp(self)

    def kw(self) -> set[str]:
        return set(self.card.keywords) | self.temp_keywords

    def can_attack(self, game: "Game") -> bool:
        if self.dead or self.attacked_this_turn:
            return False
        if game.turn <= self.frozen_until or game.turn <= self.cannot_attack_until:
            return False
        if self.eff_atk(game) <= 0:
            return False
        kws = self.kw()
        # summoning sickness unless Rush/Charge/Wildfury
        if self.summoned_turn == game.turn and not (kws & {"rush", "charge", "wildfury"}):
            return False
        return True


# ============================================================================
# Player
# ============================================================================
class Player:
    def __init__(self, name: str, deck: list[Card]):
        self.name = name
        self.hero_hp = START_HP
        self.mana = 0
        self.max_mana = 0
        self.hand: list[Card] = []
        self.deck: list[Card] = list(deck)
        self.grave: list[Card] = []
        self.banished: list[Card] = []
        self.board: list[Creature] = []
        self.traps: list[Card] = []          # set face-down
        self.fatigue = 0
        self.immune_until = -1               # Last Stand
        self.opponent: "Player" = None  # type: ignore
        self.summons_this_turn = 0
        self.summoned_uids_this_turn: list[int] = []

    # ---- spell damage is computed live from the board (Vorruk / Sparkpup / Runewing ...) ----
    def spell_damage(self, game: "Game") -> int:
        sd = 0
        for c in self.board:
            sd += game.spell_damage_of(c)
        return sd


# ============================================================================
# Chain link on the stack
# ============================================================================
@dataclass
class Link:
    controller: Player
    resolve: Callable[["Game"], None]
    desc: str
    negated: bool = False
    is_replacement: bool = False   # replacements never get here, but guard anyway


# ============================================================================
# The game
# ============================================================================
class Game:
    def __init__(self, p0: Player, p1: Player, rng: random.Random, log: bool = False):
        self.players = [p0, p1]
        p0.opponent, p1.opponent = p1, p0
        self.rng = rng
        self.turn = 0
        self.active = 0
        self.stack: list[Link] = []
        self.winner: Optional[int] = None
        self.do_log = log
        self.events: list[str] = []
        # behaviour registries are injected by carddata.register(game)
        self.on_play: dict[str, Callable] = {}
        self.on_haunt: dict[str, Callable] = {}
        self.on_spell: dict[str, Callable] = {}
        self.on_ability: dict[str, Callable] = {}
        self.aura_specs: list = []     # filled by carddata
        # priority hook: a pilot may register response decisions
        self.response_fn: Optional[Callable] = None

    # ---------- logging ----------
    def log(self, msg: str):
        if self.do_log:
            self.events.append(msg)

    def cur(self) -> Player:
        return self.players[self.active]

    def opp(self) -> Player:
        return self.players[1 - self.active]

    # =====================================================================
    # AURAS (Stasis continuous effects), computed live -> clean layering
    # ruling/open-q: additive, independent, source-removal only drops its own
    # contribution; Resonance adds +1 to each of YOUR OTHER +ATK/+HP auras (linear).
    # =====================================================================
    def _resonance_bonus(self, controller: Player) -> int:
        return sum(1 for c in controller.board
                   if c.card.name == "Resonance" and not c.dead)

    def aura_atk(self, target: Creature) -> int:
        total = 0
        for src in self._live_creatures():
            for (kind, amount, pred) in self._auras_of(src):
                if kind != "atk":
                    continue
                if pred(self, src, target):
                    bonus = amount
                    # Resonance: +1 to each of the controller's other +ATK auras (only positive grants)
                    if amount > 0 and src.owner is target.owner:
                        bonus += self._resonance_bonus(src.owner)
                    total += bonus
        return total

    def aura_hp(self, target: Creature) -> int:
        total = 0
        for src in self._live_creatures():
            for (kind, amount, pred) in self._auras_of(src):
                if kind != "hp":
                    continue
                if pred(self, src, target):
                    bonus = amount
                    if amount > 0 and src.owner is target.owner:
                        bonus += self._resonance_bonus(src.owner)
                    total += bonus
        return total

    def spell_damage_of(self, c: Creature) -> int:
        if c.dead:
            return 0
        base = {"Sparkpup": 1, "Runewing": 1, "Glyphmaster": 3, "Hexcaster": 0,
                "Wyrmling": 0}.get(c.card.name, 0)
        # Hexcaster has no static SD; Glyphmaster +3; Sparkpup/Runewing +1; Vorruk dynamic
        if c.card.name == "Vorruk the Emberlord":
            base += sum(1 for o in c.owner.board
                        if o is not c and not o.dead and o.card.cls == "Wizards")
        return base

    def _live_creatures(self) -> list[Creature]:
        return [c for p in self.players for c in p.board if not c.dead]

    def _auras_of(self, src: Creature):
        """Return list of (kind, amount, predicate(game,src,target)) for a source's Stasis auras."""
        return self.aura_table.get(src.card.name, [])

    # =====================================================================
    # PRIORITY WINDOW + CHAIN
    # =====================================================================
    def trigger(self, controller: Player, resolve: Callable, desc: str):
        """Push a triggered ability as a chain link (LIFO)."""
        self.stack.append(Link(controller, resolve, desc))
        self.log(f"  + chain link: {desc} (by {controller.name})")

    def open_priority(self):
        """A real priority pass: turn player then opponent may add Quick responses.

        Triggered abilities are already on the stack; this lets pilots inject Quick
        spells / set traps / hand-trap negates. Then the stack resolves LIFO.
        """
        if self.response_fn:
            # turn player first, then opponent (YGO priority order)
            for pl in (self.cur(), self.opp()):
                self.response_fn(self, pl)
        self.resolve_stack()

    def resolve_stack(self):
        """Resolve the chain LIFO until empty."""
        while self.stack:
            link = self.stack.pop()
            if link.negated:
                self.log(f"  - link negated: {link.desc}")
                continue
            self.log(f"  > resolving: {link.desc}")
            link.resolve(self)
            self.check_state()

    def negate_top(self):
        """Negate the most recent unresolved link (used by Nullbark / hand traps)."""
        for link in reversed(self.stack):
            if not link.negated:
                link.negated = True
                return True
        return False

    # =====================================================================
    # DAMAGE  (event; respects Warded replacement + Poisonous; no retained dmg)
    # =====================================================================
    def deal_damage_creature(self, target: Creature, amount: int, source: Any,
                             poisonous: bool = False):
        if target.dead or amount <= 0 and not poisonous:
            return
        # REPLACEMENT: Warded prevents the first damage instance entirely (incl. poison)
        if target.warded:
            target.warded = False
            self.log(f"    Warded prevents {amount} to {target.card.name}")
            return
        if poisonous and amount > 0:
            self.log(f"    Poisonous destroys {target.card.name}")
            self.destroy(target, reason="poison")
            return
        # no retained damage (ruling 2): death iff a single instance >= current hp
        if amount >= target.eff_hp(self):
            self.log(f"    {target.card.name} takes {amount} >= {target.eff_hp(self)}hp -> destroyed")
            self.destroy(target, reason="damage")
        else:
            self.log(f"    {target.card.name} takes {amount} (< {target.eff_hp(self)}hp) -> no retained damage")

    def deal_damage_hero(self, target: Player, amount: int, source: Any):
        if amount <= 0:
            return
        if self.turn <= target.immune_until:
            self.log(f"    {target.name} immune (Last Stand)")
            return
        # Last Stand trap: when hero would take lethal -> negate + immunity. Handled as a
        # set trap response in carddata; here we just apply and let check_state see lethal.
        # Hook for set traps that watch lethal:
        if target.hero_hp - amount <= 0:
            if self._try_last_stand(target):
                return
        target.hero_hp -= amount
        self.log(f"    {target.name} hero -> {target.hero_hp} (took {amount})")

    def _try_last_stand(self, target: Player) -> bool:
        for t in list(target.traps):
            if t.name == "Last Stand":
                target.traps.remove(t)
                target.grave.append(t)
                target.immune_until = self.turn + 1   # immune until your next turn
                self.log(f"    Last Stand! {target.name} negates lethal, immune until next turn")
                return True
        return False

    # =====================================================================
    # HEAL  (event; Helios redirect + Plague Doctor prevent + Mama Bark augment)
    # =====================================================================
    def heal_hero(self, player: Player, amount: int, source: Any):
        if amount <= 0:
            return
        # PREVENTION (replacement): opponent's Plague Doctor -> "enemy Hero cannot be healed"
        if any(c.card.name == "Plague Doctor" and not c.dead for c in player.opponent.board):
            # Helios redirect still applies (it is not a heal once redirected) -- resolved below,
            # but a pure heal is simply prevented.
            helios = [c for c in player.board if c.card.name == "Helios" and not c.dead]
            if not helios:
                self.log(f"    heal of {amount} prevented (Plague Doctor)")
                return
        # REPLACEMENT: Helios -> instead deal that much to enemy hero (does NOT use stack)
        helios = [c for c in player.board if c.card.name == "Helios" and not c.dead]
        if helios:
            self.log(f"    Helios redirects heal {amount} -> {amount} dmg to enemy hero")
            self.deal_damage_hero(player.opponent, amount, source="Helios")
            # rider: "whenever this Creature deals damage to enemy hero, draw 1" (trigger)
            self.trigger(player, lambda g: self.draw(player, 1), "Helios draw rider")
            # Helios consumes the heal; Mama Bark "restore HP" augment does NOT fire (no restore)
            # Dawn Acolyte "whenever you restore HP" also does NOT fire (no restore). [FLAGGED]
            return
        # AUGMENT (replacement): Mama Bark -> restore 2 additional per heal event
        if any(c.card.name == "Mama Bark" and not c.dead for c in player.board):
            amount += 2
            self.log(f"    Mama Bark augments heal +2 -> {amount}")
        before = player.hero_hp
        player.hero_hp = min(MAX_HP, player.hero_hp + amount)
        healed = player.hero_hp - before
        self.log(f"    {player.name} heals {healed} -> {player.hero_hp}")
        # TRIGGERS on a real restore: Dawn Acolyte (1 dmg to enemy), generic "restore HP" watchers
        if healed > 0 or amount > 0:
            for c in player.board:
                if c.card.name == "Dawn Acolyte" and not c.dead:
                    self.trigger(player, lambda g: self.deal_damage_hero(player.opponent, 1, "Dawn Acolyte"),
                                 "Dawn Acolyte: 1 dmg on heal")

    # =====================================================================
    # DESTRUCTION + HAUNT  (Haunt uses the stack; turn-player triggers first)
    # =====================================================================
    def destroy(self, c: Creature, reason: str = "effect", from_zone: str = "board"):
        if c.dead:
            return
        c.dead = True
        if from_zone == "board" and c in c.owner.board:
            c.owner.board.remove(c)
        c.owner.grave.append(c.card)
        self.log(f"    {c.card.name} -> graveyard ({reason})")
        self._fire_haunt(c)

    def mass_destroy(self, creatures, reason: str = "wipe"):
        """Destroy many creatures SIMULTANEOUSLY, then fire Haunts turn-player-first.

        ruling 14 / OQ4: all deaths happen at once; the turn player's triggers resolve
        FIRST. With a LIFO stack that means non-turn-player Haunts are pushed first so
        the turn player's are on top. Gravechoir doubling is applied per-haunt (linear).
        """
        dying = [c for c in creatures if not c.dead]
        for c in dying:                       # remove all first => simultaneity
            c.dead = True
            if c in c.owner.board:
                c.owner.board.remove(c)
            c.owner.grave.append(c.card)
            self.log(f"    {c.card.name} -> graveyard ({reason})")
        push_order = ([c for c in dying if c.owner is not self.cur()] +
                      [c for c in dying if c.owner is self.cur()])
        for c in push_order:
            self._fire_haunt(c)

    def effective_cost(self, player: Player, card: Card) -> int:
        """ruling 15: cost reductions floor at the stated minimum (1)."""
        cost = card.cost
        if card.ctype == "creature" and card.cls == "Pirates":
            if any(c.card.name == "Cap'n Brindle" and not c.dead for c in player.board):
                cost -= 1
        if card.ctype == "spell":
            if any(c.card.name == "Glacewisp" and not c.dead for c in player.board):
                cost -= 1
        return max(1, cost)

    def mill(self, player: Player, n: int):
        """Send top n of deck to graveyard. Haunt also fires on mill (ruling 11)."""
        for _ in range(n):
            if not player.deck:
                return
            card = player.deck.pop(0)
            player.grave.append(card)
            self.log(f"    {player.name} mills {card.name}")
            if card.ctype == "creature" and self._has_haunt(card):
                tmp = Creature(card, player)
                self._fire_haunt(tmp, milled=True)

    def _has_haunt(self, card: Card) -> bool:
        return "haunt:" in card.text.lower() or card.name in self.haunt_table

    def _fire_haunt(self, c: Creature, milled: bool = False):
        name = c.card.name
        if name not in self.haunt_table:
            return
        fn = self.haunt_table[name]
        controller = c.owner
        # Gravechoir: your Haunt effects trigger twice (LINEAR doubling)
        times = 1
        if any(x.card.name == "Gravechoir" and not x.dead for x in controller.board):
            times = 2
        for _ in range(times):
            self.trigger(controller, lambda g, fn=fn, c=c: fn(g, c), f"Haunt: {name}")

    # =====================================================================
    # DRAW / FATIGUE / HAND CAP
    # =====================================================================
    def draw(self, player: Player, n: int = 1):
        for _ in range(n):
            if not player.deck:
                player.fatigue += 1
                self.log(f"    {player.name} fatigue {player.fatigue}")
                self.deal_damage_hero(player, player.fatigue, "fatigue")
                continue
            card = player.deck.pop(0)
            if len(player.hand) >= HAND_CAP:
                player.grave.append(card)   # over-cap draw is burned (ruling 18)
                self.log(f"    {player.name} burns over-cap draw {card.name}")
            else:
                player.hand.append(card)
                self.log(f"    {player.name} draws {card.name}")

    # =====================================================================
    # SUMMON / SEARCH (hand-trap negate hooks: Ashpaw, Tithe, Vaultwarden)
    # =====================================================================
    def summon(self, player: Player, card: Card, from_zone: str = "hand") -> Optional[Creature]:
        if len(player.board) >= BOARD_CAP:
            self.log(f"    board full, cannot summon {card.name}")
            return None
        # Vaultwarden replacement-lock: neither player may summon from grave/deck
        if from_zone in ("deck", "grave"):
            if any(c.card.name == "Vaultwarden" and not c.dead
                   for p in self.players for c in p.board):
                self.log(f"    Vaultwarden locks summon of {card.name} from {from_zone}")
                return None
        cr = Creature(card, player)
        cr.summoned_turn = self.turn
        player.board.append(cr)
        player.summons_this_turn += 1
        player.summoned_uids_this_turn.append(cr.uid)
        self.log(f"    {player.name} summons {card.name} from {from_zone}")
        # on-summon hand traps (Calypso 'whenever you summon another pirate', Tithe Collector, etc.)
        self._on_summon_triggers(player, cr, from_zone)
        return cr

    def _on_summon_triggers(self, player: Player, cr: Creature, from_zone: str):
        # Calypso: whenever you summon another Pirate -> 2 dmg to enemy hero
        for c in player.board:
            if c.card.name == "Calypso the Gunner Queen" and not c.dead and c is not cr \
               and cr.card.cls == "Pirates":
                self.trigger(player, lambda g: self.deal_damage_hero(player.opponent, 2, "Calypso"),
                             "Calypso: 2 dmg on Pirate summon")
        # Tithe Collector hand-trap: opponent summons their THIRD creature this turn
        for c in player.opponent.board:
            if c.card.name == "Tithe Collector" and not c.dead and player.summons_this_turn == 3:
                tc = c
                def res(g, tc=tc, player=player):
                    g.destroy(tc, "banish-self")
                    tc.owner.grave.pop()   # banished, not grave
                    tc.owner.banished.append(tc.card)
                    for uid in list(player.summoned_uids_this_turn):
                        for cc in list(player.board):
                            if cc.uid == uid:
                                g.destroy(cc, "Tithe Collector")
                self.trigger(c.owner, res, "Tithe Collector: wrath on 3rd summon")

    # =====================================================================
    # COMBAT  (ruling 1: simultaneous; ruling 13: on-destroy fires on mutual trade)
    # =====================================================================
    def attack(self, attacker: Creature, target):
        if not attacker.can_attack(self):
            return
        kws = attacker.kw()
        # Rush cannot hit hero; Charge can hit either (ruling 17)
        if isinstance(target, Player) and "rush" in kws and "charge" not in kws:
            self.log(f"    {attacker.card.name} has Rush, cannot attack hero")
            return
        attacker.attacked_this_turn = True
        a_atk = attacker.eff_atk(self)
        if isinstance(target, Player):
            self.deal_damage_hero(target, a_atk, attacker)
            if "vamp" in kws:
                self.heal_hero(attacker.owner, a_atk, "Vamp")  # routes through heal (ruling 7)
            self._post_combat_triggers(attacker, None, destroyed_defender=False)
            return
        # creature vs creature: simultaneous
        defender: Creature = target
        d_atk = defender.eff_atk(self)
        a_pois = "poisonous" in kws
        d_pois = "poisonous" in defender.kw()
        d_hp_before = defender.eff_hp(self)
        a_hp_before = attacker.eff_hp(self)
        will_destroy_defender = a_pois or a_atk >= d_hp_before
        # apply both, simultaneously (compute lethality from pre-combat snapshot)
        self.deal_damage_creature(defender, a_atk, attacker, poisonous=a_pois)
        self.deal_damage_creature(attacker, d_atk, defender, poisonous=d_pois)
        if "vamp" in kws and not defender.warded:
            self.heal_hero(attacker.owner, a_atk, "Vamp")
        self._post_combat_triggers(attacker, defender, destroyed_defender=will_destroy_defender)
        self.open_priority()

    def _post_combat_triggers(self, attacker: Creature, defender: Optional[Creature],
                              destroyed_defender: bool):
        # Keenhound: on attack a creature and destroy it -> draw (fires even if attacker also died: LKI)
        if defender is not None and destroyed_defender:
            if attacker.card.name == "Keenhound":
                self.trigger(attacker.owner, lambda g: self.draw(attacker.owner, 1),
                             "Keenhound: draw on kill (LKI)")
        # Bombardier splash handled in carddata attack hook if present

    # =====================================================================
    # STATE CHECK
    # =====================================================================
    def check_state(self):
        for i, p in enumerate(self.players):
            p.board = [c for c in p.board if not c.dead]
            if p.hero_hp <= 0 and self.winner is None:
                self.winner = 1 - i
        # both dead -> active player loses (simplification, documented)
        if self.players[0].hero_hp <= 0 and self.players[1].hero_hp <= 0:
            self.winner = 1 - self.active

    def is_over(self) -> bool:
        return self.winner is not None
