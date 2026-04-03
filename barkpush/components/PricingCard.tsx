'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/packages';
import Button from './ui/Button';
import Badge from './ui/Badge';

interface PricingCardProps {
  packageKey: string;
  name: string;
  price: number;
  outlets: number;
  reach: string;
  maxDA: number;
  delivery: number;
  bestFor: string;
  aiPotential: string;
  badge: boolean;
  outletsLabel?: string;
  highlight?: 'popular' | 'value';
}

export default function PricingCard({
  packageKey,
  name,
  price,
  outlets,
  reach,
  maxDA,
  delivery,
  bestFor,
  aiPotential,
  outletsLabel,
  highlight,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative bg-[#141414] border rounded-xl p-6 flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20',
        highlight ? 'border-[#d4a843]' : 'border-[#222]',
      )}
    >
      {highlight === 'popular' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge>Most Popular</Badge>
        </div>
      )}
      {highlight === 'value' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge>Best Value</Badge>
        </div>
      )}

      <h3 className="text-lg font-bold text-[#f5f5f5] mb-1">{name}</h3>
      <p className="text-sm text-[#666] mb-4">{bestFor}</p>

      <div className="mb-6">
        <span className="text-4xl font-extrabold text-[#d4a843]">{formatPrice(price)}</span>
        <span className="text-sm text-[#666] ml-1">one-time</span>
      </div>

      <div className="space-y-3 mb-8 flex-1">
        <div className="flex justify-between text-sm">
          <span className="text-[#999]">Outlets</span>
          <span className="text-[#f5f5f5] font-medium">{outletsLabel || (outlets >= 400 ? '400+' : outlets.toString())}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#999]">Monthly Reach</span>
          <span className="text-[#f5f5f5] font-medium">{reach}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#999]">Max DA</span>
          <span className="text-[#f5f5f5] font-medium">{maxDA}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#999]">Delivery</span>
          <span className="text-[#f5f5f5] font-medium">{delivery} days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#999]">AI Potential</span>
          <span className="text-[#f5f5f5] font-medium">{aiPotential}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#999]">Trust Badge</span>
          <span className="text-[#d4a843] font-medium">Included</span>
        </div>
      </div>

      <Link href={`/order?package=${packageKey}`}>
        <Button variant={highlight ? 'primary' : 'secondary'} className="w-full">
          Get Started
        </Button>
      </Link>
    </div>
  );
}
