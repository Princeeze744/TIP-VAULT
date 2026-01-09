"use client";

import { motion } from "framer-motion";
import { Crown, TrendingUp, Target, Calendar } from "lucide-react";
import Link from "next/link";

interface UserProfileCardProps {
  user: {
    name: string;
    email: string;
    isVip: boolean;
    vipExpiresAt?: string;
    joinedAt: string;
    stats: {
      tipsViewed: number;
      winRate: number;
    };
  };
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <motion.div
      className="glass-card-gold p-5 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-gold font-bold text-xl">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">{user.name}</h3>
            <p className="text-platinum/50 text-sm">{user.email}</p>
          </div>
        </div>
        {user.isVip ? (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gold/10 border border-gold/30">
            <Crown className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium">VIP</span>
          </div>
        ) : (
          <Link href="/dashboard/vip">
            <motion.span
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-vault-grey border border-vault-border text-platinum/60 text-sm hover:border-gold/30 hover:text-gold transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </motion.span>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-vault-grey/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-platinum/50 text-xs mb-1">
            <Target className="w-3 h-3" />
            Tips Viewed
          </div>
          <p className="text-xl font-mono font-bold text-white">{user.stats.tipsViewed}</p>
        </div>
        <div className="bg-vault-grey/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-platinum/50 text-xs mb-1">
            <TrendingUp className="w-3 h-3" />
            Win Rate
          </div>
          <p className="text-xl font-mono font-bold text-status-win">{user.stats.winRate}%</p>
        </div>
      </div>

      {/* VIP Status or Upgrade CTA */}
      {user.isVip ? (
        <div className="bg-gold/5 border border-gold/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gold text-sm">
            <Calendar className="w-4 h-4" />
            <span>VIP expires: {user.vipExpiresAt}</span>
          </div>
        </div>
      ) : (
        <Link href="/dashboard/vip">
          <motion.div
            className="bg-gradient-to-r from-gold/10 to-vip/10 border border-gold/20 rounded-lg p-4 text-center cursor-pointer hover:border-gold/40 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <p className="text-white font-semibold mb-1">Unlock All 18 Daily Tips</p>
            <p className="text-platinum/60 text-sm">Upgrade to VIP for full access</p>
          </motion.div>
        </Link>
      )}

      {/* Member Since */}
      <p className="text-center text-platinum/40 text-xs mt-4">
        Member since {user.joinedAt}
      </p>
    </motion.div>
  );
}