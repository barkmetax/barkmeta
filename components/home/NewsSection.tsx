import Link from 'next/link';
import { NEWS, formatDate } from '@/lib/news';

export default function NewsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">What&apos;s New</h2>
        <Link
          href="/news"
          className="font-display text-lg uppercase text-bark underline underline-offset-4 hover:text-doge-deep"
        >
          All News →
        </Link>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {NEWS.map((article) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="group flex flex-col rounded-xl border-[3px] border-ink bg-paper p-5 shadow-[4px_4px_0_rgba(26,20,9,0.85)] transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <span className="rounded border-2 border-ink bg-bark px-2 py-0.5 font-display text-xs uppercase text-paper">
                {article.category}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {formatDate(article.date)}
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl uppercase leading-tight group-hover:text-bark">
              {article.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{article.excerpt}</p>
            <span className="mt-auto pt-4 font-display text-sm uppercase text-doge-deep">Read More →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
