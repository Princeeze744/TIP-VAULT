"use client";

import { motion } from "framer-motion";
import { Users, Trophy, TrendingUp, Crown, DollarSign, Target } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, change, positive, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className="glass-card-gold p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-gold" />
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            positive ? "bg-status-win/10 text-status-win" : "bg-status-loss/10 text-status-loss"
          }`}>
            {positive ? "↑" : "↓"} {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl sm:text-3xl font-display font-bold text-white">{value}</p>
        <p className="text-platinum/60 text-sm mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

export default function AdminStats() {
  const stats = [
    { icon: Users, label: "Total Users", value: "5,234", change: "12%", positive: true },
    { icon: Crown, label: "VIP Members", value: "847", change: "8%", positive: true },
    { icon: Trophy, label: "Tips Today", value: "18", change: "", positive: true },
    { icon: Target, label: "Win Rate", value: "78%", change: "3%", positive: true },
    { icon: TrendingUp, label: "Tips Won Today", value: "14/18", change: "", positive: true },
    { icon: DollarSign, label: "Revenue (MTD)", value: "₦2.4M", change: "15%", positive: true },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
}