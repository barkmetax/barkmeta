'use client';

import { useFormContext } from 'react-hook-form';
import { PACKAGES, formatPrice, type PackageKey } from '@/lib/packages';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const highlights: Partial<Record<PackageKey, string>> = {
  GROWTH: 'Most Popular',
  ULTIMATE: 'Best Value',
};

interface StepPublishingProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepPublishing({ onNext, onBack }: StepPublishingProps) {
  const { setValue, watch, trigger } = useFormContext();
  const selected = watch('publishingPackage');

  const handleSelect = (key: string) => {
    setValue('publishingPackage', key);
  };

  const handleNext = async () => {
    const valid = await trigger('publishingPackage');
    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#f5f5f5]">Select Publishing Package</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.entries(PACKAGES) as [PackageKey, (typeof PACKAGES)[PackageKey]][]).map(
          ([key, pkg]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              className={cn(
                'relative text-left p-5 rounded-xl border transition-all cursor-pointer',
                selected === key
                  ? 'border-[#d4a843] bg-[#d4a843]/5'
                  : 'border-[#222] bg-[#141414] hover:border-[#333]',
              )}
            >
              {highlights[key] && (
                <Badge className="absolute -top-2.5 right-4">{highlights[key]}</Badge>
              )}
              <h3 className="font-bold text-[#f5f5f5]">{pkg.name}</h3>
              <p className="text-2xl font-extrabold text-[#d4a843] mt-1">{formatPrice(pkg.price)}</p>
              <p className="text-sm text-[#999] mt-2">
                {'outletsLabel' in pkg ? (pkg as { outletsLabel: string }).outletsLabel : pkg.outlets} outlets &middot; {pkg.reach} reach &middot; DA {pkg.maxDA}
              </p>
              <p className="text-xs text-[#666] mt-1">{pkg.delivery}-day delivery</p>
            </button>
          ),
        )}
      </div>
      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={handleNext} disabled={!selected}>Continue</Button>
      </div>
    </div>
  );
}
