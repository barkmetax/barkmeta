import Hero from '@/components/home/Hero';
import CardShowcase from '@/components/home/CardShowcase';
import HowToPlayTeaser from '@/components/home/HowToPlayTeaser';
import NewsSection from '@/components/home/NewsSection';
import Community from '@/components/home/Community';
import ShopProducts from '@/components/home/ShopProducts';
import Grading from '@/components/home/Grading';
import TournamentCarousel from '@/components/home/TournamentCarousel';
import AppDownload from '@/components/home/AppDownload';

export default function Home() {
  return (
    <>
      <Hero />
      <CardShowcase />
      <HowToPlayTeaser />
      <NewsSection />
      <Community />
      <ShopProducts />
      <Grading />
      <TournamentCarousel />
      <AppDownload />
    </>
  );
}
