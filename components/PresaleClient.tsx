'use client';

import { useState } from 'react';
import TCGCard from '@/components/TCGCard';
import { CARDS } from '@/lib/cards';
import { PRODUCTS } from '@/lib/stores';
import PixelDog from '@/components/PixelDog';

const PRICE = 149;
const MAX_QTY = 3;

export default function PresaleClient() {
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState('');
  const [reserved, setReserved] = useState(false);

  const binderCards = [CARDS[0], CARDS[1], CARDS[2], CARDS[3], CARDS[18]];

  return (
    <div>
      <section className="dots border-b-[3px] border-ink">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-xl border-[3px] border-ink bg-ink p-6 shadow-[8px_8px_0_rgba(26,20,9,0.5)]">
              <p className="text-center font-display text-2xl uppercase text-doge">Legends Binder</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {binderCards.slice(0, 3).map((card) => (
                  <TCGCard key={card.id} card={card} />
                ))}
              </div>
              <p className="mt-4 text-center text-xs uppercase tracking-widest text-paper/60">
                10 cards · individually numbered · foil-stamped
              </p>
            </div>
            <span className="absolute -right-3 -top-3 rotate-6 rounded-md border-2 border-ink bg-bark px-3 py-1 font-display uppercase text-paper shadow-[2px_2px_0_rgba(26,20,9,0.85)]">
              Presale
            </span>
          </div>

          <div>
            <p className="font-display text-lg uppercase tracking-widest text-bark">Volume 01 · Special Collection</p>
            <h1 className="mt-2 font-display text-6xl uppercase leading-[0.9] sm:text-7xl">
              10-Card Legends Binder
            </h1>
            <p className="mt-4 max-w-md text-ink-soft">
              The definitive first collection of Doginal Dogs TCG. Ten hand-pixeled legends — including all
              four faction Alphas — sealed in a numbered collector binder with a foil certificate of
              authenticity.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
              <li>✔ All 4 Legendary Alphas guaranteed</li>
              <li>✔ 1 chase laser-eye variant per binder (random)</li>
              <li>✔ Individually numbered — only 5,000 binders worldwide</li>
              <li>✔ Ships worldwide, fall 2026</li>
            </ul>

            <p className="mt-6 font-display text-5xl">${PRICE}</p>

            {reserved ? (
              <div className="mt-6 flex items-center gap-4 rounded-xl border-[3px] border-ink bg-paper p-5 shadow-[4px_4px_0_rgba(26,20,9,0.85)]">
                <PixelDog
                  palette={{ fur: '#e8a33d', furLight: '#f7e3bd', accent: '#cf3f2b', bg: 'transparent' }}
                  className="h-14 w-14"
                />
                <div>
                  <p className="font-display text-2xl uppercase text-storm">Reservation confirmed!</p>
                  <p className="text-sm text-ink-soft">
                    {qty} binder{qty > 1 ? 's' : ''} reserved for <strong>{email}</strong>. Watch your inbox
                    for the checkout link when your batch opens. Wow.
                  </p>
                </div>
              </div>
            ) : (
              <form
                className="mt-6 flex max-w-md flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes('@')) setReserved(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <label className="font-display uppercase text-ink-soft" htmlFor="qty">
                    Qty
                  </label>
                  <div className="flex items-center rounded-md border-2 border-ink bg-paper shadow-[2px_2px_0_rgba(26,20,9,0.85)]">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-3 py-1.5 font-display text-xl"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span id="qty" className="w-8 text-center font-display text-xl">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(Math.min(MAX_QTY, qty + 1))}
                      className="px-3 py-1.5 font-display text-xl"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs uppercase text-ink-soft">Max {MAX_QTY} per household</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 rounded-md border-2 border-ink bg-paper px-3 py-2.5 shadow-[2px_2px_0_rgba(26,20,9,0.85)] outline-none placeholder:text-ink-soft/60 focus:border-bark"
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    className="rounded-md border-2 border-ink bg-doge px-6 py-2.5 font-display text-xl uppercase shadow-[4px_4px_0_rgba(26,20,9,0.85)] transition-transform hover:-translate-y-0.5"
                  >
                    Reserve — ${PRICE * qty}
                  </button>
                </div>
                <p className="text-xs text-ink-soft">
                  Limited quantities. Reservations are first come, first served; payment is collected when
                  your batch opens.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-display text-4xl uppercase sm:text-5xl">Also in the Presale Shop</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-xl border-[3px] border-ink bg-paper shadow-[4px_4px_0_rgba(26,20,9,0.85)]"
            >
              <div
                className="flex aspect-square items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${product.palette[0]}, ${product.palette[1]})` }}
              >
                <PixelDog
                  palette={{ fur: '#fffcf2', furLight: '#f4ecdb', accent: product.palette[0], bg: 'transparent' }}
                  className="h-1/2 w-auto opacity-90"
                />
              </div>
              <div className="border-t-[3px] border-ink p-3">
                <p className="font-display text-[0.65rem] uppercase tracking-widest text-bark">{product.tag}</p>
                <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug">{product.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-display text-xl">${product.price}</p>
                  <span className="rounded border border-ink/30 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-ink-soft">
                    Ships with Vol. 01
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
