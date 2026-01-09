"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-vault-black">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link href="/">
          <motion.span
            className="inline-flex items-center gap-2 text-gold hover:text-gold-200 transition-colors mb-8"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.span>
        </Link>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-gold" />
            <h1 className="text-3xl font-display font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-platinum/60">Last updated: January 2025</p>
        </motion.div>

        {/* Content */}
        <motion.div
          className="prose prose-invert max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-6 text-platinum/80">
            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using TipVault, you agree to be bound by these Terms of Service. 
                If you do not agree with any part of these terms, you may not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">2. Service Description</h2>
              <p>
                TipVault provides sports betting predictions and tips for entertainment and informational purposes. 
                We do not guarantee any specific results or winnings. All predictions are based on analysis and 
                should not be considered financial advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use our service</li>
                <li>You are responsible for ensuring online betting is legal in your jurisdiction</li>
                <li>You agree to use our tips responsibly and within your means</li>
                <li>You will not share or redistribute our premium content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">4. Subscription & Payments</h2>
              <p>
                VIP subscriptions are billed according to the plan selected. Payments are non-refundable 
                once processed. You may cancel your subscription at any time, but no refunds will be 
                issued for unused time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">5. Disclaimer</h2>
              <p>
                TipVault is not responsible for any losses incurred from following our predictions. 
                Gambling involves risk, and you should only bet what you can afford to lose. 
                Past performance does not guarantee future results.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">6. Contact</h2>
              <p>
                For any questions regarding these terms, please contact us through our Telegram channel 
                or email us at support@tipvault.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}