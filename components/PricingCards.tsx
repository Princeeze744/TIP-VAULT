"use client";

import { motion } from "framer-motion";
import { Check, Crown, Zap, Star, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "Launch Special",
    description: "Full access during our launch period",
    features: [
      "All 18 daily tips",
      "Football & Basketball",
      "All odds tiers (2.50 - 20+)",
      "Results tracking",
      "Telegram community",
    ],
    cta: "Get Started Free",
    href: "/signup",
    popular: true,
    badge: "LIMITED TIME",
  },
  {
    name: "VIP Weekly",
    price: "₦1,500",
    period: "/week",
    description: "For casual bettors",
    features: [
      "All 18 daily tips",
      "Premium predictions",
      "VIP Telegram channel",
      "Priority support",
      "7 days access",
    ],
    cta: "Coming Soon",
    href: "#",
    disabled: true,
  },
  {
    name: "VIP Monthly",
    price: "₦5,000",
    period: "/month",
    description: "Best value for serious winners",
    features: [
      "All 18 daily tips",
      "Premium predictions",
      "VIP Telegram channel",
      "Priority support",
      "30 days access",
      "Save 17%",
    ],
    cta: "Coming Soon",
    href: "#",
    disabled: true,
    badge: "BEST VALUE",
  },
];

export default function PricingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 }}
          className="relative"
        >
          {plan.badge && (
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold z-10 ${
              plan.popular ? "bg-gold text-vault-black" : "bg-vip text-white"
            }`}>
              {plan.badge}
            </div>
          )}
          
          <div className={`glass-card p-6 h-full flex flex-col ${
            plan.popular ? "border-gold/30 bg-gold/5" : ""
          } ${plan.disabled ? "opacity-60" : ""}`}>
            {/* Header */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                plan.popular ? "bg-gold/20" : "bg-vault-grey"
              }`}>
                {plan.popular ? (
                  <Sparkles className="w-6 h-6 text-gold" />
                ) : plan.name.includes("Monthly") ? (
                  <Crown className="w-6 h-6 text-vip" />
                ) : (
                  <Zap className="w-6 h-6 text-platinum" />
                )}
              </div>
              <h3 className="text-xl font-display font-bold text-white">{plan.name}</h3>
              <p className="text-platinum/50 text-sm mt-1">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
              <span className="text-platinum/50 text-sm">{plan.period}</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    plan.popular ? "bg-gold/20" : "bg-status-win/20"
                  }`}>
                    <Check className={`w-3 h-3 ${plan.popular ? "text-gold" : "text-status-win"}`} />
                  </div>
                  <span className="text-platinum/70 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {plan.disabled ? (
              <button disabled className="w-full py-3 rounded-xl bg-vault-grey text-platinum/50 font-medium cursor-not-allowed">
                {plan.cta}
              </button>
            ) : (
              <Link href={plan.href}>
                <motion.span
                  className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular 
                      ? "bg-gold text-vault-black hover:bg-gold-200" 
                      : "bg-vault-grey text-white hover:bg-vault-grey/80"
                  } transition-colors`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                </motion.span>
              </Link>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}