"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-gold" />
            <h1 className="text-3xl font-display font-bold text-white">Privacy Policy</h1>
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
              <h2 className="text-xl font-display font-semibold text-white mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Name and email address when you create an account</li>
                <li>Payment information when you subscribe to VIP</li>
                <li>Communications you send to us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To process your subscription payments</li>
                <li>To send you tips and notifications</li>
                <li>To respond to your inquiries and support requests</li>
                <li>To improve our service and develop new features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties. 
                Your data is kept confidential and used solely for providing our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the Internet is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-3">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through 
                our Telegram channel or email us at privacy@tipvault.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}