'use client';

import { useFormContext } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'India', 'Brazil', 'Japan', 'South Korea', 'Netherlands', 'Spain', 'Italy',
  'Mexico', 'Singapore', 'United Arab Emirates', 'Other',
].map((c) => ({ value: c, label: c }));

interface StepBrandDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepBrandDetails({ onNext, onBack }: StepBrandDetailsProps) {
  const { register, formState: { errors }, trigger } = useFormContext();

  const handleNext = async () => {
    const valid = await trigger(['brandName', 'brandUrl', 'country', 'description']);
    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#f5f5f5]">Brand Details</h2>

      <Input
        label="Brand Name"
        placeholder="Acme Corp"
        {...register('brandName', { required: 'Brand name is required' })}
        error={errors.brandName?.message as string}
      />
      <Input
        label="Brand Website URL"
        type="url"
        placeholder="https://example.com"
        {...register('brandUrl', { required: 'Website URL is required' })}
        error={errors.brandUrl?.message as string}
      />
      <Select
        label="Country"
        options={countries}
        {...register('country', { required: 'Country is required' })}
        error={errors.country?.message as string}
      />
      <Input
        label="Contact Name (for publication)"
        placeholder="John Smith"
        {...register('contactName')}
      />
      <Input
        label="Contact Email (for publication)"
        type="email"
        placeholder="press@example.com"
        {...register('contactEmail')}
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#f5f5f5]">
          Brief description / topic for the article
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={4}
          placeholder="Tell us about your brand and the story you want to share..."
          className="w-full px-4 py-3 bg-[#141414] border border-[#222] rounded-lg text-[#f5f5f5] placeholder-[#666] focus:outline-none focus:border-[#d4a843] transition-colors resize-none"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message as string}</p>
        )}
      </div>
      <Input
        label="Keywords (optional)"
        placeholder="fintech, startup, funding"
        {...register('keywords')}
      />

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
}
