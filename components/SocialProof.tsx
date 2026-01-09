"use client";

import { motion } from "framer-motion";
import { Star, Verified, MessageCircle, Users, TrendingUp, Trophy } from "lucide-react";

const stats = [
  { icon: Users, value: "5,000+", label: "Active Members" },
  { icon: Trophy, value: "₦50M+", label: "Won by Members" },
  { icon: TrendingUp, value: "78%", label: "Win Rate" },
  { icon: MessageCircle, value: "2,500+", label: "Telegram Members" },
];

const reviews = [
  { name: "Chinedu O.", rating: 5, text: "Best tips I've ever followed. Made ₦200k in my first month!", avatar: "C", verified: true },
  { name: "Blessing A.", rating: 5, text: "Finally found a legit tipster. The transparency is amazing!", avatar: "B", verified: true },
  { name: "Emmanuel K.", rating: 5, text: "The 10.50 odds tier hits more than I expected. Impressed!", avatar: "E", verified: true },
  { name: "Fatima M.", rating: 5, text: "Simple, clean app. Tips are always on time at 6AM.", avatar: "F", verified: true },
];

export default function SocialProof() {
  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 rounded-xl bg-vault-grey/30"
          >
            <stat.icon className="w-5 h-5 text-gold mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-display font-bold text-white">{stat.value}</p>
            <p className="text-platinum/50 text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Reviews */}
      <div className="grid sm:grid-cols-2 gap-4">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-bold">{review.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium text-sm">{review.name}</span>
                {review.verified && <Verified className="w-4 h-4 text-status-win" />}
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-platinum/70 text-xs leading-relaxed">{review.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}