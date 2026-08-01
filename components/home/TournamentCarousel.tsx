'use client';

import { useCallback, useEffect, useState } from 'react';
import PixelDog from '@/components/PixelDog';

const SLIDES = [
  {
    caption: 'Legends Cup Qualifier — Los Angeles',
    detail: '128 players. One Golden Bone.',
    bg: 'linear-gradient(135deg, #4d5fb8, #1a1409)',
    dogs: 3,
  },
  {
    caption: 'Bark Arena League Night — Brooklyn',
    detail: 'Weekly Swiss, every Wednesday.',
    bg: 'linear-gradient(135deg, #cf3f2b, #1a1409)',
    dogs: 2,
  },
  {
    caption: 'Volume 01 Sealed Showdown — Austin',
    detail: 'Crack packs. Build. Battle.',
    bg: 'linear-gradient(135deg, #b97a14, #1a1409)',
    dogs: 4,
  },
  {
    caption: 'Community Draft Day — Seattle',
    detail: 'Legends Draft with the Moon Pack crew.',
    bg: 'linear-gradient(135deg, #2e8c85, #1a1409)',
    dogs: 3,
  },
];

const DOG_PALETTES = [
  { fur: '#e8a33d', furLight: '#f7e3bd', accent: '#cf3f2b', bg: 'transparent' },
  { fur: '#8a93a6', furLight: '#e9edf2', accent: '#4d5fb8', bg: 'transparent' },
  { fur: '#dcc39a', furLight: '#f7efe0', accent: '#c2452f', bg: 'transparent' },
  { fur: '#4e7d78', furLight: '#bfe0dc', accent: '#e9a93d', bg: 'transparent' },
];

export default function TournamentCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">Tournaments Everywhere</h2>
      <p className="mt-3 max-w-xl text-ink-soft">
        From kitchen tables to championship stages — the pack gathers all across the country.
      </p>
      <div className="relative mt-8 overflow-hidden rounded-xl border-[3px] border-ink shadow-[6px_6px_0_rgba(26,20,9,0.85)]">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div
              key={slide.caption}
              className="relative flex aspect-[16/7] w-full shrink-0 items-end"
              style={{ background: slide.bg }}
            >
              <div className="dots-light absolute inset-0" />
              <div className="absolute bottom-0 right-6 flex items-end gap-2 sm:right-12 sm:gap-4">
                {Array.from({ length: slide.dogs }).map((_, i) => (
                  <PixelDog
                    key={i}
                    palette={DOG_PALETTES[i % DOG_PALETTES.length]}
                    className="h-20 w-20 opacity-90 sm:h-32 sm:w-32"
                  />
                ))}
              </div>
              <div className="relative p-6 text-paper sm:p-10">
                <p className="font-display text-2xl uppercase leading-none sm:text-4xl">{slide.caption}</p>
                <p className="mt-1 text-sm text-paper/80 sm:text-base">{slide.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-paper font-display text-xl shadow-[2px_2px_0_rgba(26,20,9,0.85)]"
        >
          ←
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-paper font-display text-xl shadow-[2px_2px_0_rgba(26,20,9,0.85)]"
        >
          →
        </button>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full border border-ink ${i === index ? 'bg-doge' : 'bg-paper/60'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
