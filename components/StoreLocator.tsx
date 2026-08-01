'use client';

import { useMemo, useState } from 'react';
import { MapPinIcon, SearchIcon } from '@/components/icons';
import { STORE_LOCATIONS } from '@/lib/stores';

export default function StoreLocator() {
  const [query, setQuery] = useState('');
  const [arenaOnly, setArenaOnly] = useState(false);

  const filtered = useMemo(
    () =>
      STORE_LOCATIONS.filter((store) => {
        if (arenaOnly && !store.barkArena) return false;
        if (!query) return true;
        const haystack = `${store.name} ${store.city} ${store.state} ${store.zip}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      }),
    [query, arenaOnly],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-6xl uppercase leading-none sm:text-7xl">Store Locator</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Find certified stores and Bark Arena events near you. Search by store name, city, state, or zip code.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <label className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="City, state, zip, or store name…"
            className="w-72 rounded-md border-2 border-ink bg-paper py-2.5 pl-9 pr-3 shadow-[2px_2px_0_rgba(26,20,9,0.85)] outline-none placeholder:text-ink-soft/60 focus:border-bark"
          />
        </label>
        <label className="flex cursor-pointer items-center gap-2 font-display text-sm uppercase">
          <input
            type="checkbox"
            checked={arenaOnly}
            onChange={(e) => setArenaOnly(e.target.checked)}
            className="h-4 w-4 accent-[#cf3f2b]"
          />
          Bark Arena stores only
        </label>
        <span className="ml-auto font-display text-sm uppercase text-ink-soft">
          {filtered.length} store{filtered.length === 1 ? '' : 's'} found
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-display text-3xl uppercase text-ink-soft">No stores found in that area — yet.</p>
          <p className="mt-2 text-sm text-ink-soft">
            Know a great local game store? Tell them about the{' '}
            <a href="/stores" className="font-bold text-bark underline">
              Store Portal
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((store) => (
            <div
              key={store.id}
              className="rounded-xl border-[3px] border-ink bg-paper p-5 shadow-[4px_4px_0_rgba(26,20,9,0.85)]"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-2xl uppercase leading-tight">{store.name}</h2>
                {store.barkArena && (
                  <span className="shrink-0 rounded border-2 border-ink bg-doge px-2 py-0.5 font-display text-[0.6rem] uppercase">
                    Bark Arena
                  </span>
                )}
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
                <MapPinIcon className="h-4 w-4 fill-bark" />
                {store.address}, {store.city}, {store.state} {store.zip}
              </p>
              <ul className="mt-3 space-y-1">
                {store.events.map((event) => (
                  <li key={event} className="text-xs font-semibold uppercase tracking-wide text-storm">
                    ◆ {event}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-sm text-ink-soft">
        Store events are also searchable in the{' '}
        <a href="/#app" className="font-bold text-bark underline">
          Doginal Dogs TCG app
        </a>{' '}
        with live schedules and registration.
      </p>
    </div>
  );
}
