"""
Turn flow / legal-action layer on top of the rules core.

Keeps the event+stack discipline: every play opens a priority window and resolves the
chain. The pilot (ai.py) chooses among the legal actions this module exposes.
"""
from __future__ import annotations
import random
from engine import Game, Player, Creature, MAX_MANA, HAND_CAP, START_HP, DECK_SIZE
import carddata
from carddata import CARDS


# ---------------------------------------------------------------- setup
def start_game(deck0, deck1, rng: random.Random, log=False, first=0):
    p0 = Player("P0", list(deck0)); p1 = Player("P1", list(deck1))
    g = Game(p0, p1, rng, log=log)
    carddata.register(g)
    for p in g.players:
        rng.shuffle(p.deck)
    g.active = first
    # opening hands: first player 3, second 4 (no coin) -- documented assumption
    draw_open(g, g.players[first], 3)
    draw_open(g, g.players[1 - first], 4)
    g.turn = 0
    return g


def draw_open(g, p, n):
    for _ in range(n):
        if p.deck:
            p.hand.append(p.deck.pop(0))


# ---------------------------------------------------------------- turn phases
def begin_turn(g: Game):
    p = g.cur()
    p.max_mana = min(MAX_MANA, p.max_mana + 1)
    p.mana = p.max_mana
    p.summons_this_turn = 0
    p.summoned_uids_this_turn = []
    for c in p.board:
        c.attacked_this_turn = False
        c.ability_used_this_turn = 0
        c.temp_atk = 0
    # start-of-turn Stasis effects (Sun King heal, Doomsayer wipe)
    for c in list(p.board):
        fn = g.start_turn_table.get(c.card.name)
        if fn and not c.dead:
            fn(g, c)
    g.resolve_stack()
    # Frost Lock / Deep Freeze self-destruct at your turn start handled as flags on creatures:
    # (modelled via cannot_attack_until expiry -- no object to destroy in this simplified pass)
    g.draw(p, 1)
    g.resolve_stack()
    g.check_state()


def end_turn(g: Game):
    p = g.cur()
    for c in list(p.board):
        fn = g.end_turn_table.get(c.card.name)
        if fn and not c.dead:
            fn(g, c)
    g.resolve_stack()
    # expire this-turn buffs / temp keywords (Coat the Blades poison, Full Bloom, Loose, etc.)
    for pl in g.players:
        for c in pl.board:
            c.temp_atk = 0
            c.temp_keywords.discard("rush")
            c.temp_keywords.discard("poisonous")
            c.temp_keywords.discard("charge")
    g.check_state()
    g.active = 1 - g.active
    g.turn += 1


# ---------------------------------------------------------------- plays
def play_creature(g: Game, p: Player, card, combo_active: bool, targets=None) -> bool:
    cost = g.effective_cost(p, card)
    if p.mana < cost or len(p.board) >= 7:
        return False
    p.mana -= cost
    p.hand.remove(card)
    # Pitfall / Torrential Tribute traps may respond to the summon (handled in summon hooks)
    cr = g.summon(p, card, from_zone="hand")
    if cr is None:
        return False
    # Combo: trigger if another card was played earlier this turn
    if combo_active and card.name in g.combo_table:
        fn = g.combo_table[card.name]
        try:
            fn(g, cr)
        except TypeError:
            fn(g, cr, None)
    # Play effect (Twinsoul doubles Play effects)
    pf = g.play_table.get(card.name)
    if pf:
        times = 2 if any(x.card.name == "Twinsoul" and not x.dead for x in p.board) else 1
        for _ in range(times):
            pf(g, cr)
    g.open_priority()
    g.check_state()
    return True


def play_spell(g: Game, p: Player, card, target=None) -> bool:
    cost = g.effective_cost(p, card)
    if p.mana < cost:
        return False
    p.mana -= cost
    p.hand.remove(card)
    # Embermane (draw on spell), Emberwisp (2 dmg), Wyrmling (+1 atk) -- spell-cast triggers
    for c in p.board:
        if c.card.name == "Embermane" and not c.dead:
            g.trigger(p, lambda gg: gg.draw(p, 1), "Embermane: draw on spell")
        if c.card.name == "Emberwisp the Kindler" and not c.dead:
            g.trigger(p, lambda gg: gg.deal_damage_hero(p.opponent, 2, "Emberwisp"), "Emberwisp: 2 dmg on spell")
        if c.card.name == "Wyrmling" and not c.dead:
            c.temp_atk += 1
    fn = g.spell_table.get(card.name)
    if fn:
        fn(g, p, target)
    p.grave.append(card)
    g.open_priority()
    g.check_state()
    return True


def set_trap(g: Game, p: Player, card) -> bool:
    cost = g.effective_cost(p, card)
    if p.mana < cost:
        return False
    p.mana -= cost
    p.hand.remove(card)
    p.traps.append(card)
    return True


def try_activate_ability(g: Game, p: Player, creature: Creature, target) -> bool:
    """Activated abilities. Enforces Silence Cur lock, mana/HP cost, once-per-turn,
    and the ruling-20 gate: an HP cost that would drop you to <=0 cannot be paid."""
    spec = g.ability_table.get(creature.card.name)
    if spec is None or creature.dead:
        return False
    mana_cost, hp_cost, fn, once = spec
    # Silence Cur: creatures' Abilities cannot be activated
    if any(c.card.name == "Silence Cur" and not c.dead for pl in g.players for c in pl.board):
        return False
    if once and creature.ability_used_this_turn:
        return False
    if p.mana < mana_cost:
        return False
    if hp_cost and p.hero_hp - hp_cost <= 0:   # ruling 20: cannot pay to your own death
        return False
    p.mana -= mana_cost
    if hp_cost:
        p.hero_hp -= hp_cost
    fn(g, creature, target)
    creature.ability_used_this_turn += 1
    g.open_priority()
    g.check_state()
    return True


# ---------------------------------------------------------------- legal moves
def legal_attacks(g: Game, p: Player):
    moves = []
    enemy = p.opponent
    taunts = [c for c in enemy.board if "taunt" in c.kw() and not c.dead]
    for c in p.board:
        if not c.can_attack(g):
            continue
        kws = c.kw()
        targets = list(taunts) if taunts else list(enemy.board)
        for t in targets:
            moves.append(("attack", c, t))
        if not taunts and not ("rush" in kws and "charge" not in kws):
            moves.append(("attack", c, enemy))   # face
    return moves
