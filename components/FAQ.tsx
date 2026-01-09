"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I get started?",
    answer: "Simply create a free account using your email or Google. You'll get instant access to all 18 daily tips during our launch period. No credit card required!",
  },
  {
    question: "When are tips posted?",
    answer: "New tips drop every day at 6AM WAT (West Africa Time). You'll see 9 football and 9 basketball predictions across different odds tiers.",
  },
  {
    question: "What sports do you cover?",
    answer: "We currently cover Football (Soccer) and Basketball. We analyze major leagues worldwide including Premier League, La Liga, NBA, and more.",
  },
  {
    question: "How accurate are the predictions?",
    answer: "Our analysts maintain a verified 78% win rate. All results are tracked transparently so you can see our actual performance before subscribing.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! During our launch period, ALL 18 daily tips are completely FREE. This includes premium high-odds predictions that will be VIP-only later.",
  },
  {
    question: "How do I join the Telegram community?",
    answer: "Click the Telegram button on our website or app. Our community is where we share instant notifications, celebrate wins, and provide support.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="glass-card overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 text-gold" />
              </div>
              <span className="text-white font-medium text-sm sm:text-base">{faq.question}</span>
            </div>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-platinum/50" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                  <div className="pl-11">
                    <p className="text-platinum/70 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}