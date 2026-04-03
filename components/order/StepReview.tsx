'use client';

import { useFormContext } from 'react-hook-form';
import { PACKAGES, WRITING, formatPrice, type PackageKey, type WritingKey } from '@/lib/packages';
import Button from '@/components/ui/Button';
import { useState } from 'react';

interface StepReviewProps {
  onBack: () => void;
}

export default function StepReview({ onBack }: StepReviewProps) {
  const { getValues } = useFormContext();
  const [loading, setLoading] = useState(false);
  const values = getValues();

  const pubPkg = PACKAGES[values.publishingPackage as PackageKey];
  const writePkg = WRITING[values.writingPackage as WritingKey];
  const total = pubPkg.price + writePkg.price;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          publishingPackage: values.publishingPackage,
          writingPackage: values.writingPackage,
          brandName: values.brandName,
          brandUrl: values.brandUrl,
          country: values.country,
          contactName: values.contactName,
          contactEmail: values.contactEmail,
          description: values.description,
          keywords: values.keywords,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#f5f5f5]">Review Your Order</h2>

      <div className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-[#999]">Name</span>
          <span className="text-[#f5f5f5]">{values.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#999]">Email</span>
          <span className="text-[#f5f5f5]">{values.email}</span>
        </div>
        <hr className="border-[#222]" />
        <div className="flex justify-between">
          <span className="text-[#999]">Publishing Package</span>
          <span className="text-[#f5f5f5]">{pubPkg.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#999]">Publishing Price</span>
          <span className="text-[#d4a843] font-semibold">{formatPrice(pubPkg.price)}</span>
        </div>
        <hr className="border-[#222]" />
        <div className="flex justify-between">
          <span className="text-[#999]">Writing Package</span>
          <span className="text-[#f5f5f5]">{writePkg.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#999]">Writing Price</span>
          <span className="text-[#d4a843] font-semibold">
            {writePkg.price === 0 ? 'Free' : formatPrice(writePkg.price)}
          </span>
        </div>
        <hr className="border-[#222]" />
        <div className="flex justify-between">
          <span className="text-[#999]">Brand</span>
          <span className="text-[#f5f5f5]">{values.brandName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#999]">Website</span>
          <span className="text-[#f5f5f5]">{values.brandUrl}</span>
        </div>
        <hr className="border-[#222]" />
        <div className="flex justify-between text-lg font-bold">
          <span className="text-[#f5f5f5]">Total</span>
          <span className="text-[#d4a843]">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={handleCheckout} disabled={loading} className="flex-1 sm:flex-none">
          {loading ? 'Redirecting...' : 'Proceed to Payment'}
        </Button>
      </div>
    </div>
  );
}
