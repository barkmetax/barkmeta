import Link from 'next/link';
import Button from '@/components/ui/Button';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#d4a843]/10 mb-8">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#f5f5f5] mb-4">
          Order Confirmed!
        </h1>

        <p className="text-[#999] mb-6 leading-relaxed">
          Thank you for your order. We&apos;ll email you with updates on your order status and delivery timeline.
        </p>

        {session_id && (
          <div className="bg-[#141414] border border-[#222] rounded-xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#999]">Session ID</span>
              <span className="text-[#f5f5f5] font-mono text-xs">{session_id.slice(0, 20)}...</span>
            </div>
            <p className="text-xs text-[#666]">
              Save this for your records. You will receive a confirmation email shortly.
            </p>
          </div>
        )}

        <Link href="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
