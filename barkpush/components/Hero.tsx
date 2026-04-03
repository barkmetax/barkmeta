'use client';

import Button from './ui/Button';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#f5f5f5] tracking-tight leading-tight"
        >
          Get Published on{' '}
          <span className="text-[#d4a843]">400+ News Sites</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg md:text-xl text-[#999] max-w-2xl mx-auto leading-relaxed"
        >
          We write and distribute your story on major news outlets. Build trust,
          rank on Google, and dominate AI search results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#pricing">
            <Button size="lg">See Packages</Button>
          </a>
          <a href="#results">
            <Button variant="secondary" size="lg">View Sample Results</Button>
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-sm text-[#666]"
        >
          Starting at $195 &middot; No monthly fees &middot; 200M+ reader reach
        </motion.p>
      </div>
    </section>
  );
}
