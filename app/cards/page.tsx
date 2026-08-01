import type { Metadata } from 'next';
import CardGallery from '@/components/CardGallery';

export const metadata: Metadata = {
  title: 'Card Gallery — Doginal Dogs TCG',
  description: 'Browse every card in Volume 01: Legends of the Pack. Filter by faction, rarity, and type.',
};

export default function CardsPage() {
  return <CardGallery />;
}
