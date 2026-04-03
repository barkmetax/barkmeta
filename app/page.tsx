import Hero from '@/components/Hero';
import NewsOutlets from '@/components/NewsOutlets';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import Pricing from '@/components/Pricing';
import Results from '@/components/Results';
import FAQ from '@/components/FAQ';

export default function Home() {
  return (
    <>
      <Hero />
      <NewsOutlets />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <Results />
      <FAQ />
    </>
  );
}
