import type { Metadata } from 'next';
import StorePortalForm from '@/components/StorePortalForm';

export const metadata: Metadata = {
  title: 'For Stores — Doginal Dogs TCG',
  description:
    'Stock Doginal Dogs TCG, run Bark Arena organized play, and join the Store Portal for wholesale ordering and event kits.',
};

const BENEFITS = [
  {
    title: 'Wholesale margins that wag',
    text: 'Order through our national distributors with industry-standard margins, no minimums on your first order, and freight included on cases.',
  },
  {
    title: 'Bark Arena event kits',
    text: 'Certified stores receive seasonal organized-play kits: promo packs, winner playmats, and pack-standing scorecards that keep players coming back weekly.',
  },
  {
    title: 'Store Locator placement',
    text: 'Every certified store appears in our Store Locator and in-app event finder, putting your events in front of every player in your region.',
  },
  {
    title: 'Marketing that does the fetching',
    text: 'Launch kits include posters, shelf talkers, demo decks, and social assets. We drive the hype; you ring the register.',
  },
];

export default function StoresPage() {
  return (
    <div>
      <section className="dots border-b-[3px] border-ink">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h1 className="font-display text-6xl uppercase leading-none sm:text-7xl">For Stores</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Doginal Dogs TCG turns game nights into pack gatherings. Stock Volume 01, host Bark Arenas, and
            grow with the fastest-borking community in tabletop.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-display text-4xl uppercase sm:text-5xl">Why carry the game?</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border-[3px] border-ink bg-paper p-6 shadow-[4px_4px_0_rgba(26,20,9,0.85)]"
            >
              <h3 className="font-display text-2xl uppercase text-bark">{benefit.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{benefit.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm text-ink-soft">
          Already working with a distributor? Doginal Dogs TCG is available through all major tabletop
          distribution partners in the USA. Ask your rep for the Volume 01 solicitation, or reach out directly
          at <a href="mailto:retail@doginaldogs.com" className="font-bold text-bark underline">retail@doginaldogs.com</a>.
        </p>
      </section>

      <StorePortalForm />
    </div>
  );
}
