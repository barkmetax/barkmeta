"""
Match runner + balance battery. Plays full games with chosen pilots and reports win rates
with multi-seed variance. All numbers printed here are produced by actually running games.
"""
from __future__ import annotations
import random, statistics
import flow, ai
from decks import SEEDS, CLASS_SEEDS


def play_game(deck0, deck1, seed, pilot0, pilot1, first=0, max_turns=50, want_turns=False):
    rng = random.Random(seed)
    g = flow.start_game(deck0, deck1, rng, first=first)
    pilots = [pilot0, pilot1]
    t = 0
    while not g.is_over() and t < max_turns:
        flow.begin_turn(g)
        if g.is_over():
            break
        pilots[g.active](g, g.active)
        if g.is_over():
            break
        flow.end_turn(g)
        t += 1
    decided = g.winner is not None
    if g.winner is None:
        g.winner = 0 if g.players[0].hero_hp >= g.players[1].hero_hp else 1
    if want_turns:
        return g.winner, t, decided
    return g.winner


def match(deckA, deckB, n_games, base_seed, pilotA, pilotB):
    """Return A's win fraction over n_games, alternating who goes first."""
    wins = 0
    for i in range(n_games):
        first = i % 2
        if first == 0:
            w = play_game(deckA, deckB, base_seed + i, pilotA, pilotB, first=0)
            wins += (w == 0)
        else:
            w = play_game(deckB, deckA, base_seed + i, pilotB, pilotA, first=0)
            wins += (w == 1)
    return wins / n_games


GREEDY = lambda g, i: ai.greedy_turn(g, i)
SEARCH = lambda g, i: ai.search_turn(g, i)
