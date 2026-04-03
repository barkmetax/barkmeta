'use client';

import { useFormContext } from 'react-hook-form';
import { PACKAGES, WRITING, formatPrice, getDeliveryDate, type PackageKey, type WritingKey } from '@/lib/packages';

export default function OrderSidebar() {
  const { watch } = useFormContext();
  const pubKey = watch('publishingPackage') as PackageKey | undefined;
  const writeKey = watch('writingPackage') as WritingKey | undefined;

  const pubPkg = pubKey ? PACKAGES[pubKey] : null;
  const writePkg = writeKey ? WRITING[writeKey] : null;
  const total = (pubPkg?.price || 0) + (writePkg?.price || 0);

  return (
    <div className="bg-[#141414] border border-[#222] rounded-xl p-6 sticky top-24">
      <h3 className="font-bold text-[#f5f5f5] mb-4">Order Summary</h3>

      {pubPkg ? (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#999]">{pubPkg.name}</span>
          <span className="text-[#f5f5f5]">{formatPrice(pubPkg.price)}</span>
        </div>
      ) : (
        <p className="text-sm text-[#666] mb-2">No package selected</p>
      )}

      {writePkg && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#999]">{writePkg.name}</span>
          <span className="text-[#f5f5f5]">{writePkg.price === 0 ? 'Free' : formatPrice(writePkg.price)}</span>
        </div>
      )}

      <hr className="border-[#222] my-4" />

      <div className="flex justify-between font-bold">
        <span className="text-[#f5f5f5]">Total</span>
        <span className="text-[#d4a843]">{total > 0 ? formatPrice(total) : '$0'}</span>
      </div>

      {pubPkg && (
        <p className="text-xs text-[#666] mt-4">
          Estimated delivery: {getDeliveryDate(pubPkg.delivery)}
        </p>
      )}
    </div>
  );
}
