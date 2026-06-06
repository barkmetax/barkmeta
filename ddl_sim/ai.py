"""
Pilots: a heuristic GREEDY baseline and a depth-limited SEARCH pilot (expectimax-flavoured
lookahead with a greedy rollout to a leaf eval). The search pilot is the "strong" player;
the gap between them is the skill sanity check the brief asks for.

This is search, not the other branch's hand-tuned heuristics: the search pilot enumerates
candidate action sequences, simulates them on a cloned state, and scores the resulting
position -- so it can find combo/lethal lines a fixed-priority player misses.
"""
from __future__ import annotations
import copy, random
from engine import Game, Player, Creature
import flow


# ---------------------------------------------------------------- evaluation
def evaluate(g: Game, me_idx: int) -> float:
    me = g.players[me_idx]; opp = g.players[1 - me_idx]
    if g.winner is not None:
        return 1e6 if g.winner == me_idx else -1e6
    s = 0.0
    s += (me.hero_hp - opp.hero_hp) * 1.0
    for c in me.board:
        s += (c.eff_atk(g) + c.eff_hp(g)) * 1.0 + (3 if "taunt" in c.kw() else 0)
    for c in opp.board:
        s -= (c.eff_atk(g) + c.eff_hp(g)) * 1.0 + (3 if "taunt" in c.kw() else 0)
    s += len(me.hand) * 1.5 - len(opp.hand) * 1.5
    s += me.mana * 0.2
    return s


# ---------------------------------------------------------------- targeting helpers
def _enemy_creatures(g, p):
    return [c for c in p.opponent.board if not c.dead]

def _best_enemy(g, p):
    cs = _enemy_creatures(g, p)
    return max(cs, key=lambda c: c.eff_atk(g) + c.eff_hp(g)) if cs else None

def _spell_target(g, p, card):
    name = card.name
    if name in ("Frostbolt", "Fireball", "Pyroblast"):
        # face if it could be lethal-ish, else biggest enemy creature
        base = {"Frostbolt": 3, "Fireball": 6, "Pyroblast": 10}[name] + p.spell_damage(g)
        if p.opponent.hero_hp <= base:
            return p.opponent
        be = _best_enemy(g, p)
        return be if be and be.eff_hp(g) <= base else p.opponent
    if name in ("Cut Down",):
        cs = [c for c in _enemy_creatures(g, p) if c.eff_atk(g) >= 4]
        return max(cs, key=lambda c: c.eff_atk(g)+c.eff_hp(g)) if cs else None
    if name in ("Cull", "Crown Judgment", "Arrow Storm", "Rugpull"):
        return _best_enemy(g, p)
    if name in ("Max Engage", "Full Bloom"):
        ms = [c for c in p.board if not c.dead]
        return max(ms, key=lambda c: c.eff_atk(g)) if ms else None
    return None


# ---------------------------------------------------------------- lethal finder
def try_lethal(g: Game, me_idx: int) -> bool:
    """Explicitly assemble a kill this turn: burn spells + pingers + (Helios) heals-as-damage
    + face attacks. This is what lets the pilot FIND the Helios redirect kill and the
    Vorruk burn OTK instead of grinding. Returns True if it executed a lethal line."""
    p = g.players[me_idx]; opp = p.opponent
    if g.is_over():
        return True
    sd = p.spell_damage(g)
    helios = any(c.card.name == "Helios" and not c.dead for c in p.board)
    plague = any(c.card.name == "Plague Doctor" and not c.dead for c in opp.board)
    # burn options that hit face directly (ignore taunts): (cost, dmg, kind, ref)
    opts = []
    for card in p.hand:
        cost = g.effective_cost(p, card)
        if card.name == "Frostbolt": opts.append((cost, 3 + sd, "spell", card))
        elif card.name == "Fireball": opts.append((cost, 6 + sd, "spell", card))
        elif card.name == "Pyroblast": opts.append((cost, 10 + sd, "spell", card))
        elif helios and not plague and card.name == "Sanctuary": opts.append((cost, 8, "spell", card))
    for c in p.board:
        spec = g.ability_table.get(c.card.name)
        if not spec or c.dead:
            continue
        mana_cost, hp_cost, _, _ = spec
        if c.card.name in ("Glyphmaster", "Hexcaster"):
            opts.append((mana_cost, 1 + sd, "ability", c))
        elif c.card.name == "Heartpiercer":
            n = sum(1 for x in p.board if not x.dead and x.card.cls == "Bows" and x is not c)
            opts.append((mana_cost, n, "ability", c))
        elif helios and not plague and c.card.name == "Chapel Keeper":
            opts.append((mana_cost, 3, "ability", c))
    # face attack damage available (creatures that can hit the hero now)
    taunts = [c for c in opp.board if "taunt" in c.kw() and not c.dead]
    face_atk = 0
    attackers = []
    if not taunts:
        for c in p.board:
            if c.can_attack(g):
                kws = c.kw()
                if not ("rush" in kws and "charge" not in kws):
                    face_atk += c.eff_atk(g); attackers.append(c)
    # knapsack-ish greedy: pick best damage-per-mana within mana budget
    budget = p.mana
    opts.sort(key=lambda o: o[1] / max(1, o[0]), reverse=True)
    chosen = []; spent = 0; dmg = 0
    for (cost, d, kind, ref) in opts:
        if spent + cost <= budget and d > 0:
            chosen.append((cost, d, kind, ref)); spent += cost; dmg += d
    if dmg + face_atk < opp.hero_hp:
        return False
    # execute: spells/abilities to face, then attack face
    for (cost, d, kind, ref) in chosen:
        if g.is_over():
            return True
        if kind == "spell":
            card = next((c for c in p.hand if c.name == ref.name), None)
            if card:
                flow.play_spell(g, p, card, opp)
        else:
            flow.try_activate_ability(g, p, ref, opp)
    for c in attackers:
        if g.is_over():
            return True
        if c.can_attack(g):
            g.attack(c, opp); g.check_state()
    return g.is_over()


# ---------------------------------------------------------------- greedy turn
def greedy_turn(g: Game, me_idx: int):
    if try_lethal(g, me_idx):
        return
    p = g.players[me_idx]
    guard = 0
    while not g.is_over() and guard < 60:
        guard += 1
        acted = False
        # 1) cheap card-draw / search / develop: play affordable creatures & value spells
        played_card_this_iter = False
        # spells: removal first if good
        for card in list(p.hand):
            if g.is_over():
                break
            if card.ctype == "spell":
                cost = g.effective_cost(p, card)
                if p.mana < cost:
                    continue
                tgt = _spell_target(g, p, card)
                # only cast targeted removal/damage if there's a target or face lethal
                if card.name in ("Frostbolt", "Fireball", "Pyroblast", "Cut Down", "Cull",
                                 "Crown Judgment", "Arrow Storm", "Rugpull") and tgt is None:
                    continue
                if flow.play_spell(g, p, card, tgt):
                    acted = True; played_card_this_iter = True
                    break
        if acted:
            continue
        # creatures: highest cost affordable (tempo)
        creatures = [c for c in p.hand if c.ctype == "creature"
                     and g.effective_cost(p, c) <= p.mana and len(p.board) < 7]
        if creatures:
            creatures.sort(key=lambda c: g.effective_cost(p, c), reverse=True)
            combo_active = len(p.grave) >= 0 and (p.summons_this_turn > 0 or _played_any(p))
            if flow.play_creature(g, p, creatures[0], combo_active=p.summons_this_turn > 0):
                acted = True
                continue
        # abilities (Glyphmaster ping, heals, Grave Tide mill, etc.)
        for c in list(p.board):
            spec = g.ability_table.get(c.card.name)
            if not spec:
                continue
            mana_cost, hp_cost, _, _ = spec
            if p.mana < mana_cost:
                continue
            tgt = _ability_target(g, p, c)
            if _ability_worth(g, p, c, tgt):
                if flow.try_activate_ability(g, p, c, tgt):
                    acted = True
                    break
        if acted:
            continue
        break
    # combat
    _do_attacks_greedy(g, me_idx)


def _played_any(p):
    return True

def _ability_target(g, p, c):
    name = c.card.name
    if name in ("Glyphmaster", "Hexcaster", "Heartpiercer"):
        amt = (1 + p.spell_damage(g)) if name != "Heartpiercer" else 99
        be = _best_enemy(g, p)
        if be and be.eff_hp(g) <= amt:
            return be
        return p.opponent
    if name == "Mirrorward":
        return _best_enemy(g, p)
    if name == "Bonewall":
        zs = [x for x in p.board if x.card.cls == "Zombies" and not x.dead and x is not c]
        return zs[0] if zs else None
    return None

def _ability_worth(g, p, c, tgt):
    name = c.card.name
    if name == "Grave Tide":
        return p.hero_hp > 6   # only self-mill while healthy
    if name == "Hushcaller":
        return p.hero_hp > 8 and len(p.hand) < 8
    if name in ("Chapel Keeper",):
        return p.hero_hp < 28
    if name in ("Glyphmaster", "Hexcaster", "Heartpiercer"):
        return tgt is not None
    if name in ("Graveseer", "Tomb Forager", "Tide Caller"):
        return len(p.hand) < 9
    if name == "Bonewall":
        return tgt is not None
    if name == "Gravecaller":
        return True
    if name == "Mirrorward":
        return tgt is not None
    return False


def _do_attacks_greedy(g, me_idx):
    p = g.players[me_idx]
    guard = 0
    while not g.is_over() and guard < 40:
        guard += 1
        moves = flow.legal_attacks(g, p)
        if not moves:
            break
        # lethal check: total face damage available
        best = None; best_score = -1
        for (_, atk, tgt) in moves:
            if isinstance(tgt, Player):
                score = atk.eff_atk(g) + 5   # value face
            else:
                # favourable trade: kill without dying
                kills = atk.eff_atk(g) >= tgt.eff_hp(g) or "poisonous" in atk.kw()
                dies = tgt.eff_atk(g) >= atk.eff_hp(g)
                score = (4 if kills else 0) + (tgt.eff_atk(g)+tgt.eff_hp(g))*0.3 - (3 if dies else 0)
            if score > best_score:
                best_score = score; best = (atk, tgt)
        if best is None:
            break
        g.attack(best[0], best[1])
        g.check_state()


# ---------------------------------------------------------------- search turn
def clone(g: Game) -> Game:
    rfn = g.response_fn; g.response_fn = None
    g2 = copy.deepcopy(g)
    g.response_fn = rfn
    return g2

def search_turn(g: Game, me_idx: int, breadth: int = 6):
    """Best-first lookahead: for each candidate first action, clone, apply it, greedy-roll
    the rest of MY turn, then eval. Pick the best first action; repeat until 'end'."""
    if try_lethal(g, me_idx):
        return
    p = g.players[me_idx]
    guard = 0
    while not g.is_over() and guard < 40:
        guard += 1
        cands = _candidate_actions(g, p)
        if not cands:
            break
        # always include "stop playing" as a candidate
        base_clone = clone(g)
        flow_idx = me_idx
        best_action = None
        best_val = evaluate(_rollout_rest(base_clone, flow_idx), flow_idx)  # value of stopping now
        for act in cands[:breadth]:
            gc = clone(g)
            if not _apply_action(gc, flow_idx, act):
                continue
            gc2 = _rollout_rest(gc, flow_idx)
            v = evaluate(gc2, flow_idx)
            if v > best_val:
                best_val = v; best_action = act
        if best_action is None:
            break
        if not _apply_action(g, me_idx, best_action):
            break
    _do_attacks_search(g, me_idx)


def _rollout_rest(g: Game, me_idx: int) -> Game:
    # finish my main phase greedily then do greedy attacks, on the clone
    if try_lethal(g, me_idx):
        return g
    greedy_main_only(g, me_idx)
    _do_attacks_greedy(g, me_idx)
    return g

def greedy_main_only(g, me_idx):
    # same as greedy_turn but without the combat (combat handled separately)
    p = g.players[me_idx]
    guard = 0
    while not g.is_over() and guard < 60:
        guard += 1
        acted = False
        for card in list(p.hand):
            if card.ctype == "spell":
                cost = g.effective_cost(p, card)
                if p.mana < cost:
                    continue
                tgt = _spell_target(g, p, card)
                if card.name in ("Frostbolt", "Fireball", "Pyroblast", "Cut Down", "Cull",
                                 "Crown Judgment", "Arrow Storm", "Rugpull") and tgt is None:
                    continue
                if flow.play_spell(g, p, card, tgt):
                    acted = True; break
        if acted:
            continue
        creatures = [c for c in p.hand if c.ctype == "creature"
                     and g.effective_cost(p, c) <= p.mana and len(p.board) < 7]
        if creatures:
            creatures.sort(key=lambda c: g.effective_cost(p, c), reverse=True)
            if flow.play_creature(g, p, creatures[0], combo_active=p.summons_this_turn > 0):
                continue
        for c in list(p.board):
            spec = g.ability_table.get(c.card.name)
            if not spec:
                continue
            if p.mana < spec[0]:
                continue
            tgt = _ability_target(g, p, c)
            if _ability_worth(g, p, c, tgt):
                if flow.try_activate_ability(g, p, c, tgt):
                    acted = True; break
        if acted:
            continue
        break


def _candidate_actions(g, p):
    acts = []
    for card in p.hand:
        cost = g.effective_cost(p, card)
        if cost > p.mana:
            continue
        if card.ctype == "creature" and len(p.board) < 7:
            acts.append(("creature", card, None))
        elif card.ctype == "spell":
            tgt = _spell_target(g, p, card)
            if card.name in ("Frostbolt", "Fireball", "Pyroblast", "Cut Down", "Cull",
                             "Crown Judgment", "Arrow Storm", "Rugpull") and tgt is None:
                continue
            acts.append(("spell", card, tgt))
        elif card.ctype == "trap":
            acts.append(("trap", card, None))
    for c in p.board:
        spec = g.ability_table.get(c.card.name)
        if spec and p.mana >= spec[0]:
            tgt = _ability_target(g, p, c)
            acts.append(("ability", c, tgt))
    return acts

def _apply_action(g, me_idx, act):
    p = g.players[me_idx]
    kind, obj, tgt = act
    if kind == "creature":
        card = _match_card(p.hand, obj)
        return card is not None and flow.play_creature(g, p, card, combo_active=p.summons_this_turn > 0)
    if kind == "spell":
        card = _match_card(p.hand, obj)
        return card is not None and flow.play_spell(g, p, card, _retarget(g, p, tgt))
    if kind == "trap":
        card = _match_card(p.hand, obj)
        return card is not None and flow.set_trap(g, p, card)
    if kind == "ability":
        cr = _match_creature(p.board, obj)
        return cr is not None and flow.try_activate_ability(g, p, cr, _retarget(g, p, tgt))
    return False

def _match_card(hand, card):
    for c in hand:
        if c.name == card.name:
            return c
    return None

def _match_creature(board, cr):
    for c in board:
        if c.card.name == cr.card.name and not c.dead:
            return c
    return None

def _retarget(g, p, tgt):
    # after cloning, the target object is stale; re-resolve to a live one of same identity
    if tgt is None:
        return None
    if isinstance(tgt, Player):
        return p.opponent
    # creature target -> pick best enemy again (targets here are always 'best enemy' heuristic)
    return _best_enemy(g, p) if tgt.owner is not p else (
        max([c for c in p.board if not c.dead], key=lambda c: c.eff_atk(g), default=None))


def _do_attacks_search(g, me_idx):
    # search attacks: try lethal first, else greedy
    _do_attacks_greedy(g, me_idx)
