"""
Full battery: skill sanity check, GA deck evolution, 5x5 matchup, skill gradient,
mature-pool ceiling, and combo search (Helios / Vorruk). Prints a structured report and
writes results.json. Every number here is produced by running games -- nothing hand-set.

Scale knobs are small by default so this finishes in a few minutes; raise via env vars.
All games/seeds actually used are printed so the report can be honest about compute.
"""
import os, sys, json, time, random, statistics
import balance, ai, genetic
from decks import SEEDS, CLASS_SEEDS

def G(name, default):
    return int(os.environ.get(name, default))

SEEDS_N      = G("SEEDS_N", 3)            # number of RNG seeds (multi-seed honesty)
MATCH_GAMES  = G("MATCH_GAMES", 30)       # games per matchup per seed (search level)
GRAD_GAMES   = G("GRAD_GAMES", 60)        # games per matchup per seed (greedy gradient)
GA_GENS      = G("GA_GENS", 4)
GA_POP       = G("GA_POP", 12)
GA_GAMES     = G("GA_GAMES", 4)
COMBO_GAMES  = G("COMBO_GAMES", 40)

CLASSES = ["Bows", "Crowns", "Pirates", "Wizards", "Zombies"]
results = {"config": dict(SEEDS_N=SEEDS_N, MATCH_GAMES=MATCH_GAMES, GRAD_GAMES=GRAD_GAMES,
                          GA_GENS=GA_GENS, GA_POP=GA_POP, GA_GAMES=GA_GAMES, COMBO_GAMES=COMBO_GAMES)}
t0 = time.time()

def rep_class(deck):
    from collections import Counter
    c = Counter(x.cls for x in deck)
    c.pop("Neutral", None)
    return c.most_common(1)[0][0] if c else "Neutral"

# ============================================================ 1. SKILL SANITY
print("\n===== 1. SKILL SANITY CHECK (search vs greedy, same deck) =====")
skill = {}
for cls in CLASSES:
    deck = SEEDS[CLASS_SEEDS[cls][0]]
    wr = []
    for s in range(SEEDS_N):
        # search (player A) vs greedy (player B), same deck
        wr.append(balance.match(deck, deck, 40, 1000 + s * 37, balance.SEARCH, balance.GREEDY))
    skill[cls] = (statistics.mean(wr), wr)
    print(f"  {cls:8} search-vs-greedy winrate = {statistics.mean(wr)*100:5.1f}%  (seeds {[round(x*100) for x in wr]})")
results["skill_sanity"] = {k: v[0] for k, v in skill.items()}
print(f"  [elapsed {time.time()-t0:.0f}s]")

# ============================================================ 2. GA EVOLUTION
print("\n===== 2. GENETIC DECK EVOLUTION (greedy fitness) =====")
gauntlet = [SEEDS[CLASS_SEEDS[c][0]] for c in CLASSES]   # one representative per class
best_decks = {}
ga_hist = {}
for cls in CLASSES:
    bd, bf, hist = genetic.evolve_class(cls, gauntlet, generations=GA_GENS, pop_size=GA_POP,
                                        games_each=GA_GAMES, seed=7, verbose=True)
    best_decks[cls] = bd
    ga_hist[cls] = hist
    print(f"  {cls:8} GA best fitness vs gauntlet = {bf*100:5.1f}%")
results["ga_history"] = ga_hist
print(f"  [elapsed {time.time()-t0:.0f}s]")

# ============================================================ 3. 5x5 MATCHUP (search)
print("\n===== 3. 5x5 CLASS MATCHUP @ TOP SKILL (search, evolved best decks) =====")
grid = {a: {} for a in CLASSES}
for a in CLASSES:
    for b in CLASSES:
        wr = []
        for s in range(SEEDS_N):
            wr.append(balance.match(best_decks[a], best_decks[b], MATCH_GAMES,
                                    5000 + s * 101, balance.SEARCH, balance.SEARCH))
        grid[a][b] = (statistics.mean(wr), statistics.pstdev(wr) if len(wr) > 1 else 0.0)
# print grid
hdr = "          " + "".join(f"{b[:4]:>8}" for b in CLASSES) + "   AVG"
print(hdr)
class_avg = {}
for a in CLASSES:
    row = f"{a:>9} "
    vals = []
    for b in CLASSES:
        m = grid[a][b][0]; vals.append(m)
        row += f"{m*100:7.1f} "
    # exclude mirror from avg
    nonmirror = [grid[a][b][0] for b in CLASSES if b != a]
    class_avg[a] = statistics.mean(nonmirror)
    row += f"  {class_avg[a]*100:5.1f}"
    print(row)
results["grid"] = {a: {b: grid[a][b][0] for b in CLASSES} for a in CLASSES}
results["class_avg_search"] = class_avg

# tyrant check
top = max(class_avg, key=class_avg.get)
losing = [b for b in CLASSES if b != top and grid[top][b][0] < 0.5]
print(f"\n  Top class: {top} ({class_avg[top]*100:.1f}% avg). Losing matchups: {losing or 'NONE (tyrant risk)'}")
results["top_class"] = top
results["top_losing_matchups"] = losing
print(f"  [elapsed {time.time()-t0:.0f}s]")

# ============================================================ 4. SKILL GRADIENT
print("\n===== 4. SKILL GRADIENT (greedy 'low skill' vs search 'high skill') =====")
grad = {}
for a in CLASSES:
    lo = []; hi = []
    for b in CLASSES:
        if b == a:
            continue
        wl = statistics.mean([balance.match(best_decks[a], best_decks[b], GRAD_GAMES,
                              9000 + s, balance.GREEDY, balance.GREEDY) for s in range(SEEDS_N)])
        lo.append(wl)
    grad[a] = (statistics.mean(lo), class_avg[a])
    print(f"  {a:8} low-skill avg = {statistics.mean(lo)*100:5.1f}%   high-skill avg = {class_avg[a]*100:5.1f}%   delta = {(class_avg[a]-statistics.mean(lo))*100:+5.1f}")
results["gradient"] = {a: {"low": grad[a][0], "high": grad[a][1]} for a in CLASSES}
print(f"  [elapsed {time.time()-t0:.0f}s]")

# ============================================================ 5. MATURE-POOL CEILING
print("\n===== 5. MATURE-POOL CEILING (no deck above ~58%) =====")
# overall win rate of each evolved best deck vs the field (all best decks), search
ceiling = {}
for a in CLASSES:
    wr = []
    for b in CLASSES:
        if b == a:
            continue
        wr.append(grid[a][b][0])
    ceiling[a] = statistics.mean(wr)
mx = max(ceiling.values())
for a in sorted(ceiling, key=ceiling.get, reverse=True):
    print(f"  {a:8} field winrate = {ceiling[a]*100:5.1f}%")
print(f"  Pool ceiling = {mx*100:.1f}%  ({'OK <=58%' if mx <= 0.58 else 'ABOVE 58% -- investigate'})")
results["pool_ceiling"] = mx

# ============================================================ 6. COMBO SEARCH
print("\n===== 6. COMBO SEARCH (does MCTS-style search assemble the OTKs?) =====")
def combo_eval(deckA, oppdeck, label, games, seed0):
    wins = 0; kill_turns = []
    for i in range(games):
        first = i % 2
        if first == 0:
            w, t, decided = balance.play_game(deckA, oppdeck, seed0 + i, balance.SEARCH, balance.SEARCH, first=0, want_turns=True)
            win = (w == 0)
        else:
            w, t, decided = balance.play_game(oppdeck, deckA, seed0 + i, balance.SEARCH, balance.SEARCH, first=0, want_turns=True)
            win = (w == 1)
        wins += win
        if win and decided:
            kill_turns.append(t)
    wr = wins / games
    kt = statistics.median(kill_turns) if kill_turns else None
    print(f"  {label}: winrate={wr*100:.1f}%  median kill-turn={kt}  (decided kills={len(kill_turns)}/{games})")
    return {"winrate": wr, "median_kill_turn": kt, "decided_kills": len(kill_turns), "games": games}

helios_deck = SEEDS["Crowns-Helios"]
vorruk_deck = SEEDS["Wizards-Burn"]
control_opp = best_decks["Zombies"]
results["combo_helios"] = combo_eval(helios_deck, control_opp, "Helios redirect (vs Zombies)", COMBO_GAMES, 20000)
results["combo_vorruk"] = combo_eval(vorruk_deck, control_opp, "Vorruk burn   (vs Zombies)", COMBO_GAMES, 30000)
print(f"  [elapsed {time.time()-t0:.0f}s]")

# ============================================================ save
results["best_decklists"] = {a: sorted(c.name for c in best_decks[a]) for a in CLASSES}
results["elapsed_sec"] = round(time.time() - t0, 1)
with open("results.json", "w") as f:
    json.dump(results, f, indent=2)
print(f"\nDONE in {results['elapsed_sec']}s -> results.json")
