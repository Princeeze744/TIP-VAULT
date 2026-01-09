"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

const results = [
  { match: "Man United vs Arsenal", tip: "Over 1.5", odds: "1.35", status: "won" },
  { match: "Lakers vs Warriors", tip: "Lakers ML", odds: "1.85", status: "won" },
  { match: "Barcelona vs Madrid", tip: "BTTS", odds: "1.65", status: "won" },
  { match: "Chelsea vs Liverpool", tip: "Over 2.5", odds: "1.75", status: "lost" },
  { match: "Celtics vs Heat", tip: "Over 210.5", odds: "1.90", status: "won" },
  { match: "PSG vs Lyon", tip: "Home Win", odds: "1.45", status: "won" },
  { match: "Nets vs Knicks", tip: "Under 220.5", odds: "1.80", status: "pending" },
  { match: "Bayern vs Dortmund", tip: "BTTS", odds: "1.55", status: "won" },
];

const doubledResults = [...results, ...results];

export default function LiveTicker() {
  return (
    <div className="relative overflow-hidden py-4 bg-vault-obsidian/50 border-y border-vault-border">
      {/* Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-vault-obsidian to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-vault-obsidian to-transparent z-10" />

      {/* Live Badge */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-win/10 border border-status-win/30">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-win opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-status-win" />
        </span>
        <span className="text-status-win text-xs font-semibold">LIVE</span>
      </div>

      {/* Scrolling Content */}
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -50 * results.length] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {doubledResults.map((result, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-vault-grey/50 border border-vault-border"
          >
            {result.status === "won" && <CheckCircle className="w-4 h-4 text-status-win flex-shrink-0" />}
            {result.status === "lost" && <XCircle className="w-4 h-4 text-status-loss flex-shrink-0" />}
            {result.status === "pending" && <Clock className="w-4 h-4 text-status-pending flex-shrink-0" />}

            <span className="text-white font-medium text-sm">{result.match}</span>
            <span className="text-vault-muted text-sm">•</span>
            <span className="text-platinum text-sm">{result.tip}</span>
            <span className="text-gold font-mono text-sm">@{result.odds}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}