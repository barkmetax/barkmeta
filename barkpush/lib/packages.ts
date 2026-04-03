export const PACKAGES = {
  ACCESS: { name: 'Access Package', price: 19500, outlets: 200, reach: '2.2M', maxDA: 69, delivery: 5, bestFor: 'Sensitive Topics', aiPotential: 'No', badge: true },
  GROWTH: { name: 'Growth Package', price: 26500, outlets: 300, reach: '3.6M', maxDA: 71, delivery: 5, bestFor: 'Business Growth', aiPotential: 'Yes', badge: true },
  AUTHORITY: { name: 'Authority Package', price: 59500, outlets: 6, reach: '200M', maxDA: 94, delivery: 7, bestFor: 'SEO & Rankings', aiPotential: 'Yes', badge: true, outletsLabel: '6 (premium only)' },
  ULTIMATE: { name: 'Ultimate Package', price: 79500, outlets: 400, reach: '203M+', maxDA: 94, delivery: 7, bestFor: 'Maximum Exposure', aiPotential: 'Maximum', badge: true, outletsLabel: '400+' },
} as const;

export const WRITING = {
  SELF: { name: 'Write Your Own', price: 0, description: 'Upload .docx or paste text' },
  SHORT: { name: 'Short News Story', price: 4000, description: '350 words, 2 revisions' },
  REGULAR: { name: 'Regular News Story', price: 6000, description: '500 words, 3 revisions' },
  LONG: { name: 'Long News Story', price: 8000, description: '700+ words, unlimited revisions' },
} as const;

export type PackageKey = keyof typeof PACKAGES;
export type WritingKey = keyof typeof WRITING;

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export function getDeliveryDate(deliveryDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + deliveryDays);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
