"""
Genetic-algorithm deck explorer (different region of deck space than a hill-climb):
class-locked genomes, round-robin fitness, mutate + crossover, elitist selection.

Fitness uses the GREEDY pilot for speed (thousands of games per generation); the final
pool's top decks are re-validated under the SEARCH pilot in run_all.py. This split is
stated in the report -- GA exploration is cheap, headline numbers use search.
"""
from __future__ import annotations
import random
from collections import Counter
from carddata import CARDS
from decks import CLASS_SEEDS, SEEDS, normalize, DECK_SIZE, MAX_COPIES
import balance

ALL = list(CARDS.values())
NEUTRAL = [c for c in ALL if c.cls == "Neutral"]

def class_pool(cls):
    return [c for c in ALL if c.cls in (cls, "Neutral")]

def random_deck(cls, rng):
    pool = class_pool(cls)
    cnt = Counter(); deck = []
    # ensure some class identity: at least 12 class cards
    cls_cards = [c for c in pool if c.cls == cls]
    while len(deck) < DECK_SIZE:
        src = cls_cards if (len([c for c in deck if c.cls == cls]) < 14 and rng.random() < 0.7) else pool
        c = rng.choice(src)
        if cnt[c.name] < MAX_COPIES:
            deck.append(c); cnt[c.name] += 1
    return deck

def mutate(deck, cls, rng, k=3):
    pool = class_pool(cls)
    deck = list(deck)
    for _ in range(k):
        if deck:
            deck.pop(rng.randrange(len(deck)))
    cnt = Counter(c.name for c in deck)
    while len(deck) < DECK_SIZE:
        c = rng.choice(pool)
        if cnt[c.name] < MAX_COPIES:
            deck.append(c); cnt[c.name] += 1
    return deck

def crossover(d1, d2, cls, rng):
    bag = list(d1) + list(d2)
    rng.shuffle(bag)
    cnt = Counter(); child = []
    for c in bag:
        if len(child) >= DECK_SIZE:
            break
        if cnt[c.name] < MAX_COPIES:
            child.append(c); cnt[c.name] += 1
    return normalize(child)


def fitness(deck, gauntlet, rng_seed, games_each=8, pilot=None):
    pilot = pilot or balance.GREEDY
    total = 0.0
    for gi, gd in enumerate(gauntlet):
        total += balance.match(deck, gd, games_each, rng_seed + gi * 100, pilot, pilot)
    return total / len(gauntlet)


def evolve_class(cls, gauntlet, generations=5, pop_size=16, games_each=6,
                 seed=0, pilot=None, verbose=False):
    rng = random.Random(seed)
    # seed population: the 3 hand-built archetypes + random fillers
    pop = [list(SEEDS[n]) for n in CLASS_SEEDS[cls]]
    while len(pop) < pop_size:
        pop.append(random_deck(cls, rng))
    best = None; best_fit = -1
    history = []
    for gen in range(generations):
        scored = [(fitness(d, gauntlet, seed + gen * 1000, games_each, pilot), d) for d in pop]
        scored.sort(key=lambda x: x[0], reverse=True)
        if scored[0][0] > best_fit:
            best_fit, best = scored[0][0], scored[0][1]
        history.append(scored[0][0])
        if verbose:
            print(f"    {cls} gen{gen}: best={scored[0][0]:.3f} mean={sum(s for s,_ in scored)/len(scored):.3f}")
        # elitist: keep top half, breed the rest
        survivors = [d for _, d in scored[:pop_size // 2]]
        newpop = list(survivors)
        while len(newpop) < pop_size:
            a, b = rng.sample(survivors, 2)
            child = crossover(a, b, cls, rng)
            if rng.random() < 0.8:
                child = mutate(child, cls, rng, k=rng.randint(1, 4))
            newpop.append(child)
        pop = newpop
    return best, best_fit, history
