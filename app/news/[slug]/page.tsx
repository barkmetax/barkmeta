import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NEWS, formatDate, getArticle } from '@/lib/news';

export function generateStaticParams() {
  return NEWS.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: 'News — Doginal Dogs TCG' };
  return { title: `${article.title} — Doginal Dogs TCG`, description: article.excerpt };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/news" className="font-display uppercase text-bark underline underline-offset-4">
        ← All News
      </Link>
      <div className="mt-6 flex items-center gap-3">
        <span className="rounded border-2 border-ink bg-bark px-2 py-0.5 font-display text-xs uppercase text-paper">
          {article.category}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {formatDate(article.date)}
        </span>
      </div>
      <h1 className="mt-4 font-display text-5xl uppercase leading-none sm:text-6xl">{article.title}</h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink">
        {article.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-12 rounded-xl border-[3px] border-ink bg-doge p-6 text-center shadow-[4px_4px_0_rgba(26,20,9,0.85)]">
        <p className="font-display text-2xl uppercase">Don&apos;t miss the next drop</p>
        <Link
          href="/presale"
          className="mt-3 inline-block rounded-md border-2 border-ink bg-paper px-6 py-2 font-display uppercase shadow-[3px_3px_0_rgba(26,20,9,0.85)]"
        >
          Shop the Presale
        </Link>
      </div>
    </article>
  );
}
