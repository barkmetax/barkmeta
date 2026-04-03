'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '200M+', label: 'Monthly Reach' },
  { value: '500+', label: 'Verified Outlets' },
  { value: '25+', label: 'First Page Rankings Per Order' },
];

export default function Results() {
  return (
    <section id="results" className="py-20 md:py-28 bg-[#0f0f0f]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-[#f5f5f5] mb-4"
        >
          See Exactly What You Get
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#999] max-w-2xl mx-auto mb-16 leading-relaxed"
        >
          Every order includes a detailed report with live links to every placement, traffic stats,
          domain authority metrics, and your customizable &apos;As Seen On&apos; trust badge.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#141414] border border-[#222] rounded-xl p-8"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-[#d4a843] mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-[#999]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
