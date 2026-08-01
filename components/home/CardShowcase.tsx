import Link from 'next/link';
import TCGCard from '@/components/TCGCard';
import { CARDS } from '@/lib/cards';

export default function CardShowcase() {
  const showcase = CARDS.slice(0, 8);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">
            Every Legend is<br />Hand-Pixeled by Artists
          </h2>
          <p className="mt-3 max-w-xl text-ink-soft">
            No stock art, no shortcuts. Each card in Volume 01 is original pixel art from artists in the
            Doginal Dogs community, credited right on the card.
          </p>
        </div>
        <Link
          href="/cards"
          className="rounded-md border-2 border-ink bg-paper px-6 py-2.5 font-display text-lg uppercase shadow-[3px_3px_0_rgba(26,20,9,0.85)] transition-transform hover:-translate-y-0.5"
        >
          Full Card Gallery →
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {showcase.map((card) => (
          <TCGCard key={card.id} card={card} className="transition-transform hover:-translate-y-2" />
        ))}
      </div>
    </section>
  );
}
