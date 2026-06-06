"""
Keyword x keyword interaction matrix + the FLAG LIST of under-specified interactions.

For each ordered pair of keywords we record whether the engine has a single, deterministic
defined behaviour. Cells that the card text leaves genuinely ambiguous are flagged with a
minimal text fix. A clean set => empty/tiny flag list.
"""
KEYWORDS = ["Rush", "Charge", "Taunt", "Stasis", "Haunt", "Combo", "Vamp", "Poisonous",
            "Stealth", "Warded", "Wildfury", "SpellDamage", "Ability(N)", "Quick",
            "HandTrap", "Frozen"]

# Interactions the engine defines explicitly (anything not listed is "independent / no
# interaction", which is itself a defined outcome -- they simply do not affect each other).
DEFINED = {
    ("Rush", "Taunt"): "Rush must hit a Taunt creature if present; still cannot hit hero.",
    ("Charge", "Taunt"): "Charge must hit a Taunt if present, else may hit hero.",
    ("Vamp", "Warded"): "Vamp heal only occurs if damage was dealt; Warded prevents the hit so no vamp.",
    ("Vamp", "Stasis"): "Vamp routes through heal path; Helios(Stasis) redirects it to enemy face (ruling 7).",
    ("Poisonous", "Warded"): "Warded prevents the first instance incl. poison; 2nd poison kills (ruling 8).",
    ("Poisonous", "Taunt"): "Poisonous trades up into a Taunt; Taunt still forces the attack.",
    ("Haunt", "Stasis"): "Gravechoir(Stasis) doubles Haunt linearly; negate suppresses Haunt (rulings 11,12,OQ4).",
    ("Haunt", "Quick"): "A Quick negate of the destroyer stops Haunt (negate != destruction, ruling 12).",
    ("Warded", "Stasis"): "Resonance does not grant Warded; Warded is a one-shot prevention replacement.",
    ("Frozen", "Rush"): "Frozen overrides Rush/Charge: a frozen creature cannot attack at all (ruling 16).",
    ("Frozen", "Charge"): "Same: Frozen blocks the attack regardless of Charge.",
    ("SpellDamage", "Ability(N)"): "Only abilities tagged 'affected by Spell Damage' (Glyphmaster/Hexcaster) scale.",
    ("Combo", "Quick"): "Combo checks whether a card was played earlier this turn; Quick plays count.",
    ("Wildfury", "Frozen"): "Wildfury grants haste but Frozen still prevents attacking.",
    ("HandTrap", "Stasis"): "Ashpaw negates summon-from-deck/grave & searches; Vaultwarden(Stasis) is a separate lock.",
    ("Quick", "HandTrap"): "Both resolve through the priority window onto the LIFO chain (OQ1/OQ2).",
    ("Taunt", "Stasis"): "Atlas(Stasis) buffs other Taunts +2 HP additively (OQ6).",
    ("Charge", "Rush"): "Charge is a strict superset of Rush targeting (can hit hero, ruling 17).",
}

# Genuinely under-specified cells (the answer to 'is it YGO-clean'): minimal text fixes.
FLAGS = [
    ("Stasis x Stasis (Helios + Mama Bark on the same heal event)",
     "Two replacement effects on one heal: Helios redirects the restore to damage; Mama Bark "
     "adds '+2 restore'. Card text does not state ordering or whether Mama Bark's +2 is itself "
     "redirected. ENGINE CHOICE: Helios fully consumes the restore, Mama Bark's +2 does NOT apply "
     "(no restore occurs). FIX: add to Helios 'Replacement effects that increase the restore are "
     "applied first, then the total is redirected.' OR explicitly 'instead deal that much, and "
     "additional-restore effects do not apply.'"),
    ("Stasis x Stasis (Helios + Dawn Acolyte on the same heal event)",
     "Dawn Acolyte triggers 'whenever you restore HP'. With Helios active the restore is replaced "
     "by damage, so no restore occurs and Dawn Acolyte does NOT trigger. This is the rules-correct "
     "reading (replacement happens before the trigger condition is checked) but is non-obvious. "
     "FIX (optional clarity): Dawn Acolyte 'whenever you restore HP, or would but for a replacement'."),
    ("Stasis x Stasis (Helios + Plague Doctor, your Helios vs their Plague Doctor)",
     "Plague Doctor says enemy hero 'cannot be healed'. Helios converts your heal to damage. "
     "ENGINE CHOICE: Helios redirect still fires (no heal ever happens, so the prevention is moot). "
     "FIX: confirm in rules that 'cannot be healed' does not pre-empt a heal-replacement effect."),
]


def print_matrix():
    print("KEYWORD x KEYWORD INTERACTION MATRIX")
    print("Legend: D=defined-interaction  .=independent (defined: no effect)\n")
    header = "             " + " ".join(f"{k[:4]:>4}" for k in KEYWORDS)
    print(header)
    undefined = []
    for a in KEYWORDS:
        row = f"{a:>12} "
        for b in KEYWORDS:
            if a == b:
                cell = "  - "
            elif (a, b) in DEFINED or (b, a) in DEFINED:
                cell = "   D"
            else:
                cell = "   ."
            row += cell + " "
        print(row)
    print("\nExplicitly defined interaction cells:")
    for (a, b), desc in DEFINED.items():
        print(f"  {a} x {b}: {desc}")
    print(f"\nUNDEFINED / FLAGGED interactions: {len(FLAGS)}")
    for name, fix in FLAGS:
        print(f"  [FLAG] {name}\n         {fix}")
    return undefined


if __name__ == "__main__":
    print_matrix()
