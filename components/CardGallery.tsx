'use client';

import { useMemo, useState } from 'react';
import TCGCard from '@/components/TCGCard';
import { CloseIcon, SearchIcon } from '@/components/icons';
import type { DogCard, Faction, Rarity, CardType } from '@/lib/cards';
import { CARDS, CARD_TYPES, FACTIONS, RARITIES } from '@/lib/cards';

const FACTION_NAMES = Object.keys(FACTIONS) as Faction[];

export default function CardGallery() {
  const [query, setQuery] = useState('');
  const [faction, setFaction] = useState<Faction | 'All'>('All');
  const [rarity, setRarity] = useState<Rarity | 'All'>('All');
  const [type, setType] = useState<CardType | 'All'>('All');
  const [selected, setSelected] = useState<DogCard | null>(null);

  const filtered = useMemo(
    () =>
      CARDS.filter((card) => {
        if (faction !== 'All' && card.faction !== faction) return false;
        if (rarity !== 'All' && card.rarity !== rarity) return false;
        if (type !== 'All' && card.type !== type) return false;
        if (query && !`${card.name} ${card.artist} ${card.flavor}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        return true;
      }),
    [query, faction, rarity, type],
  );

  const selectClass =
    'rounded-md border-2 border-ink bg-paper px-3 py-2 font-display text-sm uppercase shadow-[2px_2px_0_rgba(26,20,9,0.85)]';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-6xl uppercase leading-none sm:text-7xl">Card Gallery</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Every card in <strong>Volume 01: Legends of the Pack</strong> — {CARDS.length} hand-pixeled legends
        across four factions. Click any card for details.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <label className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cards or artists…"
            className="w-64 rounded-md border-2 border-ink bg-paper py-2 pl-9 pr-3 text-sm shadow-[2px_2px_0_rgba(26,20,9,0.85)] outline-none placeholder:text-ink-soft/60 focus:border-bark"
          />
        </label>
        <select value={faction} onChange={(e) => setFaction(e.target.value as Faction | 'All')} className={selectClass} aria-label="Filter by faction">
          <option value="All">All Factions</option>
          {FACTION_NAMES.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <select value={rarity} onChange={(e) => setRarity(e.target.value as Rarity | 'All')} className={selectClass} aria-label="Filter by rarity">
          <option value="All">All Rarities</option>
          {RARITIES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value as CardType | 'All')} className={selectClass} aria-label="Filter by card type">
          <option value="All">All Types</option>
          {CARD_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <span className="ml-auto font-display text-sm uppercase text-ink-soft">
          {filtered.length} of {CARDS.length} cards
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center font-display text-3xl uppercase text-ink-soft">
          No cards found. Much empty. Wow.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelected(card)}
              className="text-left transition-transform hover:-translate-y-2"
              aria-label={`View ${card.name}`}
            >
              <TCGCard card={card} />
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/85 p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} details`}
        >
          <div
            className="grid w-full max-w-3xl gap-6 rounded-xl border-[3px] border-ink bg-cream p-6 shadow-[8px_8px_0_rgba(26,20,9,0.85)] sm:grid-cols-2 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-full max-w-[16rem]">
              <TCGCard card={selected} />
            </div>
            <div className="relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute -right-2 -top-2"
                aria-label="Close card details"
              >
                <CloseIcon className="h-6 w-6 fill-ink" />
              </button>
              <p className="font-display text-sm uppercase tracking-widest text-bark">{selected.id.toUpperCase()}</p>
              <h2 className="font-display text-4xl uppercase leading-none">{selected.name}</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between border-b border-ink/15 pb-1">
                  <dt className="font-bold uppercase text-ink-soft">Faction</dt>
                  <dd>{selected.faction}</dd>
                </div>
                <div className="flex justify-between border-b border-ink/15 pb-1">
                  <dt className="font-bold uppercase text-ink-soft">Type</dt>
                  <dd>{selected.type}</dd>
                </div>
                <div className="flex justify-between border-b border-ink/15 pb-1">
                  <dt className="font-bold uppercase text-ink-soft">Rarity</dt>
                  <dd>{selected.rarity}</dd>
                </div>
                <div className="flex justify-between border-b border-ink/15 pb-1">
                  <dt className="font-bold uppercase text-ink-soft">Cost</dt>
                  <dd>{selected.cost}</dd>
                </div>
                {selected.power !== null && (
                  <div className="flex justify-between border-b border-ink/15 pb-1">
                    <dt className="font-bold uppercase text-ink-soft">Power</dt>
                    <dd>{selected.power}</dd>
                  </div>
                )}
                <div className="flex justify-between border-b border-ink/15 pb-1">
                  <dt className="font-bold uppercase text-ink-soft">Artist</dt>
                  <dd>{selected.artist}</dd>
                </div>
              </dl>
              <p className="mt-4 italic text-ink-soft">“{selected.flavor}”</p>
              <p className="mt-4 text-xs text-ink-soft">{FACTIONS[selected.faction].blurb}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
