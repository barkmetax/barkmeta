'use client';

import { motion } from 'framer-motion';
import { PACKAGES } from '@/lib/packages';
import PricingCard from './PricingCard';

const highlights: Record<string, 'popular' | 'value' | undefined> = {
  GROWTH: 'popular',
  ULTIMATE: 'value',
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-center text-[#f5f5f5] mb-4"
        >
          Choose Your Package
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-[#999] mb-16 max-w-xl mx-auto"
        >
          One-time payment. No subscriptions. No hidden fees.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.entries(PACKAGES) as [string, (typeof PACKAGES)[keyof typeof PACKAGES]][]).map(
            ([key, pkg], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PricingCard
                  packageKey={key}
                  name={pkg.name}
                  price={pkg.price}
                  outlets={pkg.outlets}
                  reach={pkg.reach}
                  maxDA={pkg.maxDA}
                  delivery={pkg.delivery}
                  bestFor={pkg.bestFor}
                  aiPotential={pkg.aiPotential}
                  badge={pkg.badge}
                  outletsLabel={'outletsLabel' in pkg ? (pkg as { outletsLabel: string }).outletsLabel : undefined}
                  highlight={highlights[key]}
                />
              </motion.div>
            ),
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#999] mt-12"
        >
          100% Money-Back Guarantee if we can&apos;t publish your story
        </motion.p>
      </div>
    </section>
  );
}
