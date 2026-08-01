'use client';

import Link from 'next/link';
import { useState } from 'react';
import PixelDog from '@/components/PixelDog';
import { CloseIcon, PlayIcon } from '@/components/icons';

export default function HowToPlayTeaser() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="border-y-[3px] border-ink bg-ink text-paper">
      <div className="dots-light mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none text-doge sm:text-6xl">How to Play</h2>
          <p className="mt-4 max-w-md text-paper/85">
            Every player leads a unique pack, guided by an <strong className="text-doge">Alpha</strong> and
            empowered through a <strong className="text-doge">Gate</strong>. Outwit your rivals with cunning,
            tactics, and the unbreakable will of the pack.
          </p>
          <p className="mt-3 max-w-md text-paper/85">
            Learn the basics in five minutes. Master the meta over a lifetime of treats.
          </p>
          <Link
            href="/how-to-play"
            className="mt-6 inline-block rounded-md border-2 border-paper bg-doge px-6 py-2.5 font-display text-lg uppercase text-ink shadow-[3px_3px_0_rgba(255,252,242,0.4)] transition-transform hover:-translate-y-0.5"
          >
            Read the Rules
          </Link>
        </div>
        <button
          onClick={() => setVideoOpen(true)}
          className="group relative aspect-video w-full overflow-hidden rounded-xl border-[3px] border-paper bg-gradient-to-br from-moon via-ink to-bark shadow-[6px_6px_0_rgba(255,252,242,0.25)]"
          aria-label="Play the how-to-play video"
        >
          <PixelDog
            palette={{ fur: '#e8a33d', furLight: '#f7e3bd', accent: '#cf3f2b', bg: 'transparent' }}
            className="absolute bottom-0 left-6 h-3/4 w-auto opacity-90"
          />
          <span className="absolute right-6 top-5 font-display text-2xl uppercase text-paper/90">
            Learn in 5 minutes
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-ink bg-doge shadow-[4px_4px_0_rgba(26,20,9,0.6)] transition-transform group-hover:scale-110">
              <PlayIcon className="ml-1 h-10 w-10 fill-ink" />
            </span>
          </span>
        </button>
      </div>

      {videoOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setVideoOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-3xl rounded-xl border-[3px] border-paper bg-ink p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute right-4 top-4"
              aria-label="Close video"
            >
              <CloseIcon className="h-6 w-6 fill-paper" />
            </button>
            <div className="flex aspect-video flex-col items-center justify-center gap-4 rounded-lg border-2 border-paper/30 bg-gradient-to-br from-moon/40 via-ink to-bark/40">
              <PixelDog
                palette={{ fur: '#e8a33d', furLight: '#f7e3bd', accent: '#cf3f2b', bg: 'transparent' }}
                className="h-24 w-24 animate-float"
              />
              <p className="font-display text-3xl uppercase text-doge">Tutorial video drops with Volume 01</p>
              <p className="max-w-md text-center text-sm text-paper/70">
                Until then, the full written rules cover everything you need for your first game.
              </p>
              <Link
                href="/how-to-play"
                onClick={() => setVideoOpen(false)}
                className="rounded-md border-2 border-paper bg-doge px-5 py-2 font-display uppercase text-ink"
              >
                Read the Rules
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
