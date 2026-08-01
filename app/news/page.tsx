import type { Metadata } from 'next';
import Link from 'next/link';
import { NEWS, formatDate } from '@/lib/news';

export const metadata: Metadata = {
  title: 'News — Doginal Dogs TCG',
  description: 'Announcements, events, and updates from the Doginal Dogs Trading Card Game.',
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-6xl uppercase leading-none sm:text-7xl">News</h1>
      <p className="mt-3 text-ink-soft">Announcements, events, and updates from the pack.</p>
      <div className="mt-10 space-y-6">
        {NEWS.map((article) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="group block rounded-xl border-[3px] border-ink bg-paper p-6 shadow-[4px_4px_0_rgba(26,20,9,0.85)] transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <span className="rounded border-2 border-ink bg-bark px-2 py-0.5 font-display text-xs uppercase text-paper">
                {article.category}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {formatDate(article.date)}
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl uppercase leading-tight group-hover:text-bark sm:text-4xl">
              {article.title}
            </h2>
            <p className="mt-2 max-w-3xl text-ink-soft">{article.excerpt}</p>
            <span className="mt-3 inline-block font-display uppercase text-doge-deep">Read More →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
