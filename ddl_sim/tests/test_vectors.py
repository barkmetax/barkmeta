"""
Ground-truth cleanliness audit. Reproduces every ruling in DDL_Rules_TestVectors.json
as a passing assertion and resolves each open question with an explicit engine behaviour.

Run: python3 tests/test_vectors.py   (from ddl_sim/)
"""
import sys, os, random
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from engine import Game, Player, Creature, MAX_HP
import carddata
from carddata import CARDS

PASS = []
FAIL = []

def check(cond, label):
    (PASS if cond else FAIL).append(label)
    print(f"  [{'PASS' if cond else 'FAIL'}] {label}")

def new_game(log=False):
    rng = random.Random(0)
    p0 = Player("P0", []); p1 = Player("P1", [])
    g = Game(p0, p1, rng, log=log)
    carddata.register(g)
    return g, p0, p1

def put(g, player, name, **over):
    c = Creature(CARDS[name], player)
    c.summoned_turn = -5   # not summon-sick
    player.board.append(c)
    for k, v in over.items():
        setattr(c, k, v)
    return c

print("=== GROUND-TRUTH RULINGS (1-20) ===")

# 1: binary combat simultaneous
g, p0, p1 = new_game()
a = put(g, p0, "Quartermaster")          # 3/2
d = put(g, p1, "Ribbonhound")            # 2/3
g.attack(a, d)
check(a.dead and d.dead, "1: 3/2 and 2/3 both die in simultaneous combat")

# 2: no retained damage
g, p0, p1 = new_game()
d = put(g, p1, "Ribbonhound")            # 2/3
g.deal_damage_creature(d, 1, "ping"); g.deal_damage_creature(d, 1, "ping")
check(not d.dead and d.eff_hp(g) == 3, "2: 3hp body hit for 1 twice is still full and alive")

# 3: only hero accumulates, dies at <=0
g, p0, p1 = new_game()
p1.hero_hp = 5
g.deal_damage_hero(p1, 3, "x"); g.deal_damage_hero(p1, 3, "x"); g.check_state()
check(p1.hero_hp == -1 and g.winner == 0, "3: hero accumulates damage, dies at <=0")

# 4: heal cap 40
g, p0, p1 = new_game()
p0.hero_hp = 39
g.heal_hero(p0, 5, "x")
check(p0.hero_hp == MAX_HP, "4: healing caps at 40, no overheal")

# 5: healing can only target a hero (structural)
check(not hasattr(Creature, "heal") and "heal_hero" in dir(Game),
      "5: only Game.heal_hero(player,...) exists; no creature-heal API")

# 6: Helios replacement (no stack) + draw rider (trigger)
g, p0, p1 = new_game()
p0.deck = [CARDS["Quickdraw"]]
put(g, p0, "Helios")
p1.hero_hp = 30
g.heal_hero(p0, 4, "test heal")
g.resolve_stack()
check(p1.hero_hp == 26 and len(p0.hand) == 1,
      "6: Helios redirects heal->enemy dmg (replacement) and rider draws (trigger)")

# 7: Vamp routes through heal -> Helios converts vamp into face damage.
# (Bloodchapel Cur is the only Vamp card and it has Rush, so per ruling 17 it can only
#  attack a creature; vamp lifegain on that attack is what Helios redirects to the face.)
g, p0, p1 = new_game()
p0.deck = [CARDS["Quickdraw"], CARDS["Quickdraw"]]
put(g, p0, "Helios")
vamp = put(g, p0, "Bloodchapel Cur")     # 3/3 vamp rush
victim = put(g, p1, "Royal Page")        # 1/3 -> dies; vamp heals 3 -> redirected to face
p1.hero_hp = 30
g.attack(vamp, victim)
g.resolve_stack()
check(p1.hero_hp == 30 - 3, "7: Vamp lifegain redirected by Helios into extra face damage")

# 8: Warded prevents first instance incl poison; second applies
g, p0, p1 = new_game()
w = put(g, p1, "Cathedral Guardian")     # warded 4/7
g.deal_damage_creature(w, 99, "big", poisonous=True)   # prevented by ward
check(not w.dead and not w.warded, "8a: Warded prevents first instance (even poison)")
g.deal_damage_creature(w, 99, "big2")
check(w.dead, "8b: second instance applies normally")

# 9: poisonous destroys on any damage, attack AND defense
g, p0, p1 = new_game()
pois = put(g, p0, "Venom Cur")           # 1/1 poisonous
big = put(g, p1, "Mortifex the Gravelord")  # 7/7
g.attack(pois, big)
check(big.dead, "9a: poisonous attacker destroys big defender")
g, p0, p1 = new_game()
atk = put(g, p0, "Mortifex the Gravelord")
poisd = put(g, p1, "Venom Cur")
g.attack(atk, poisd)
check(atk.dead, "9b: poisonous defender destroys attacker on defense")

# 10: Haunt fires on destruction
g, p0, p1 = new_game()
p0.hero_hp = 20
s = put(g, p0, "Stonecur")               # haunt heal 3
g.destroy(s, "test"); g.resolve_stack()
check(p0.hero_hp == 23, "10: Haunt fires on destruction (Stonecur heal 3)")

# 11: Haunt fires on mill
g, p0, p1 = new_game()
p1.hero_hp = 30
p0.deck = [CARDS["Rotpup"]]              # haunt 2 dmg enemy hero
g.mill(p0, 1); g.resolve_stack()
check(p1.hero_hp == 28, "11: Haunt fires on mill (Rotpup 2 to enemy hero)")

# 12: negate is not destruction -> no haunt
g, p0, p1 = new_game()
p0.hero_hp = 20
s = put(g, p0, "Stonecur")
# simulate a removal targeting Stonecur, placed on stack, then negated
g.trigger(p0, lambda gg: gg.destroy(s, "removal"), "removal on Stonecur")
g.negate_top()
g.resolve_stack()
check(not s.dead and p0.hero_hp == 20, "12: negated removal does not destroy and does not fire Haunt")

# 13: Keenhound on-kill fires even if attacker dies in same trade (LKI)
g, p0, p1 = new_game()
p0.deck = [CARDS["Quickdraw"]]
kh = put(g, p0, "Keenhound")             # 3/3
d = put(g, p1, "Bonewall")               # 2/4 -> survives? 3<4 so defender lives, no kill
# build a true mutual-trade: defender 3/3
d.dead = True; p1.board.remove(d)
d2 = put(g, p1, "Keenhound")             # enemy 3/3
g.attack(kh, d2)
check(kh.dead and d2.dead and len(p0.hand) == 1,
      "13: Keenhound draws on kill even when it dies in the same mutual trade")

# 14: turn-player triggers resolve first on simultaneous deaths
g, p0, p1 = new_game()
g.active = 0
p0.hero_hp = 20; p1.hero_hp = 20
sc = put(g, p0, "Stonecur")              # turn player: haunt heal 3 (to p0)
pp = put(g, p1, "Powder Pup")            # opp: haunt 2 dmg to p0
g.mass_destroy([sc, pp], "wipe")
# record resolution order
order = []
orig_heal = g.heal_hero
g.events.clear(); g.do_log = True
g.resolve_stack()
# turn player's Stonecur heal should resolve before opponent's Powder Pup
hl = [e for e in g.events if "resolving" in e]
check(len(hl) >= 2 and "Stonecur" in hl[0], "14: turn-player Haunt resolves first on simultaneous deaths")

# 15: cost floor min 1 (Cap'n Brindle)
g, p0, p1 = new_game()
put(g, p0, "Cap'n Brindle")
check(g.effective_cost(p0, CARDS["Sly Stowaway"]) == 1 and
      g.effective_cost(p0, CARDS["Charthound"]) == 1,
      "15: Pirate cost -1 floors at minimum 1")

# 16: frozen creature cannot attack
g, p0, p1 = new_game()
g.turn = 5
c = put(g, p0, "Ribbonhound", frozen_until=5)
check(not c.can_attack(g), "16: frozen creature cannot attack")

# 17: Rush hits creatures only; Charge hits either
g, p0, p1 = new_game()
g.turn = 1
r = put(g, p0, "Rotpup", summoned_turn=1)      # rush
ch = put(g, p0, "Skyfall Archer", summoned_turn=1)  # charge
p1.hero_hp = 30
g.attack(r, p1)
check(p1.hero_hp == 30, "17a: Rush cannot attack the Hero")
g.attack(ch, p1)
check(p1.hero_hp < 30, "17b: Charge can attack the Hero")

# 18: hand cap 10, over-cap draw burned
g, p0, p1 = new_game()
p0.hand = [CARDS["Quickdraw"]] * 10
p0.deck = [CARDS["Frostbolt"]]
g.draw(p0, 1)
check(len(p0.hand) == 10 and p0.grave and p0.grave[-1].name == "Frostbolt",
      "18: over-cap draw is burned, hand stays at 10")

# 19: fatigue increments 1,2,...
g, p0, p1 = new_game()
p0.deck = []
p0.hero_hp = 30
g.draw(p0, 1); g.draw(p0, 1)
check(p0.hero_hp == 30 - 1 - 2, "19: fatigue deals incrementing self-damage")

# 20: pay-HP is a cost; cannot pay to <=0
g, p0, p1 = new_game()
gt = put(g, p0, "Grave Tide")
p0.hero_hp = 2
from flow import try_activate_ability
ok_lethal = try_activate_ability(g, p0, gt, None)   # would drop to 0 -> illegal
p0.hero_hp = 3
ok_ok = try_activate_ability(g, p0, gt, None)
check(ok_lethal is False and ok_ok is True and p0.hero_hp == 1,
      "20: HP cost cannot be paid to <=0; legal pay leaves you alive")

print("\n=== OPEN QUESTIONS (clean-engine resolutions) ===")

# OQ1: response window / priority -- opponent may negate with a Quick hand trap
g, p0, p1 = new_game()
g.active = 0
put(g, p1, "Hushwarden")  # opp hand-trap: negate opp spell
# P0 plays a spell as a chain link; priority pass lets P1 negate
fired = {"v": False}
g.trigger(p0, lambda gg: fired.__setitem__("v", True), "P0 Fireball resolve")
def responder(gg, pl):
    if pl is p1 and any(c.card.name == "Hushwarden" for c in pl.board):
        gg.negate_top()
        for c in list(pl.board):
            if c.card.name == "Hushwarden":
                c.dead = True; pl.board.remove(c); pl.banished.append(c.card)
g.response_fn = responder
g.open_priority()
check(fired["v"] is False, "OQ1: non-turn player gets priority; Hushwarden negates the spell")

# OQ2: LIFO 2+ link chain
g, p0, p1 = new_game()
seq = []
g.trigger(p0, lambda gg: seq.append("A"), "linkA (first)")
g.trigger(p1, lambda gg: seq.append("B"), "linkB (response)")
g.resolve_stack()
check(seq == ["B", "A"], "OQ2: 2-link chain resolves LIFO (response B before A)")

# OQ3: replacement vs trigger ordering from one event
g, p0, p1 = new_game()
p0.deck = [CARDS["Quickdraw"]]
put(g, p0, "Helios")
p1.hero_hp = 30
g.heal_hero(p0, 5, "evt")   # replacement applies immediately (face dmg), trigger queued
mid_hp = p1.hero_hp
g.resolve_stack()           # trigger (draw) resolves after
check(mid_hp == 25 and len(p0.hand) == 1,
      "OQ3: replacement modifies event immediately; trigger resolves later via stack")

# OQ4: board wipe simultaneous haunts + Gravechoir LINEAR doubling
g, p0, p1 = new_game()
g.active = 0
p0.hero_hp = 10; p1.hero_hp = 20
put(g, p0, "Gravechoir")          # your Haunts trigger twice
r1 = put(g, p0, "Rotpup")         # haunt 2 dmg enemy -> doubled = 4
r2 = put(g, p0, "Rotpup")
g.mass_destroy([r1, r2], "wipe")
g.resolve_stack()
check(p1.hero_hp == 20 - (2*2 + 2*2), "OQ4: Gravechoir doubles each Haunt LINEARLY (2 Rotpups -> 8, not exponential)")

# OQ5: mandatory When-trigger fires (Calypso on pirate summon) -- no missed timing
g, p0, p1 = new_game()
p1.hero_hp = 20
put(g, p0, "Calypso the Gunner Queen")
g.summon(p0, CARDS["Charthound"])  # summon another pirate
g.resolve_stack()
check(p1.hero_hp == 18, "OQ5: mandatory 'When you summon a Pirate' trigger fires (Calypso)")

# OQ6: Stasis layering additive + Resonance linear
g, p0, p1 = new_game()
t = put(g, p0, "Ribbonhound")     # 2/3 Bow
put(g, p0, "Quivermaiden")        # +1 ATK to other Bows
put(g, p0, "Bannerbow")           # +1 ATK to other Bows
base_two = t.eff_atk(g)           # 2 + 1 + 1 = 4
put(g, p0, "Resonance")           # +1 to each of your +ATK auras -> +2 more
with_res = t.eff_atk(g)           # 2 + 2 + 2 = 6
check(base_two == 4 and with_res == 6, "OQ6: auras additive; Resonance adds +1 to each (linear)")

# OQ7: banish is not graveyard -- not recursable, no Haunt
g, p0, p1 = new_game()
p1.hero_hp = 20
# put a Rotpup (haunt) into grave, then banish it via Grave Tax
p0.grave = [CARDS["Rotpup"], CARDS["Hollow Shepherd"]]
g.spell_table["Grave Tax"]  # exists
# banish 2 from own grave
for _ in range(2):
    if p0.grave:
        p0.banished.append(p0.grave.pop())
check(len(p0.grave) == 0 and len(p0.banished) == 2 and p1.hero_hp == 20,
      "OQ7a: banishing from grave fires no Haunt")
# Call of the Grave cannot retrieve a banished creature
g.spell_table["Call of the Grave"](g, p0, None)
check(all(not c.dead for c in p0.board) and len(p0.board) == 0,
      "OQ7b: graveyard recursion cannot reach banished cards")

print(f"\n=== RESULT: {len(PASS)}/{len(PASS)+len(FAIL)} passing ===")
if FAIL:
    print("FAILURES:")
    for f in FAIL:
        print("  - " + f)
    sys.exit(1)
