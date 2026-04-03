'use client';

import { useFormContext } from 'react-hook-form';
import { WRITING, formatPrice, type WritingKey } from '@/lib/packages';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface StepWritingProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepWriting({ onNext, onBack }: StepWritingProps) {
  const { setValue, watch, trigger } = useFormContext();
  const selected = watch('writingPackage');

  const handleSelect = (key: string) => {
    setValue('writingPackage', key);
  };

  const handleNext = async () => {
    const valid = await trigger('writingPackage');
    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#f5f5f5]">Select Writing Package</h2>
      <div className="space-y-3">
        {(Object.entries(WRITING) as [WritingKey, (typeof WRITING)[WritingKey]][]).map(
          ([key, pkg]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              className={cn(
                'relative w-full text-left p-5 rounded-xl border transition-all cursor-pointer',
                selected === key
                  ? 'border-[#d4a843] bg-[#d4a843]/5'
                  : 'border-[#222] bg-[#141414] hover:border-[#333]',
              )}
            >
              {key === 'REGULAR' && (
                <Badge className="absolute -top-2.5 right-4">Most Popular</Badge>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#f5f5f5]">{pkg.name}</h3>
                  <p className="text-sm text-[#999] mt-1">{pkg.description}</p>
                </div>
                <span className="text-xl font-extrabold text-[#d4a843] shrink-0 ml-4">
                  {pkg.price === 0 ? 'Free' : formatPrice(pkg.price)}
                </span>
              </div>
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
