"""
All 111 DDL cards as static data + behaviour registries.

Counts (must match Section F): 111 total = 14 Bows + 14 Crowns + 14 Pirates +
14 Wizards + 14 Zombies + 41 Neutral (18 creatures + 17 spells + 6 traps).
3 LIVE cards: Keenhound, Helios, Grave Tide. Everything else LOCKED.

Behaviour tables are attached to a Game in register(game). Vanilla creatures need
no entry. Auras are (kind, amount, predicate) tuples for Stasis stat effects;
non-stat Stasis effects (Helios redirect, Plague Doctor, Vorruk SD, etc.) are
handled directly in engine.py.
"""
from engine import Card, Creature, Player, Game

C = Card

def _kw(*k):
    return tuple(k)

CARDS: dict[str, Card] = {}

def add(c: Card):
    CARDS[c.name] = c

# ---------------- BOWS (12 creatures + 2 spells) ----------------
add(C("Quivermaiden", "Bows", 6, "creature", 5, 6, "S", text="Stasis: other Bow Creatures +1 ATK."))
add(C("Keenhound", "Bows", 3, "creature", 3, 3, "A", live=True, text="On attack a Creature and destroy it, draw."))
add(C("Stormfletch Aria", "Bows", 5, "creature", 4, 5, "A", text="Stasis: end of turn deal 1 to enemy hero per other Bow."))
add(C("Bow Matron", "Bows", 6, "creature", 5, 6, "A", text="Play: draw per other Bow."))
add(C("Ribbon Pup", "Bows", 1, "creature", 2, 1, "B", text="Play: if another Bow, gain Charge."))
add(C("Bow Keeper", "Bows", 2, "creature", 2, 2, "B", text="Play: search Bow cost<=3."))
add(C("Ribbonhound", "Bows", 2, "creature", 2, 3, "B", keywords=_kw("rush"), text="Rush."))
add(C("Dartbow", "Bows", 2, "creature", 2, 2, "B", keywords=_kw("wildfury"), text="Wildfury."))
add(C("Bannerbow", "Bows", 3, "creature", 2, 3, "B", text="Stasis: other Bow Creatures +1 ATK."))
add(C("Heartpiercer", "Bows", 3, "creature", 2, 3, "B", text="Ability(2): 1 dmg per other Bow to any target."))
add(C("Satin Runner", "Bows", 4, "creature", 3, 3, "B", text="Play: draw per other Bow."))
add(C("Skyfall Archer", "Bows", 4, "creature", 3, 2, "B", keywords=_kw("charge"), text="Charge. Stasis: +3 ATK if alone."))
add(C("Arrow Storm", "Bows", 2, "spell", rarity="B", text="Deal 2 to a Creature per Bow you control."))
add(C("Full Bloom", "Bows", 3, "spell", rarity="B", text="Bow Creatures +2 ATK this turn."))

# ---------------- CROWNS (12 + 2) ----------------
add(C("Mama Bark", "Crowns", 5, "creature", 4, 6, "S", keywords=_kw("taunt"), text="Taunt. Stasis: heal hero +2 more."))
add(C("Dawn Acolyte", "Crowns", 3, "creature", 2, 4, "A", text="Stasis: on heal deal 1 to enemy hero."))
add(C("Cathedral Healer", "Crowns", 4, "creature", 2, 4, "A", text="Play: heal 4 or draw."))
add(C("Helios", "Crowns", 6, "creature", 2, 5, "A", live=True, text="Stasis: heal->dmg redirect; on hero dmg draw."))
add(C("Royal Page", "Crowns", 1, "creature", 1, 3, "B", keywords=_kw("taunt"), text="Taunt."))
add(C("Stonecur", "Crowns", 2, "creature", 1, 4, "B", keywords=_kw("taunt"), text="Taunt. Haunt: heal 3."))
add(C("Bastion Hound", "Crowns", 3, "creature", 1, 5, "B", text="Stasis: other Crowns +2 HP."))
add(C("Reliquary Hound", "Crowns", 3, "creature", 1, 4, "B", keywords=_kw("taunt"), text="Taunt. Play: search Crown cost<=4."))
add(C("Chapel Keeper", "Crowns", 3, "creature", 2, 3, "B", text="Ability(2): heal 3."))
add(C("Bloodchapel Cur", "Crowns", 3, "creature", 3, 3, "B", keywords=_kw("vamp", "rush"), text="Vamp. Rush."))
add(C("Cathedral Guardian", "Crowns", 6, "creature", 4, 7, "B", keywords=_kw("taunt", "warded"), text="Taunt. Warded. Haunt: heal 5."))
add(C("The Sun King", "Crowns", 6, "creature", 4, 6, "B", text="Stasis: start of turn heal per creature."))
add(C("Crown Judgment", "Crowns", 3, "spell", rarity="B", text="3 dmg to creature; 6 if you control a Crown."))
add(C("Sanctuary", "Crowns", 4, "spell", rarity="B", text="Heal 8."))

# ---------------- PIRATES (12 + 2) ----------------
add(C("Dread Captain Saoirse", "Pirates", 5, "creature", 5, 5, "S", keywords=_kw("rush", "wildfury"), text="Rush. Wildfury."))
add(C("Tide Caller", "Pirates", 3, "creature", 2, 4, "A", text="Ability(2): shuffle Pirate from grave, draw."))
add(C("Cap'n Brindle", "Pirates", 4, "creature", 2, 2, "A", text="Stasis: Pirates cost 1 less (min 1)."))
add(C("Calypso the Gunner Queen", "Pirates", 5, "creature", 4, 5, "A", text="Stasis: on Pirate summon 2 dmg enemy hero."))
add(C("Sly Stowaway", "Pirates", 1, "creature", 1, 2, "B", text="Combo: draw."))
add(C("Bilge Rat", "Pirates", 2, "creature", 2, 2, "B", text="Combo: draw then bottom a card."))
add(C("Charthound", "Pirates", 2, "creature", 2, 3, "B", text="Play: search Pirate cost<=3."))
add(C("Quartermaster", "Pirates", 2, "creature", 3, 2, "B", text="Combo: 2 dmg any target."))
add(C("Bombardier", "Pirates", 3, "creature", 3, 2, "B", text="Stasis: on attack creature, 2 dmg to adjacent."))
add(C("Powder Pup", "Pirates", 3, "creature", 2, 3, "B", text="Haunt: 2 dmg enemy hero."))
add(C("Broadside Gunner", "Pirates", 3, "creature", 2, 4, "B", text="Stasis: adjacent Pirates +2 ATK."))
add(C("Press-Gang", "Pirates", 5, "creature", 3, 3, "B", text="Play: summon Pirate cost<=3 from deck."))
add(C("Coat the Blades", "Pirates", 2, "spell", rarity="B", text="Give a Pirate Poisonous EOT. (Quick)"))
add(C("Chum the Water", "Pirates", 2, "spell", rarity="B", text="Draw 2 then bottom a card."))

# ---------------- WIZARDS (12 + 2) ----------------
add(C("Vorruk the Emberlord", "Wizards", 5, "creature", 4, 6, "S", text="Stasis: Spell Damage +1 per other Wizard."))
add(C("Embermane", "Wizards", 2, "creature", 2, 4, "A", text="Stasis: on Spell draw 1."))
add(C("Glacewisp", "Wizards", 3, "creature", 2, 4, "A", text="Stasis: Spells cost 1 less (min 1)."))
add(C("Emberwisp the Kindler", "Wizards", 3, "creature", 2, 3, "A", text="Stasis: on Spell 2 dmg enemy hero."))
add(C("Sparkpup", "Wizards", 1, "creature", 1, 2, "B", text="Spell Damage +1. Haunt: draw."))
add(C("Wyrmling", "Wizards", 1, "creature", 1, 3, "B", text="On Spell +1 ATK EOT."))
add(C("Mirrorward", "Wizards", 2, "creature", 0, 4, "B", keywords=_kw("warded"), text="Warded. Ability(3): target can't attack until your next turn."))
add(C("Scrollhound", "Wizards", 2, "creature", 2, 3, "B", text="Play: search Spell cost<=3."))
add(C("Tomekeeper", "Wizards", 3, "creature", 2, 3, "B", text="Play: mill 3, add Spells to hand."))
add(C("Glyphmaster", "Wizards", 4, "creature", 3, 4, "B", text="Spell Damage +3. Ability(2): 1 dmg + SD."))
add(C("Runewing", "Wizards", 4, "creature", 3, 5, "B", text="Spell Damage +1. Play: draw."))
add(C("Hexcaster", "Wizards", 4, "creature", 3, 4, "B", keywords=_kw("warded"), text="Warded. Ability(2): 1 dmg + SD."))
add(C("Frost Lock", "Wizards", 1, "spell", rarity="B", text="Stasis: target can't attack; destroy at your turn start."))
add(C("Deep Freeze", "Wizards", 3, "spell", rarity="B", text="Stasis: enemy creatures can't attack; destroy at turn start."))

# ---------------- ZOMBIES (12 + 2) ----------------
add(C("Mortifex the Gravelord", "Zombies", 8, "creature", 7, 7, "S", text="Play: dmg enemy hero per Zombie in grave."))
add(C("Graveseer", "Zombies", 2, "creature", 2, 3, "A", text="Ability(1): search a Zombie."))
add(C("Gravechoir", "Zombies", 4, "creature", 3, 4, "A", text="Stasis: Haunt effects trigger twice."))
add(C("Necrarch the Unending", "Zombies", 6, "creature", 5, 6, "A", text="Stasis: EOT add creature from grave to hand."))
add(C("Gravedigger Pup", "Zombies", 1, "creature", 1, 2, "B", text="Play: mill 2."))
add(C("Rotpup", "Zombies", 1, "creature", 1, 1, "B", keywords=_kw("rush"), text="Rush. Haunt: 2 dmg enemy hero."))
add(C("Tomb Forager", "Zombies", 2, "creature", 1, 3, "B", text="Ability(1): mill a creature from deck, draw."))
add(C("Rotbound Hound", "Zombies", 2, "creature", 2, 2, "B", text="Haunt: draw."))
add(C("Bonewall", "Zombies", 3, "creature", 2, 4, "B", keywords=_kw("taunt"), text="Taunt. Ability(2): destroy a friendly; if Zombie draw."))
add(C("Gravecaller", "Zombies", 3, "creature", 2, 4, "B", text="Ability(2): if no other Zombies, summon Zombie from grave."))
add(C("Hollow Shepherd", "Zombies", 4, "creature", 4, 4, "B", text="Haunt: add creature from grave to hand."))
add(C("Grave Tide", "Zombies", 5, "creature", 3, 4, "B", live=True, text="Ability: pay 2 HP, mill 1. Once/turn."))
add(C("Grave Bargain", "Zombies", 2, "spell", rarity="B", text="Destroy friendly, add two creatures from grave."))
add(C("Call of the Grave", "Zombies", 3, "spell", rarity="B", text="Summon creature cost<=4 from grave."))

# ---------------- NEUTRAL creatures (18) ----------------
add(C("Atlas", "Neutral", 5, "creature", 4, 5, "S", keywords=_kw("taunt"), text="Taunt. Stasis: other Taunts +2 HP."))
add(C("Gary the Ascended", "Neutral", 7, "creature", 6, 6, "S", text="Play: 6 dmg divided among targets."))
add(C("Fenrir, the Worldender", "Neutral", 10, "creature", 10, 10, "S", text="Play: destroy all other creatures, discard hand."))
add(C("Ashpaw", "Neutral", 2, "creature", 2, 1, "A", text="Quick: negate opp search/summon-from-deck-or-grave. Banish."))
add(C("Tithe Collector", "Neutral", 2, "creature", 1, 2, "A", text="Quick: on opp 3rd summon destroy them. Banish."))
add(C("Resonance", "Neutral", 4, "creature", 2, 4, "A", text="Stasis: your other +ATK/+HP auras +1."))
add(C("Twinsoul", "Neutral", 5, "creature", 3, 4, "A", text="Stasis: your Play effects trigger twice."))
add(C("Mathmutt", "Neutral", 2, "creature", 3, 1, "B", text="Haunt: draw."))
add(C("Gary", "Neutral", 2, "creature", 2, 3, "B", text="Play: 1 dmg any target."))
add(C("Hushcaller", "Neutral", 2, "creature", 1, 4, "B", text="Ability(pay 3 HP): draw."))
add(C("Mary", "Neutral", 2, "creature", 2, 2, "B", text="Play: heal 4."))
add(C("Doomsayer", "Neutral", 2, "creature", 0, 5, "B", text="Start of turn: destroy all creatures."))
add(C("Hushwarden", "Neutral", 2, "creature", 2, 1, "B", text="Quick: on opp Spell negate it. Banish."))
add(C("Venom Cur", "Neutral", 3, "creature", 1, 1, "B", keywords=_kw("poisonous"), text="Poisonous."))
add(C("Plague Doctor", "Neutral", 3, "creature", 2, 4, "B", text="Stasis: enemy hero cannot be healed."))
add(C("Wardbreaker", "Neutral", 3, "creature", 3, 1, "B", text="Play: destroy a Spell or Trap."))
add(C("Silence Cur", "Neutral", 3, "creature", 2, 4, "B", text="Stasis: creatures' Abilities cannot be activated."))
add(C("Vaultwarden", "Neutral", 3, "creature", 3, 3, "B", text="Stasis: no summon from grave/deck."))

# ---------------- NEUTRAL spells (17) ----------------
add(C("Cut Down", "Neutral", 4, "spell", rarity="A", text="Destroy creature with ATK>=4."))
add(C("Scout Ahead", "Neutral", 1, "spell", rarity="B", text="Look top 3, add 1, bottom rest."))
add(C("Max Engage", "Neutral", 1, "spell", rarity="B", text="Target +2/+2 this turn. (Quick)"))
add(C("Grave Tax", "Neutral", 1, "spell", rarity="B", text="Banish up to 2 from a graveyard."))
add(C("Unmarked Grave", "Neutral", 1, "spell", rarity="B", text="Mill a creature from your deck (choose)."))
add(C("Quickdraw", "Neutral", 1, "spell", rarity="B", text="Draw."))
add(C("Frostbolt", "Neutral", 2, "spell", rarity="B", text="3 dmg any target."))
add(C("Cull", "Neutral", 2, "spell", rarity="B", text="Destroy creature with ATK<=3."))
add(C("Unspell", "Neutral", 2, "spell", rarity="B", text="Destroy enemy spell/trap. (Quick)"))
add(C("Rugpull", "Neutral", 2, "spell", rarity="B", text="Return a creature to hand. (Quick)"))
add(C("Loose the Hounds", "Neutral", 2, "spell", rarity="B", text="Your creatures Rush EOT. (Quick)"))
add(C("Trench Warfare", "Neutral", 3, "spell", rarity="B", text="2 dmg all enemy creatures."))
add(C("Airdrop", "Neutral", 3, "spell", rarity="B", text="Draw 2."))
add(C("Fireball", "Neutral", 4, "spell", rarity="B", text="6 dmg any target."))
add(C("Pestilence", "Neutral", 6, "spell", rarity="B", text="4 dmg all enemy creatures."))
add(C("Precipice", "Neutral", 8, "spell", rarity="B", text="Destroy all creatures."))
add(C("Pyroblast", "Neutral", 10, "spell", rarity="B", text="10 dmg any target."))

# ---------------- NEUTRAL traps (6) ----------------
add(C("Nullbark", "Neutral", 2, "trap", rarity="A", text="When opp plays Spell: negate."))
add(C("Vanish", "Neutral", 2, "trap", rarity="A", text="When enemy attacks: negate + bounce."))
add(C("Pitfall", "Neutral", 2, "trap", rarity="B", text="When opp summons ATK>=4: destroy."))
add(C("Torrential Tribute", "Neutral", 2, "trap", rarity="B", text="When opp summons: destroy all creatures."))
add(C("Last Stand", "Neutral", 2, "trap", rarity="B", text="When hero would take lethal: negate + immune."))
add(C("Pack Ambush", "Neutral", 2, "trap", rarity="B", text="When enemy attacks: negate + destroy."))


# ============================================================================
# BEHAVIOUR REGISTRIES
# ============================================================================
def _other_class(g, owner, cls, exclude=None):
    return sum(1 for c in owner.board if not c.dead and c is not exclude and c.card.cls == cls)

def register(game: Game):
    g = game

    # ---- AURA TABLE: name -> list of (kind, amount, predicate(game, src, target)) ----
    def others_same_cls(cls):
        return lambda gg, src, tgt: (tgt.owner is src.owner and tgt is not src
                                     and not tgt.dead and tgt.card.cls == cls)
    def other_taunts():
        return lambda gg, src, tgt: (tgt.owner is src.owner and tgt is not src
                                     and "taunt" in tgt.kw())
    def alone_self():
        return lambda gg, src, tgt: (tgt is src and
                                     sum(1 for c in src.owner.board if not c.dead) == 1)
    def adjacent_pirates():
        def pred(gg, src, tgt):
            if tgt.owner is not src.owner or tgt.card.cls != "Pirates" or tgt is src:
                return False
            b = [c for c in src.owner.board if not c.dead]
            if src not in b:
                return False
            i = b.index(src)
            return tgt in (b[i-1] if i > 0 else None, b[i+1] if i+1 < len(b) else None)
        return pred

    g.aura_table = {
        "Quivermaiden": [("atk", 1, others_same_cls("Bows"))],
        "Bannerbow": [("atk", 1, others_same_cls("Bows"))],
        "Bastion Hound": [("hp", 2, others_same_cls("Crowns"))],
        "Atlas": [("hp", 2, other_taunts())],
        "Broadside Gunner": [("atk", 2, adjacent_pirates())],
        "Skyfall Archer": [("atk", 3, alone_self())],
    }

    # ---- HAUNT TABLE: name -> fn(game, creature) ----
    def h_heal(n):
        return lambda gg, c: gg.heal_hero(c.owner, n, f"Haunt {c.card.name}")
    def h_dmg_hero(n):
        return lambda gg, c: gg.deal_damage_hero(c.owner.opponent, n, f"Haunt {c.card.name}")
    def h_draw(n):
        return lambda gg, c: gg.draw(c.owner, n)
    def h_add_from_grave(exclude_self=True):
        def fn(gg, c):
            cands = [x for x in c.owner.grave if x.ctype == "creature"
                     and (not exclude_self or x.name != c.card.name)]
            if cands:
                pick = cands[-1]
                c.owner.grave.remove(pick)
                c.owner.hand.append(pick)
        return fn

    g.haunt_table = {
        "Stonecur": h_heal(3),
        "Cathedral Guardian": h_heal(5),
        "Powder Pup": h_dmg_hero(2),
        "Rotpup": h_dmg_hero(2),
        "Rotbound Hound": h_draw(1),
        "Mathmutt": h_draw(1),
        "Sparkpup": h_draw(1),
        "Hollow Shepherd": h_add_from_grave(),
    }

    # ---- PLAY TABLE: name -> fn(game, creature) (Twinsoul doubles these) ----
    def search(cls=None, ctype="creature", maxcost=None, exclude=None):
        def fn(gg, c):
            owner = c.owner
            cands = [x for x in owner.deck
                     if (cls is None or x.cls == cls)
                     and x.ctype == ctype
                     and (maxcost is None or x.cost <= maxcost)
                     and (exclude is None or x.name != exclude)]
            if cands and len(owner.hand) < 10:
                pick = cands[0]
                owner.deck.remove(pick)
                owner.hand.append(pick)
                gg.log(f"    {owner.name} searches {pick.name}")
        return fn

    def play_draw_per(cls):
        def fn(gg, c):
            n = _other_class(gg, c.owner, cls, exclude=c)
            gg.draw(c.owner, n)
        return fn

    def mortifex_play(gg, c):
        n = sum(1 for x in c.owner.grave if x.ctype == "creature" and x.cls == "Zombies")
        gg.deal_damage_hero(c.owner.opponent, n, "Mortifex")

    def fenrir_play(gg, c):
        for p in gg.players:
            for cc in list(p.board):
                if cc is not c and not cc.dead:
                    gg.destroy(cc, "Fenrir")
        c.owner.hand.clear()

    def gary_asc_play(gg, c):
        # 6 dmg divided -- pilot-agnostic default: dump on enemy hero
        gg.deal_damage_hero(c.owner.opponent, 6, "Gary the Ascended")

    def press_gang(gg, c):
        cands = [x for x in c.owner.deck if x.cls == "Pirates" and x.ctype == "creature"
                 and x.cost <= 3 and x.name != "Press-Gang"]
        if cands:
            pick = cands[0]
            c.owner.deck.remove(pick)
            gg.summon(c.owner, pick, from_zone="deck")

    g.play_table = {
        "Bow Matron": play_draw_per("Bows"),
        "Satin Runner": play_draw_per("Bows"),
        "Bow Keeper": search("Bows", maxcost=3, exclude="Bow Keeper"),
        "Reliquary Hound": search("Crowns", maxcost=4, exclude="Reliquary Hound"),
        "Charthound": search("Pirates", maxcost=3),
        "Scrollhound": search(None, ctype="spell", maxcost=3),
        "Graveseer_play": None,
        "Runewing": h_draw(1),
        "Gary": lambda gg, c: gg.deal_damage_hero(c.owner.opponent, 1, "Gary"),
        "Mary": lambda gg, c: gg.heal_hero(c.owner, 4, "Mary"),
        "Mortifex the Gravelord": mortifex_play,
        "Fenrir, the Worldender": fenrir_play,
        "Gary the Ascended": gary_asc_play,
        "Press-Gang": press_gang,
        "Gravedigger Pup": lambda gg, c: gg.mill(c.owner, 2),
        "Tomekeeper": lambda gg, c: gg.mill(c.owner, 3),
        "Cathedral Healer": lambda gg, c: gg.heal_hero(c.owner, 4, "Cathedral Healer"),
        "Wardbreaker": lambda gg, c: None,  # destroy spell/trap: needs target, pilot-driven
        "Ribbon Pup": lambda gg, c: c.temp_keywords.add("charge") if _other_class(gg, c.owner, "Bows", c) else None,
    }

    g.start_turn_table = {
        "The Sun King": lambda gg, c: gg.heal_hero(c.owner, sum(1 for x in c.owner.board if not x.dead), "Sun King"),
        "Doomsayer": lambda gg, c: [gg.destroy(cc, "Doomsayer") for p in gg.players for cc in list(p.board)],
    }
    g.end_turn_table = {
        "Stormfletch Aria": lambda gg, c: gg.deal_damage_hero(c.owner.opponent, _other_class(gg, c.owner, "Bows", c), "Stormfletch"),
        "Necrarch the Unending": lambda gg, c: _necrarch(gg, c),
    }

    def _necrarch(gg, c):
        cands = [x for x in c.owner.grave if x.ctype == "creature" and x.name != "Necrarch the Unending"]
        if cands and len(c.owner.hand) < 10:
            pick = cands[-1]
            c.owner.grave.remove(pick)
            c.owner.hand.append(pick)

    # ---- SPELL TABLE: name -> fn(game, caster, target) ----
    def sd(gg, caster):
        return caster.spell_damage(gg)

    def spell_dmg_target(base):
        def fn(gg, caster, target):
            amt = base + sd(gg, caster)
            if isinstance(target, Player):
                gg.deal_damage_hero(target, amt, "spell")
            elif target is not None:
                gg.deal_damage_creature(target, amt, "spell")
        return fn

    def arrow_storm(gg, caster, target):
        n = sum(1 for c in caster.board if not c.dead and c.card.cls == "Bows")
        if target is not None and not isinstance(target, Player):
            gg.deal_damage_creature(target, 2 * n + sd(gg, caster), "Arrow Storm")

    g.spell_table = {
        "Frostbolt": spell_dmg_target(3),
        "Fireball": spell_dmg_target(6),
        "Pyroblast": spell_dmg_target(10),
        "Arrow Storm": arrow_storm,
        "Crown Judgment": lambda gg, caster, target: gg.deal_damage_creature(
            target, (6 if any(c.card.cls == "Crowns" and not c.dead for c in caster.board) else 3) + sd(gg, caster), "Crown Judgment") if target else None,
        "Sanctuary": lambda gg, caster, target: gg.heal_hero(caster, 8, "Sanctuary"),
        "Quickdraw": lambda gg, caster, target: gg.draw(caster, 1),
        "Airdrop": lambda gg, caster, target: gg.draw(caster, 2),
        "Trench Warfare": lambda gg, caster, target: [gg.deal_damage_creature(c, 2 + sd(gg, caster), "Trench") for c in list(caster.opponent.board)],
        "Pestilence": lambda gg, caster, target: [gg.deal_damage_creature(c, 4 + sd(gg, caster), "Pestilence") for c in list(caster.opponent.board)],
        "Precipice": lambda gg, caster, target: [gg.destroy(c, "Precipice") for p in gg.players for c in list(p.board)],
        "Cut Down": lambda gg, caster, target: gg.destroy(target, "Cut Down") if target and target.eff_atk(gg) >= 4 else None,
        "Cull": lambda gg, caster, target: gg.destroy(target, "Cull") if target and target.eff_atk(gg) <= 3 else None,
        "Full Bloom": lambda gg, caster, target: [setattr(c, "temp_atk", c.temp_atk + 2) for c in caster.board if c.card.cls == "Bows" and not c.dead],
        "Max Engage": lambda gg, caster, target: (setattr(target, "temp_atk", target.temp_atk + 2), setattr(target, "plus_hp", target.plus_hp + 2)) if target else None,
        "Sanctuary_": None,
        "Call of the Grave": lambda gg, caster, target: _call_grave(gg, caster),
        "Grave Bargain": lambda gg, caster, target: _grave_bargain(gg, caster, target),
        "Frost Lock": lambda gg, caster, target: setattr(target, "cannot_attack_until", 10**9) if target else None,
        "Deep Freeze": lambda gg, caster, target: [setattr(c, "cannot_attack_until", gg.turn + 2) for c in caster.opponent.board],
        "Rugpull": lambda gg, caster, target: _rugpull(gg, target),
        "Loose the Hounds": lambda gg, caster, target: [c.temp_keywords.add("rush") for c in caster.board],
        "Scout Ahead": lambda gg, caster, target: gg.draw(caster, 1),
        "Unmarked Grave": lambda gg, caster, target: gg.mill(caster, 1),
        "Grave Tax": lambda gg, caster, target: None,
        "Chum the Water": lambda gg, caster, target: gg.draw(caster, 2),
    }

    def _call_grave(gg, caster):
        cands = [x for x in caster.grave if x.ctype == "creature" and x.cost <= 4]
        if cands:
            pick = cands[-1]
            caster.grave.remove(pick)
            gg.summon(caster, pick, from_zone="grave")

    def _grave_bargain(gg, caster, target):
        if target and not target.dead:
            gg.destroy(target, "Grave Bargain")
        cands = [x for x in caster.grave if x.ctype == "creature"][-2:]
        for pick in cands:
            if len(caster.hand) < 10:
                caster.grave.remove(pick)
                caster.hand.append(pick)

    def _rugpull(gg, target):
        if target and not target.dead:
            target.dead = True
            if target in target.owner.board:
                target.owner.board.remove(target)
            target.owner.hand.append(target.card)

    # ---- ABILITY TABLE: name -> (cost_mana, cost_hp, fn, once_per_turn) ----
    def heartpiercer(gg, c, target):
        n = _other_class(gg, c.owner, "Bows", c)
        if target is not None:
            if isinstance(target, Player):
                gg.deal_damage_hero(target, n, "Heartpiercer")
            else:
                gg.deal_damage_creature(target, n, "Heartpiercer")

    def wizard_ping(gg, c, target):
        amt = 1 + c.owner.spell_damage(gg)
        if isinstance(target, Player):
            gg.deal_damage_hero(target, amt, c.card.name)
        elif target is not None:
            gg.deal_damage_creature(target, amt, c.card.name)

    g.ability_table = {
        "Heartpiercer": (2, 0, heartpiercer, False),
        "Chapel Keeper": (2, 0, lambda gg, c, t: gg.heal_hero(c.owner, 3, "Chapel Keeper"), False),
        "Glyphmaster": (2, 0, wizard_ping, False),
        "Hexcaster": (2, 0, wizard_ping, False),
        "Graveseer": (1, 0, lambda gg, c, t: search("Zombies", exclude="Graveseer")(gg, c), False),
        "Tomb Forager": (1, 0, lambda gg, c, t: _forager(gg, c), False),
        "Tide Caller": (2, 0, lambda gg, c, t: _tidecaller(gg, c), False),
        "Bonewall": (2, 0, lambda gg, c, t: _bonewall(gg, c, t), False),
        "Gravecaller": (2, 0, lambda gg, c, t: _gravecaller(gg, c), False),
        "Hushcaller": (0, 3, lambda gg, c, t: gg.draw(c.owner, 1), False),
        "Mirrorward": (3, 0, lambda gg, c, t: setattr(t, "cannot_attack_until", gg.turn + 2) if t else None, False),
        "Grave Tide": (0, 2, lambda gg, c, t: gg.mill(c.owner, 1), True),   # LIVE
    }

    def _forager(gg, c):
        cands = [x for x in c.owner.deck if x.ctype == "creature"]
        if cands:
            pick = cands[0]
            c.owner.deck.remove(pick)
            c.owner.grave.append(pick)
        gg.draw(c.owner, 1)

    def _tidecaller(gg, c):
        cands = [x for x in c.owner.grave if x.cls == "Pirates"]
        if cands:
            pick = cands[-1]
            c.owner.grave.remove(pick)
            c.owner.deck.append(pick)
            gg.rng.shuffle(c.owner.deck)
        gg.draw(c.owner, 1)

    def _bonewall(gg, c, t):
        if t and not t.dead and t.owner is c.owner:
            was_zombie = t.card.cls == "Zombies"
            gg.destroy(t, "Bonewall")
            if was_zombie:
                gg.draw(c.owner, 1)

    def _gravecaller(gg, c):
        others = [x for x in c.owner.board if not x.dead and x.card.cls == "Zombies" and x is not c]
        if others:
            return
        cands = [x for x in c.owner.grave if x.ctype == "creature" and x.cls == "Zombies"
                 and x.name != "Gravecaller"]
        if cands:
            pick = cands[-1]
            c.owner.grave.remove(pick)
            gg.summon(c.owner, pick, from_zone="grave")

    # ---- COMBO/QUICK creature triggers handled in flow ----
    g.combo_table = {
        "Sly Stowaway": lambda gg, c: gg.draw(c.owner, 1),
        "Bilge Rat": lambda gg, c: gg.draw(c.owner, 1),
        "Quartermaster": lambda gg, c, t=None: gg.deal_damage_hero(c.owner.opponent, 2, "Quartermaster"),
    }
