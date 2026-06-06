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

Battery actually run: **3 RNG seeds**, **24 games/cell** (alternating first player) for the 5×5
search grid, **40 games/cell × 3 seeds** for the greedy gradient, GA = 4 generations × pop 12,
combo = 40 games × 3 first/second splits. Total wall time 340 s. Numbers are **directional**
(see pilot caveat). Reproduce: `python3 run_all.py`.

### 5×5 class matchup @ top skill (row beats column, %), evolved best deck per class

|         | Bows | Crowns | Pirates | Wizards | Zombies | **AVG** |
|---------|------|--------|---------|---------|---------|---------|
| **Bows**    | 47.2 | 37.5 | 54.2 | 61.1 | 62.5 | **53.8** |
| **Crowns**  | 62.5 | 48.6 | 76.4 | 69.4 | 75.0 | **70.8** |
| **Pirates** | 48.6 | 22.2 | 48.6 | 63.9 | 54.2 | **47.2** |
| **Wizards** | 36.1 | 27.8 | 40.3 | 44.4 | 54.2 | **39.6** |
| **Zombies** | 40.3 | 27.8 | 30.6 | 48.6 | 45.8 | **36.8** |

**Tyrant check — FAILS.** The top class is **Crowns at 70.8% with ZERO losing matchups** (its
worst non-mirror result is 62.5% vs Bows). That is a tyrant by the brief's own definition.

**🔴 LOUD DISAGREEMENT WITH THE BRIEF'S PRIOR.** The brief asks "Is Zombies the top class but
still with at least one losing matchup?" This independent engine says the **opposite**: **Zombies
is the *worst* class (36.8%)** and **Crowns is the top class *and* a tyrant.** Since there is no
existing branch in this repo to diff against, I can't attribute the gap to a specific rules
difference in another engine — but I can say which way *this* engine leans and why:
- Crowns' heal-control package (Mama Bark double-heal, The Sun King, Cathedral Guardian
  warded-taunt, Sanctuary, + the Helios redirect/draw engine) produces inevitability that the
  other classes' clocks don't outrace under this pilot.
- Zombies' graveyard-value engine (recursion, Haunt, Mortifex) is *slow*, and the limited-depth
  pilot does not chain its recursion loops well — so Zombies' measured floor is probably **lower
  than its true ceiling.** I flag this as a likely pilot under-performance, not a settled verdict.

### "No deck above ~58% in the mature pool" — FAILS

Field win rates of the evolved best decks: Crowns **70.8%**, Bows 53.8%, Pirates 47.2%, Wizards
39.6%, Zombies 36.8%. **Pool ceiling = 70.8% > 58%.** The set is **not** within the stated balance
band in this engine.

### Skill gradient — partially reproduces the design hypothesis

| Class | low-skill (greedy) | high-skill (search) | Δ | Brief's hypothesis |
|---|---|---|---|---|
| Bows | 40.0 | 53.8 | **+13.8** | "flat-mid" → instead trends *up* (disagree) |
| Crowns | 77.9 | 70.8 | **−7.1** | "easy, stronger at low skill" → ✓ |
| Pirates | 42.5 | 47.2 | **+4.7** | "hard, stronger at high skill" → ✓ |
| Wizards | 56.0 | 39.6 | **−16.5** | "easy, stronger at low skill" → ✓ |
| Zombies | 37.1 | 36.8 | **−0.3** | "hard, stronger at high skill" → flat & weak (disagree) |

3 of 5 classes (Crowns, Wizards low-skill-favored; Pirates high-skill-favored) reproduce the
intended gradient. Bows and Zombies do not. Given the pilot caveat the gradient is suggestive, not
proof — but the *direction* for the "easy" vs "hard" classes the brief named does show up.

### DIFF vs the existing branch

**No baseline exists in this repository** (see top-of-report note). There is nothing to diff
against. If the other branch reported "Zombies top, ~balanced," then the two engines **disagree
hard**, and the test vectors are the tie-breaker: this engine passes 31/31 of them, so any rules
disagreement should be adjudicated against those vectors. The most likely source of a Zombies gap
between engines is **graveyard-recursion piloting** (how aggressively the AI loops Necrarch /
Hollow Shepherd / Call of the Grave / Mortifex), which is a *pilot* difference, not a *rules* one —
the vectors don't constrain it.

---

## 4. COMBO SEARCH

The pilot's lethal-finder actively tries to assemble both OTKs. Results (search vs search, 40
games each, vs the evolved Zombies deck):

| Combo | Win rate | Median kill-turn | Decided kills |
|---|---|---|---|
| **Helios redirect** (Crowns-Helios deck) | **95.0%** | **turn 22** | 34/40 |
| **Vorruk burn** (Wizards-Burn deck) | **50.0%** | **turn 14.5** | 20/40 |

**Helios — dominant win condition, but NOT an unanswerable 6-mana OTK.** Search wins 95% with the
Helios deck, but the kill lands around **turn 22**, not turn 6. Two engine facts defuse the
"multi-Helios burst" worry:
1. **Multiple Helios do NOT stack.** Helios is a *replacement*: the first one converts the heal to
   damage, so a second Helios has no heal left to replace. Verified: 2× Helios + heal 5 → **5**
   damage (enemy 30→25), not 10. The "multi-Helios + heals at 6 mana" OTK is mathematically
   impossible under correct replacement semantics — and the 2-copy deck cap makes "multi-Helios"
   mean at most 2 anyway.
2. The kill is **inevitability** (redirect + the draw rider's card advantage grinding the
   opponent out), not a single-turn combo. That's a *power-level* concern (Crowns is a tyrant),
   not a *combo-OTK* concern.

**Vorruk — the OTK math is real, but the pilot converts it only ~half the time.** With 2 Vorruks +
Sparkpup + Glyphmaster on board, Spell Damage = **+10**, so Fireball deals **16** and Pyroblast
deals **20** — uncapped Vorruk genuinely scales into OTK territory. But assembling that board state
is hard, and the limited pilot only reaches lethal in 50% of games (median turn 14.5). So: **the
ceiling is dangerous (confirmed by the SD arithmetic), but I cannot claim a reliable Vorruk OTK
from this engine's play** — directional, under-found by a shallow pilot. A stronger MCTS could push
this number up; I am not going to pretend the 50% is the true figure.

---

## 5. THE 3 LIVE-CARD VERDICTS

### Helios (Crowns 6m 2/5) — **the card to watch**
- **As an OTK:** No. The redirect is not an unanswerable 6-mana kill (kill-turn ~22; multi-Helios
  doesn't stack). The brief's burst-OTK worry is **not** borne out by this engine.
- **As a balance/cleanliness problem:** Yes. Helios sits in the **tyrant class (Crowns, 70.8%, no
  losing matchup)** and is the source of **all 3 cleanliness flags** (heal-replacement collisions
  with Mama Bark / Dawn Acolyte / Plague Doctor). It is also a card-advantage engine (the draw
  rider) bolted onto a heal-control shell.
- **Recommendation (not an edit — it's LIVE but I recommend rather than silently change):**
  (a) Add the one clarifying clause to close all 3 flags: *"…instead deal that much damage to the
  enemy Hero; effects that increase or prevent the restore do not apply."* (b) For power level,
  the draw rider is the likely lever — consider *"draw a card (once per turn)"* — but note Crowns
  tyrants **even in the GA's best Crowns build, which dropped Helios** for a Sun King/Mama Bark
  heal core. So Helios is not the *sole* cause of Crowns' dominance; the class heal package is.

### Grave Tide (Zombies 5m 3/4, pay-2-HP self-mill) — **safe; does not overpower Zombies**
- Zombies is the **weakest class in this engine (36.8%)**, so life-paid self-mill is **not**
  pushing Zombies toward tyrant — if anything Zombies needs help.
- The **2-HP cost is a real constraint** and the pay-to-death ruling (open question 20) is pinned:
  you **cannot** activate it if it would drop you to ≤0 HP, and it's once/turn. Verified
  (can't fire at 2 HP; at 5 HP → 3 HP; second activation blocked).
- **Recommendation:** leave as-is. No nerf justified; the card is fine and the cost ruling is clean.

### Keenhound (Bows 3m 3/3, draw-on-kill) — **do NOT trim to 2/3**
- Bows is **mid-pack (53.8%)**, below the 58% ceiling. The "old 70%" is **not reproduced** by this
  MCTS-style + genetic build — it looks like a hill-climb artefact (or another engine's pilot
  over-valuing the draw shell).
- The brief says "recommend 2/3 trim *only if* the new engine confirms it." **It does not confirm.**
- **Recommendation:** keep Keenhound at **3/3**. Re-test under a stronger pilot before any trim.

---

## 6. FINAL CALL

**Is the engine clean? — YES.** It is YGO-clean: a real priority/chain stack, replacement-vs-trigger
separation, deterministic combat and timing. It passes **31/31** ground-truth checks and resolves
all 7 open questions. The flag list is **tiny (3 items), all the same root cause** (Helios's heal
replacement colliding with other heal-modifiers), and one clause on Helios closes all three. By the
brief's own bar ("a clean set has an empty or tiny flag list"), **this engine is clean.**

**Is the set balanced by this independent build? — NO.** Two hard failures:
1. **Crowns is a tyrant** (70.8% avg, **no losing matchup**), above the **58% pool ceiling**.
2. The class ladder **contradicts the design prior**: Crowns top / Zombies bottom, not Zombies top.

**Validated? — NO, not yet.** The engine is validated (clean); the *balance* is not. The set is
**not** ready to lock.

**Critical caveat that bounds all of the above:** the pilot is a depth-limited search, and the
skill check proves it **mis-pilots reactive control** (search < greedy for Crowns and Wizards).
That cuts two ways: it may **inflate Crowns** (opponents don't pressure a control deck well) and
**deflate Zombies** (recursion loops under-played). So the *direction* of the imbalance (Crowns
strong, Zombies weak) is a real signal, but the **magnitudes are soft** and the tyrant claim should
be confirmed with a stronger MCTS before acting. I am reporting a truthful "clean engine, imbalanced
set, measured with a known-weak pilot" rather than a fake "balanced."

**The 3 LIVE cards:**
- **Helios** — clean-flag + lives in the tyrant class. Apply the clarifying clause; consider toning
  the draw rider. **Not ready to lock.**
- **Grave Tide** — safe, cost ruling clean. **Ready to lock.**
- **Keenhound** — not overpowered here; **do not trim**. **Ready to lock at 3/3.**

**Bottom line:** Build the engine on these rules — it's clean. But before locking, (1) add the
Helios clarifying clause, (2) re-run the balance battery with a stronger pilot to confirm whether
Crowns is genuinely a tyrant or a control-mis-pilot artefact, and (3) investigate why Zombies floors
so low (likely recursion piloting, not rules). Do not lock Helios until Crowns' power level is
resolved; Grave Tide and Keenhound look lockable.

---

## 7. INVENTORY CONFIRMATION

- **111 cards total**, verified by code: Bows 14 (12c/2s), Crowns 14, Pirates 14, Wizards 14,
  Zombies 14, Neutral 41 (18 creatures / 17 spells / 6 traps). Matches Section F exactly.
- **108 LOCKED, 3 LIVE** (Keenhound, Helios, Grave Tide). No LOCKED card was altered; Vorruk
  remains uncapped in the data (re-cap is a *recommendation* in §5, not an edit).
- Reproduce: `python3 tests/test_vectors.py` (31/31), `python3 matrix.py`, `python3 run_all.py`.
