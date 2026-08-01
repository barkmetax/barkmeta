import type { Metadata } from 'next';
import StoreLocator from '@/components/StoreLocator';

export const metadata: Metadata = {
  title: 'Store Locator — Doginal Dogs TCG',
  description: 'Find certified Doginal Dogs TCG stores and Bark Arena events near you.',
};

export default function StoreLocatorPage() {
  return <StoreLocator />;
}
