'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Submit',
    description: 'Tell us about your brand or upload your own article',
  },
  {
    number: '02',
    title: 'Publish',
    description: 'We distribute to 200-400+ verified news outlets within 7 days',
  },
  {
    number: '03',
    title: 'Results',
    description: "Get a full report with live links, SEO stats, and your 'As Seen On' badge",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-center text-[#f5f5f5] mb-16"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#d4a843] text-[#d4a843] text-xl font-bold mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-[#f5f5f5] mb-3">{step.title}</h3>
              <p className="text-[#999] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
