'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Logo from './Logo';
import { CloseIcon, MenuIcon, SOCIAL_LINKS } from './icons';

const NAV_LINKS = [
  { label: 'Presale', href: '/presale' },
  { label: 'News', href: '/news' },
  { label: 'Card Gallery', href: '/cards' },
  { label: 'How to Play', href: '/how-to-play' },
  { label: 'For Stores', href: '/stores' },
  { label: 'Competitive', href: '/competitive' },
  { label: 'Store Locator', href: '/store-locator' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Doginal Dogs TCG home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display text-sm uppercase tracking-wide transition-colors hover:text-bark ${
                pathname.startsWith(link.href) ? 'text-bark underline underline-offset-4' : 'text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          {SOCIAL_LINKS.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="text-ink transition-colors hover:text-bark"
            >
              <Icon className="h-4 w-4 fill-current" />
            </a>
          ))}
          <Link
            href="/#app"
            className="rounded-md border-2 border-ink bg-doge px-3 py-1.5 font-display text-sm uppercase shadow-[2px_2px_0_rgba(26,20,9,0.85)] transition-transform hover:-translate-y-0.5"
          >
            Get the App
          </Link>
        </div>

        <button
          className="xl:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <CloseIcon className="h-7 w-7 fill-ink" /> : <MenuIcon className="h-7 w-7 fill-ink" />}
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-ink bg-cream xl:hidden">
          <nav className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink/10 py-3 font-display text-lg uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-5 py-4">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
                  <Icon className="h-5 w-5 fill-ink" />
                </a>
              ))}
            </div>
            <Link
              href="/#app"
              onClick={() => setOpen(false)}
              className="mb-2 rounded-md border-2 border-ink bg-doge px-3 py-2 text-center font-display text-base uppercase shadow-[2px_2px_0_rgba(26,20,9,0.85)]"
            >
              Get the App
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
