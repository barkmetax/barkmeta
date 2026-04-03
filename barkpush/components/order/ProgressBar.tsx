'use client';

import { cn } from '@/lib/utils';

const steps = ['Contact', 'Package', 'Writing', 'Details', 'Review'];

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                i <= currentStep
                  ? 'bg-[#d4a843] text-[#0a0a0a]'
                  : 'bg-[#222] text-[#666]',
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                'text-xs mt-1.5 hidden sm:block',
                i <= currentStep ? 'text-[#d4a843]' : 'text-[#666]',
              )}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-px mx-2',
                i < currentStep ? 'bg-[#d4a843]' : 'bg-[#222]',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
