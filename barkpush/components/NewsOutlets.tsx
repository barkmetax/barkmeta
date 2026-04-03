'use client';

import { motion } from 'framer-motion';

const outlets = [
  'Business Insider',
  'MSN',
  'Yahoo Finance',
  'Digital Journal',
  'Associated Press',
  'NewsBreak',
  'TechBullion',
  'Street Insider',
  'Inter Press Service',
  'openPR',
];

export default function NewsOutlets() {
  return (
    <section className="py-16 border-y border-[#222] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm text-[#666] uppercase tracking-widest mb-8">
          Your story published on
        </p>
        <div className="relative">
          <div className="flex gap-6 animate-scroll">
            {[...outlets, ...outlets].map((name, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % outlets.length) * 0.05 }}
                className="shrink-0 px-5 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-sm text-[#999] font-medium whitespace-nowrap"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
