"use client";

import { Lock, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";

interface Match {
  home: string;
  away: string;
  league: string;
  time: string;
  tip: string;
  odds: number;
}

interface TipCardProps {
  tier: string;
  tierColor: "bronze" | "silver" | "gold" | "diamond" | "crown";
  tierOdds: string; // NEW: Pass the tier odds directly
  matches: Match[];
  status: "pending" | "won" | "lost";
  ticketNumber: number;
  isLocked?: boolean;
}

const tierStyles = {
  bronze: {
    badge: "odds-badge-bronze",
    glow: "hover:shadow-[0_0_30px_rgba(217,119,6,0.15)]",
  },
  silver: {
    badge: "odds-badge-silver",
    glow: "hover:shadow-[0_0_30px_rgba(148,163,184,0.15)]",
  },
  gold: {
    badge: "odds-badge-gold",
    glow: "hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]",
  },
  diamond: {
    badge: "odds-badge-diamond",
    glow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
  },
  crown: {
    badge: "odds-badge-crown",
    glow: "hover:shadow-[0_0_30px_rgba(157,78,221,0.2)]",
  },
};

const statusConfig = {
  pending: {
    icon: Clock,
    text: "Pending",
    color: "text-status-pending",
    bg: "bg-status-pending/10",
    border: "border-status-pending/30",
  },
  won: {
    icon: CheckCircle,
    text: "Won",
    color: "text-status-win",
    bg: "bg-status-win/10",
    border: "border-status-win/30",
  },
  lost: {
    icon: XCircle,
    text: "Lost",
    color: "text-status-loss",
    bg: "bg-status-loss/10",
    border: "border-status-loss/30",
  },
};

export default function TipCard({
  tier,
  tierColor,
  tierOdds,
  matches,
  status,
  ticketNumber,
  isLocked = false,
}: TipCardProps) {
  const StatusIcon = statusConfig[status].icon;
  
  // FIXED: Use tier odds directly instead of calculating from matches
  const displayOdds = tierOdds === "20+" ? "20+" : tierOdds;

  if (isLocked) {
    return (
      <div className="relative glass-card-gold p-5 sm:p-6 overflow-hidden">
        {/* Blur Overlay */}
        <div className="absolute inset-0 bg-vault-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-gold" />
          </div>
          <p className="text-white font-semibold mb-1">VIP Only</p>
          <p className="text-platinum/60 text-sm mb-4">Upgrade to unlock this ticket</p>
          <button className="btn-primary !py-2 !px-4 text-sm">
            Unlock Now
          </button>
        </div>

        {/* Blurred Content Preview */}
        <div className="opacity-30">
          <div className="flex items-center justify-between mb-4">
            <span className={`odds-badge ${tierStyles[tierColor].badge}`}>{tier}</span>
            <span className="text-2xl font-mono font-bold text-gold">{displayOdds}</span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-vault-grey/30 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card-gold p-5 sm:p-6 overflow-hidden transition-all duration-300 ${tierStyles[tierColor].glow}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`odds-badge ${tierStyles[tierColor].badge}`}>{tier}</span>
          <span className="text-platinum/40 text-sm">Ticket #{ticketNumber}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig[status].bg} ${statusConfig[status].border} border`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig[status].color}`} />
          <span className={`text-sm font-medium ${statusConfig[status].color}`}>
            {statusConfig[status].text}
          </span>
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-3 mb-4">
        {matches.map((match, index) => (
          <div
            key={index}
            className="bg-vault-grey/30 rounded-lg p-3 hover:bg-vault-grey/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {match.home} vs {match.away}
                </p>
                <p className="text-platinum/50 text-xs mt-0.5">{match.league}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-platinum/40 text-xs">{match.time}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-gold/10 text-gold text-xs font-medium">
                {match.tip}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - FIXED: Show tier odds, not calculated odds */}
      <div className="flex items-center justify-between pt-4 border-t border-vault-border">
        <div>
          <p className="text-platinum/50 text-xs">Total Odds</p>
          <p className="text-2xl font-mono font-bold text-gold">{displayOdds}</p>
        </div>
        <div className="text-right">
          <p className="text-platinum/50 text-xs">{matches.length} Games</p>
          <p className="text-platinum/60 text-sm">Accumulator</p>
        </div>
      </div>
    </div>
  );
}