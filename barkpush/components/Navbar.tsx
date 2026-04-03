'use client';

import Link from 'next/link';
import Logo from './Logo';
import Button from './ui/Button';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Logo className="h-6 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#pricing" className="text-sm text-[#999] hover:text-[#f5f5f5] transition-colors">
            Pricing
          </Link>
          <Link href="/#faq" className="text-sm text-[#999] hover:text-[#f5f5f5] transition-colors">
            FAQ
          </Link>
          <Link href="/order">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#f5f5f5] cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#222] bg-[#0a0a0a] px-6 py-4 space-y-4">
          <Link href="/#pricing" className="block text-sm text-[#999]" onClick={() => setMobileOpen(false)}>
            Pricing
          </Link>
          <Link href="/#faq" className="block text-sm text-[#999]" onClick={() => setMobileOpen(false)}>
            FAQ
          </Link>
          <Link href="/order" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="w-full">Get Started</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
