import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CancelPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-8">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#f5f5f5] mb-4">
          Payment Cancelled
        </h1>

        <p className="text-[#999] mb-8 leading-relaxed">
          Your order has not been placed. No charges have been made to your account.
        </p>

        <Link href="/order">
          <Button>Try Again</Button>
        </Link>
      </div>
    </div>
  );
}
