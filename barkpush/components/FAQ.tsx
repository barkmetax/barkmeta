'use client';

import { motion } from 'framer-motion';
import { AccordionItem } from './ui/Accordion';

const faqs = [
  {
    question: 'How long does the service take?',
    answer:
      'Most packages are delivered within 5-7 business days. You will receive a full report with live links once all placements are confirmed.',
  },
  {
    question: 'Will I rank on Google?',
    answer:
      'Our articles consistently appear on Google\'s first page for branded searches. The high domain authority of our publishing partners gives your content a strong SEO advantage.',
  },
  {
    question: 'What topics are accepted?',
    answer:
      'We accept most business, technology, finance, health, lifestyle, and entertainment topics. Restricted topics include illegal activities, adult content, and gambling. Contact us if you are unsure.',
  },
  {
    question: 'Do you use AI to write articles?',
    answer:
      'Our writing team crafts each article manually. We use AI tools for research and optimization, but every piece is human-written and reviewed before submission.',
  },
  {
    question: 'Will links be do-follow?',
    answer:
      'Link attributes vary by outlet. Premium packages (Authority and Ultimate) include outlets that provide do-follow backlinks with DA 90+. All packages include a mix of link types.',
  },
  {
    question: 'How long do publications stay live?',
    answer:
      'Publications are permanent. Once your article is published on a news outlet, it stays live indefinitely. We guarantee a minimum of 12 months.',
  },
  {
    question: 'Can I review before publishing?',
    answer:
      'Yes. If you select a writing package, you will receive the draft for review and can request revisions before we distribute. If you write your own, we publish as-is after a basic quality check.',
  },
  {
    question: 'What is your money-back guarantee?',
    answer:
      'If we are unable to publish your story on the promised number of outlets, we will issue a full refund. No questions asked.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-center text-[#f5f5f5] mb-16"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
