import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-[#222] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Logo className="h-6 w-auto mb-4" />
            <p className="text-sm text-[#666]">Get your brand published on major news sites.</p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[#f5f5f5]">Navigation</h4>
              <Link href="/#pricing" className="block text-sm text-[#666] hover:text-[#d4a843] transition-colors">Pricing</Link>
              <Link href="/order" className="block text-sm text-[#666] hover:text-[#d4a843] transition-colors">Order</Link>
              <Link href="/#faq" className="block text-sm text-[#666] hover:text-[#d4a843] transition-colors">FAQ</Link>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[#f5f5f5]">Legal</h4>
              <span className="block text-sm text-[#666]">Terms</span>
              <span className="block text-sm text-[#666]">Privacy</span>
              <span className="block text-sm text-[#666]">Refund Policy</span>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[#f5f5f5]">Contact</h4>
              <a href="mailto:hello@barkpush.xyz" className="block text-sm text-[#666] hover:text-[#d4a843] transition-colors">
                hello@barkpush.xyz
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#222] text-center">
          <p className="text-sm text-[#666]">Copyright 2025 BarkPush. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
