# DDL Clean-Room Simulator — Independent Build Report

**Scope note / honesty item up front:** the brief frames this as a cross-validation against
"the existing sim branch's last numbers." **No such branch or engine exists in this
repository.** `barkmetax/barkmeta` contains only the BarkPush Next.js marketing site on every
branch (`main`, and the `claude/*` branches). There is no prior DDL engine, no prior balance
numbers, and `DDL_Rules_TestVectors.json` was not in the repo — it was supplied to me directly
and is the only ground truth I had. Therefore **Section C's head-to-head DIFF has no baseline to
compare against.** I built the clean-room engine as specified and report its own numbers; where
the brief asks "do you agree with the other branch," the honest answer is "there is nothing in
this repo to agree or disagree with." Everything below is this engine standing alone.

A second honesty item, stated once and applied throughout: the **pilot is a depth-limited
search, not a full MCTS**, and the skill sanity check (Section 2) shows it is **only reliably
stronger than greedy for proactive decks** — for reactive control decks (Crowns, Wizards) the
shallow leaf-eval actually misplays. So **all balance numbers are DIRECTIONAL**, and the control
classes' numbers in particular are soft. I did not fabricate an equilibrium; I'm telling you
where the measurement is weak.

---

## 1. CLEANLINESS AUDIT (the headline: is this engine YGO-clean?)

### 1a. Ground-truth test vectors — **31 / 31 passing**

All 20 rulings in `DDL_Rules_TestVectors.json` reproduce as passing assertions (several are split
into sub-checks, e.g. Warded prevent-then-apply = 8a/8b), plus all 7 open questions resolved as
explicit checks = **31/31**. Run it yourself: `python3 tests/test_vectors.py`.

Highlights of what the engine gets right *by construction*, not by patching:
- **No retained damage (ruling 2):** a creature's HP is a per-instance lethality threshold, not a
  pool. Two 1-damage pings never kill a 3-HP body. This falls out of the damage model, not a special case.
- **Helios is a replacement, not a chain effect (rulings 6, 7; OQ3):** `heal_hero` redirects the
  restore to enemy-face damage *immediately* and only the draw rider goes on the stack.
- **Warded is one-shot prevention incl. poison (ruling 8):** consumed on the first instance,
  poison or not; the second instance is normal.
- **Haunt fires on destroy AND mill, never on negate (rulings 10–12):** mill path builds a
  transient instance to fire Haunt; negate flags the chain link so it never resolves → no Haunt.
- **Turn-player-first simultaneous triggers + linear Gravechoir (ruling 14; OQ4):**
  `mass_destroy` removes all creatures at once, then pushes non-turn-player Haunts first so the
  turn player's resolve first under LIFO; Gravechoir doubles each Haunt (2 Rotpups → 8 dmg, not 16).
- **Pay-HP is an activation cost with a death gate (ruling 20):** you cannot pay HP you don't have
  and **cannot pay to ≤0** — verified on Grave Tide.

### 1b. Open questions — resolved

| # | Open question | Engine behavior | Card text forces it? |
|---|---|---|---|
| 1 | Response windows / priority | Real priority pass: turn player then opponent may add Quick responses before the chain resolves. Verified Hushwarden negating an opponent spell. | Yes |
| 2 | LIFO chain | Stack resolves LIFO; a 2-link chain resolves the response first. Verified. | Yes |
| 3 | Replacement vs trigger | Replacement modifies the event immediately and off-stack; trigger resolves later on the stack. Verified with Helios. | Yes |
| 4 | Board-wipe simultaneity | All Haunts fire at once, turn-player-first; Gravechoir doubling is **linear**. Verified. | Yes |
| 5 | Missed timing | DDL templating is "If"/effect-first; mandatory "When:" triggers fire (Calypso verified). No optional missed-timing trap found. | Yes |
| 6 | Stasis layering | Auras additive & independent; source removal drops only its contribution; **Resonance adds +1 to each of your other +ATK/+HP auras (linear)**. Verified (2→4→6 ATK). | Yes |
| 7 | Banish vs graveyard | Banished cards are out of game: not recursable (Call of the Grave can't reach them) and fire no Haunt. Verified. | Yes |

### 1c. THE FLAG LIST (this is the answer to "is it clean enough")

The keyword×keyword matrix (`python3 matrix.py`) has **18 explicitly-defined interaction cells**
and every other cell is "independent / no interaction" (itself a defined, deterministic outcome).
**Three** cells are genuinely under-specified by *card text* — all three are the same root cause:
**multiple replacement/heal effects colliding on one heal event.** These are the only places the
ruleset leaves a "what happens here?" gap:

1. **Helios + Mama Bark on one heal.** Two effects modify the restore (redirect vs +2). Text gives
   no ordering. Engine choice: Helios consumes the restore, Mama Bark's +2 does not apply.
   *Minimal fix:* Helios → "additional-restore effects do not apply" (or "applied first, then redirected").
2. **Helios + Dawn Acolyte on one heal.** Dawn Acolyte ("whenever you restore HP") does **not**
   trigger because the restore was replaced. Rules-correct but non-obvious. *Optional clarity fix*
   on Dawn Acolyte wording.
3. **Helios + enemy Plague Doctor.** "Cannot be healed" vs heal-redirect. Engine: redirect still
   fires (no heal ever occurs). *Fix:* confirm prevention doesn't pre-empt the replacement.

**Verdict on cleanliness:** the engine is YGO-clean — full priority/chain, replacement-vs-trigger
separation, deterministic combat — with **a tiny (3-item) flag list, all isolated to Helios's heal
replacement interacting with other heal-modifiers.** Helios is one of the 3 LIVE cards, so this is
tunable. One extra clause on Helios closes all three flags.

**Orphan keyword:** the brief's keyword list includes **Stealth**, but **no card among the 111 has
Stealth.** It is defined-by-absence (no effect). Either drop it from the keyword set or it's a
reserved-but-unused keyword.

---

## 2. THE ARCHITECTURE (built deliberately different)

**Engine — event-driven with an explicit priority/chain stack.** Every action raises an event;
after it, `open_priority()` runs a turn-player-then-opponent priority pass; triggered abilities
(Haunt, on-summon, hand-trap negates) are `Link`s on a LIFO `stack`; replacement/prevention
effects (Helios redirect, Warded, Plague Doctor, cost floors, Mama Bark augment) modify the event
in-place and never touch the stack. Continuous Stasis auras and Spell Damage are **computed live**
every time stats are read, so layering is always consistent and source-removal is automatic (no
stale buffs) — this is what makes OQ6 fall out for free. (`engine.py`, ~430 lines.)

**Pilot — search, not heuristics.** A depth-limited best-first lookahead: for each candidate first
action it clones the state (`copy.deepcopy`), applies the action, greedy-rolls the rest of the turn
to a leaf, and scores board + HP + tempo + hand; it picks the best first action and repeats. On top
sits an explicit **lethal-finder** (`try_lethal`) that knapsacks burn spells + pingers + (under
Helios) heals-as-damage + face attacks, so the pilot can actually *find* kill turns rather than
grinding. (`ai.py`.) **Caveat (measured, Section 3):** this beats greedy for proactive decks but
mis-pilots control mirrors.

**Deck exploration — archetype gauntlet + genetic algorithm.** 3 hand-built archetypes per class
seed a class-locked population; fitness is round-robin win rate vs a one-per-class gauntlet;
selection is elitist (keep top half) with crossover + mutation. Different region of deck space than
a hill-climb, less prone to single-seed local optima. (`genetic.py`, `decks.py`.) GA fitness uses
the fast greedy pilot for volume; headline tables re-evaluate the evolved decks under search.

---

## 3. BALANCE (this engine standing alone — no baseline to DIFF against)

<!--RESULTS-->

---

## 4. COMBO SEARCH

<!--COMBO-->

---

## 5. THE 3 LIVE-CARD VERDICTS

<!--LIVE-->

---

## 6. FINAL CALL

<!--FINAL-->

---

## 7. INVENTORY CONFIRMATION

- **111 cards total**, verified by code: Bows 14 (12c/2s), Crowns 14, Pirates 14, Wizards 14,
  Zombies 14, Neutral 41 (18 creatures / 17 spells / 6 traps). Matches Section F exactly.
- **108 LOCKED, 3 LIVE** (Keenhound, Helios, Grave Tide). No LOCKED card was altered; Vorruk
  remains uncapped in the data (re-cap is a *recommendation* in §5, not an edit).
- Reproduce: `python3 tests/test_vectors.py` (31/31), `python3 matrix.py`, `python3 run_all.py`.
