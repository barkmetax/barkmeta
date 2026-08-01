import Link from 'next/link';
import TCGCard from '@/components/TCGCard';
import { CARDS } from '@/lib/cards';

export default function Hero() {
  const featured = [CARDS[1], CARDS[0], CARDS[2]];
  return (
    <section className="dots relative overflow-hidden border-b-[3px] border-ink">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="inline-block rounded-md border-2 border-ink bg-bark px-3 py-1 font-display text-sm uppercase tracking-widest text-paper shadow-[2px_2px_0_rgba(26,20,9,0.85)]">
            Presale is live
          </p>
          <h1 className="mt-5 font-display text-6xl uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
            Legends of<br />
            <span className="text-doge-deep">the Pack</span>
          </h1>
          <p className="mt-4 max-w-md text-lg font-semibold uppercase tracking-wide text-ink-soft">
            Volume 01 · 10-Card Legends Binder — Special Collection
          </p>
          <p className="mt-2 max-w-md text-ink-soft">
            The first-ever Doginal Dogs trading card set. Every legend hand-pixeled, every binder numbered.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/presale"
              className="rounded-md border-2 border-ink bg-doge px-8 py-3 font-display text-2xl uppercase shadow-[4px_4px_0_rgba(26,20,9,0.85)] transition-transform hover:-translate-y-1"
            >
              Shop Now
            </Link>
            <span className="font-display text-lg uppercase text-bark">Limited quantities</span>
          </div>
        </div>
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-6">
          <div className="w-40 -rotate-12 sm:w-48">
            <TCGCard card={featured[0]} />
          </div>
          <div className="animate-float z-10 -mx-10 w-44 sm:w-56">
            <TCGCard card={featured[1]} />
          </div>
          <div className="w-40 rotate-12 sm:w-48">
            <TCGCard card={featured[2]} />
          </div>
        </div>
      </div>
      <div className="overflow-hidden border-t-[3px] border-ink bg-ink py-2">
        <div className="animate-marquee flex w-max gap-8 font-display text-lg uppercase tracking-widest text-doge">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8">
              {Array.from({ length: 8 }).map((_, j) => (
                <span key={j}>Volume 01 Presale · Much Wow · Very Legend ·</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
