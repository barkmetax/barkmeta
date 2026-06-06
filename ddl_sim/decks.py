"""
Hand-built archetype seed decks (3 per class) for the genetic gauntlet to evolve from.
30 cards each, max 2 copies of a card. Classes draw on their own 14 cards + Neutrals.
"""
from carddata import CARDS

DECK_SIZE = 30
MAX_COPIES = 2

def build(pairs):
    deck = []
    for name, n in pairs:
        assert name in CARDS, f"unknown card {name}"
        deck += [CARDS[name]] * n
    return deck

def validate(deck):
    from collections import Counter
    assert len(deck) == DECK_SIZE, f"deck size {len(deck)} != 30"
    for name, n in Counter(c.name for c in deck).items():
        assert n <= MAX_COPIES, f"{name} x{n} > 2"
    return True


SEEDS = {}

# -------- BOWS --------
SEEDS["Bows-Aggro"] = build([
    ("Ribbon Pup", 2), ("Dartbow", 2), ("Ribbonhound", 2), ("Bow Keeper", 2),
    ("Bannerbow", 2), ("Keenhound", 2), ("Skyfall Archer", 2), ("Heartpiercer", 2),
    ("Satin Runner", 2), ("Full Bloom", 2), ("Arrow Storm", 2), ("Quivermaiden", 1),
    ("Bow Matron", 1), ("Frostbolt", 2), ("Quickdraw", 2),
])
SEEDS["Bows-Midrange"] = build([
    ("Bow Keeper", 2), ("Ribbonhound", 2), ("Bannerbow", 2), ("Keenhound", 2),
    ("Satin Runner", 2), ("Heartpiercer", 2), ("Quivermaiden", 2), ("Bow Matron", 2),
    ("Stormfletch Aria", 2), ("Skyfall Archer", 1), ("Arrow Storm", 2), ("Full Bloom", 1),
    ("Frostbolt", 2), ("Airdrop", 2), ("Cut Down", 2),
])
SEEDS["Bows-Tempo"] = build([
    ("Ribbon Pup", 2), ("Dartbow", 2), ("Ribbonhound", 2), ("Bow Keeper", 2),
    ("Keenhound", 2), ("Bannerbow", 2), ("Skyfall Archer", 2), ("Satin Runner", 2),
    ("Heartpiercer", 2), ("Quivermaiden", 1), ("Full Bloom", 2), ("Arrow Storm", 2),
    ("Frostbolt", 2), ("Max Engage", 2), ("Quickdraw", 1),
])

# -------- CROWNS --------
SEEDS["Crowns-Control"] = build([
    ("Royal Page", 2), ("Stonecur", 2), ("Reliquary Hound", 2), ("Bastion Hound", 2),
    ("Chapel Keeper", 2), ("Cathedral Healer", 2), ("Mama Bark", 2), ("Cathedral Guardian", 2),
    ("The Sun King", 1), ("Helios", 2), ("Dawn Acolyte", 2), ("Sanctuary", 2),
    ("Crown Judgment", 2), ("Frostbolt", 2), ("Cut Down", 1),
])
SEEDS["Crowns-Helios"] = build([
    ("Dawn Acolyte", 2), ("Cathedral Healer", 2), ("Helios", 2), ("Chapel Keeper", 2),
    ("Mama Bark", 2), ("Stonecur", 2), ("Bastion Hound", 2), ("Cathedral Guardian", 2),
    ("Sanctuary", 2), ("Reliquary Hound", 2), ("Mary", 2), ("Crown Judgment", 2),
    ("Frostbolt", 2), ("Airdrop", 2), ("The Sun King", 0), ("Royal Page", 2),
])
SEEDS["Crowns-Midrange"] = build([
    ("Royal Page", 2), ("Stonecur", 2), ("Reliquary Hound", 2), ("Bloodchapel Cur", 2),
    ("Bastion Hound", 2), ("Cathedral Healer", 2), ("Mama Bark", 2), ("Helios", 2),
    ("Cathedral Guardian", 1), ("Dawn Acolyte", 2), ("Crown Judgment", 2), ("Sanctuary", 1),
    ("Frostbolt", 2), ("Fireball", 2), ("Cut Down", 2),
])

# -------- PIRATES --------
SEEDS["Pirates-Tempo"] = build([
    ("Sly Stowaway", 2), ("Bilge Rat", 2), ("Charthound", 2), ("Quartermaster", 2),
    ("Bombardier", 2), ("Powder Pup", 2), ("Broadside Gunner", 2), ("Cap'n Brindle", 2),
    ("Press-Gang", 2), ("Calypso the Gunner Queen", 2), ("Dread Captain Saoirse", 2),
    ("Coat the Blades", 2), ("Chum the Water", 2), ("Frostbolt", 2),
])
SEEDS["Pirates-Aggro"] = build([
    ("Sly Stowaway", 2), ("Bilge Rat", 2), ("Quartermaster", 2), ("Charthound", 2),
    ("Bombardier", 2), ("Powder Pup", 2), ("Broadside Gunner", 2), ("Cap'n Brindle", 2),
    ("Calypso the Gunner Queen", 2), ("Dread Captain Saoirse", 2), ("Coat the Blades", 2),
    ("Quickdraw", 2), ("Frostbolt", 2), ("Max Engage", 2),
])
SEEDS["Pirates-Midrange"] = build([
    ("Charthound", 2), ("Quartermaster", 2), ("Bombardier", 2), ("Broadside Gunner", 2),
    ("Cap'n Brindle", 2), ("Press-Gang", 2), ("Calypso the Gunner Queen", 2),
    ("Dread Captain Saoirse", 2), ("Tide Caller", 2), ("Powder Pup", 2),
    ("Chum the Water", 2), ("Coat the Blades", 2), ("Frostbolt", 2), ("Fireball", 2),
])

# -------- WIZARDS --------
SEEDS["Wizards-Spell"] = build([
    ("Sparkpup", 2), ("Wyrmling", 2), ("Scrollhound", 2), ("Embermane", 2),
    ("Glacewisp", 2), ("Emberwisp the Kindler", 2), ("Runewing", 2), ("Glyphmaster", 2),
    ("Vorruk the Emberlord", 2), ("Frostbolt", 2), ("Fireball", 2), ("Airdrop", 2),
    ("Trench Warfare", 2), ("Pyroblast", 1), ("Quickdraw", 1),
])
SEEDS["Wizards-Burn"] = build([
    ("Sparkpup", 2), ("Wyrmling", 2), ("Embermane", 2), ("Glacewisp", 2),
    ("Emberwisp the Kindler", 2), ("Glyphmaster", 2), ("Vorruk the Emberlord", 2),
    ("Scrollhound", 2), ("Frostbolt", 2), ("Fireball", 2), ("Pyroblast", 2),
    ("Airdrop", 2), ("Quickdraw", 2), ("Runewing", 2),
])
SEEDS["Wizards-Control"] = build([
    ("Sparkpup", 2), ("Embermane", 2), ("Glacewisp", 2), ("Mirrorward", 2),
    ("Hexcaster", 2), ("Glyphmaster", 2), ("Runewing", 2), ("Vorruk the Emberlord", 2),
    ("Frostbolt", 2), ("Fireball", 2), ("Trench Warfare", 2), ("Deep Freeze", 2),
    ("Pestilence", 2), ("Airdrop", 2),
])

# -------- ZOMBIES --------
SEEDS["Zombies-Value"] = build([
    ("Gravedigger Pup", 2), ("Rotpup", 2), ("Rotbound Hound", 2), ("Tomb Forager", 2),
    ("Graveseer", 2), ("Gravechoir", 2), ("Hollow Shepherd", 2), ("Necrarch the Unending", 2),
    ("Gravecaller", 2), ("Mortifex the Gravelord", 1), ("Grave Tide", 2), ("Call of the Grave", 2),
    ("Grave Bargain", 2), ("Frostbolt", 2), ("Bonewall", 1),
])
SEEDS["Zombies-Aggro"] = build([
    ("Gravedigger Pup", 2), ("Rotpup", 2), ("Rotbound Hound", 2), ("Tomb Forager", 2),
    ("Graveseer", 2), ("Gravechoir", 2), ("Powder Pup", 0), ("Hollow Shepherd", 2),
    ("Grave Tide", 2), ("Mortifex the Gravelord", 2), ("Call of the Grave", 2),
    ("Frostbolt", 2), ("Fireball", 2), ("Quickdraw", 2), ("Bonewall", 2),
])
SEEDS["Zombies-Control"] = build([
    ("Gravedigger Pup", 2), ("Rotbound Hound", 2), ("Tomb Forager", 2), ("Graveseer", 2),
    ("Gravechoir", 2), ("Bonewall", 2), ("Hollow Shepherd", 2), ("Necrarch the Unending", 2),
    ("Gravecaller", 2), ("Mortifex the Gravelord", 1), ("Grave Tide", 2),
    ("Call of the Grave", 2), ("Grave Bargain", 2), ("Trench Warfare", 2), ("Frostbolt", 1),
])

_FILLER = ["Scout Ahead", "Quickdraw", "Frostbolt", "Airdrop", "Gary", "Mary",
           "Cull", "Frostbolt", "Quickdraw", "Scout Ahead"]

def normalize(deck):
    """Pad/trim to exactly 30 cards, max 2 copies, using neutral filler."""
    from collections import Counter
    deck = list(deck)
    # trim any over-2 copies
    cnt = Counter(); out = []
    for c in deck:
        if cnt[c.name] < MAX_COPIES:
            out.append(c); cnt[c.name] += 1
    deck = out
    # pad up to 30
    fi = 0
    while len(deck) < DECK_SIZE and fi < 10000:
        name = _FILLER[fi % len(_FILLER)]; fi += 1
        if cnt[name] < MAX_COPIES:
            deck.append(CARDS[name]); cnt[name] += 1
    return deck[:DECK_SIZE]

SEEDS = {k: normalize(v) for k, v in SEEDS.items()}

# validate all seeds
for _name, _d in SEEDS.items():
    try:
        validate(_d)
    except AssertionError as e:
        raise AssertionError(f"{_name}: {e}")

CLASS_SEEDS = {
    "Bows": ["Bows-Aggro", "Bows-Midrange", "Bows-Tempo"],
    "Crowns": ["Crowns-Control", "Crowns-Helios", "Crowns-Midrange"],
    "Pirates": ["Pirates-Tempo", "Pirates-Aggro", "Pirates-Midrange"],
    "Wizards": ["Wizards-Spell", "Wizards-Burn", "Wizards-Control"],
    "Zombies": ["Zombies-Value", "Zombies-Aggro", "Zombies-Control"],
}
