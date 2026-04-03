'use client';

import { useFormContext } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface StepContactProps {
  onNext: () => void;
}

export default function StepContact({ onNext }: StepContactProps) {
  const { register, formState: { errors }, trigger } = useFormContext();

  const handleNext = async () => {
    const valid = await trigger(['name', 'email']);
    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#f5f5f5]">Contact Information</h2>
      <Input
        label="Full Name"
        placeholder="John Smith"
        {...register('name', { required: 'Name is required' })}
        error={errors.name?.message as string}
      />
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
        })}
        error={errors.email?.message as string}
      />
      <div className="pt-4">
        <Button onClick={handleNext} className="w-full sm:w-auto">
          Continue
        </Button>
      </div>
    </div>
  );
}
