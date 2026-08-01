import Link from 'next/link';
import PixelDog from '@/components/PixelDog';
import { PRODUCTS } from '@/lib/stores';
import { RETAIL_PARTNERS } from '@/lib/stores';

export default function ShopProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">Shop Latest Products</h2>
        <Link
          href="/presale"
          className="font-display text-lg uppercase text-bark underline underline-offset-4 hover:text-doge-deep"
        >
          Shop Now →
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {PRODUCTS.map((product) => (
          <Link
            key={product.id}
            href="/presale"
            className="group overflow-hidden rounded-xl border-[3px] border-ink bg-paper shadow-[4px_4px_0_rgba(26,20,9,0.85)] transition-transform hover:-translate-y-1"
          >
            <div
              className="flex aspect-square items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${product.palette[0]}, ${product.palette[1]})` }}
            >
              <PixelDog
                palette={{ fur: '#fffcf2', furLight: '#f4ecdb', accent: product.palette[0], bg: 'transparent' }}
                className="h-1/2 w-auto opacity-90 transition-transform group-hover:scale-110"
              />
            </div>
            <div className="border-t-[3px] border-ink p-3">
              <p className="font-display text-[0.65rem] uppercase tracking-widest text-bark">{product.tag}</p>
              <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug">{product.name}</p>
              <p className="mt-1 font-display text-xl">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-14 rounded-xl border-[3px] border-ink bg-paper p-6 shadow-[4px_4px_0_rgba(26,20,9,0.85)] sm:p-8">
        <h3 className="font-display text-3xl uppercase">Available at these fine retailers</h3>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {RETAIL_PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              className="flex flex-col items-center gap-2 rounded-lg border-2 border-ink/15 bg-cream p-4 transition-colors hover:border-ink"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-doge font-display text-lg">
                {partner.initials}
              </span>
              <span className="text-center text-xs font-bold uppercase tracking-wide">{partner.name}</span>
            </a>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          …and many other shops around the USA. Stores can order wholesale through our distributors —{' '}
          <Link href="/stores" className="font-bold text-bark underline underline-offset-2">
            learn more here
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
