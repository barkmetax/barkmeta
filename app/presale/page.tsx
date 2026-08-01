import type { Metadata } from 'next';
import PresaleClient from '@/components/PresaleClient';

export const metadata: Metadata = {
  title: 'Presale — Doginal Dogs TCG',
  description:
    'Volume 01: Legends of the Pack presale is live. Secure the 10-card Legends Binder Special Collection before it sells out.',
};

export default function PresalePage() {
  return <PresaleClient />;
}
