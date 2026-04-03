'use client';

import { motion } from 'framer-motion';
import Card from './ui/Card';

const benefits = [
  {
    title: 'Rank on Google & AI',
    description:
      "Our articles rank on Google's first page and get cited by ChatGPT, Perplexity, and Google AI Overviews",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="1.5">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: 'High-Authority Backlinks',
    description:
      'Get DA 90+ backlinks from outlets like Business Insider and AP News to boost your domain',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="1.5">
        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
        <path d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    title: 'Instant Credibility',
    description:
      "Add our 'As Seen On' trust badge to your site. Proven to increase conversions up to 48%",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Drive Qualified Traffic',
    description:
      'Each publication acts as a landing page warming buyers to your brand before they hit your site',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="1.5">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export default function Benefits() {
  return (
    <section className="py-20 md:py-28 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-center text-[#f5f5f5] mb-16"
        >
          Why Press Distribution Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-[#f5f5f5] mb-2">{benefit.title}</h3>
                <p className="text-[#999] leading-relaxed">{benefit.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
