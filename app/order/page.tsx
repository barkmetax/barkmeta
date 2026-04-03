'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import ProgressBar from '@/components/order/ProgressBar';
import StepContact from '@/components/order/StepContact';
import StepPublishing from '@/components/order/StepPublishing';
import StepWriting from '@/components/order/StepWriting';
import StepBrandDetails from '@/components/order/StepBrandDetails';
import StepReview from '@/components/order/StepReview';
import OrderSidebar from '@/components/order/OrderSidebar';
import { Suspense } from 'react';

interface OrderFormData {
  name: string;
  email: string;
  publishingPackage: string;
  writingPackage: string;
  brandName: string;
  brandUrl: string;
  country: string;
  contactName: string;
  contactEmail: string;
  description: string;
  keywords: string;
}

function OrderFormContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);

  const methods = useForm<OrderFormData>({
    defaultValues: {
      name: '',
      email: '',
      publishingPackage: '',
      writingPackage: '',
      brandName: '',
      brandUrl: '',
      country: '',
      contactName: '',
      contactEmail: '',
      description: '',
      keywords: '',
    },
  });

  useEffect(() => {
    const pkg = searchParams.get('package');
    if (pkg) {
      methods.setValue('publishingPackage', pkg.toUpperCase());
    }
  }, [searchParams, methods]);

  return (
    <FormProvider {...methods}>
      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <ProgressBar currentStep={step} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 0 && <StepContact onNext={() => setStep(1)} />}
              {step === 1 && (
                <StepPublishing onNext={() => setStep(2)} onBack={() => setStep(0)} />
              )}
              {step === 2 && (
                <StepWriting onNext={() => setStep(3)} onBack={() => setStep(1)} />
              )}
              {step === 3 && (
                <StepBrandDetails onNext={() => setStep(4)} onBack={() => setStep(2)} />
              )}
              {step === 4 && <StepReview onBack={() => setStep(3)} />}
            </div>
            <div className="hidden lg:block">
              <OrderSidebar />
            </div>
          </div>

          {/* Mobile bottom bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-[#222] p-4">
            <OrderSidebar />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="pt-24 pb-20 min-h-screen flex items-center justify-center text-[#999]">Loading...</div>}>
      <OrderFormContent />
    </Suspense>
  );
}
