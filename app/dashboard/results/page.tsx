"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Filter, TrendingUp, CheckCircle, XCircle, Clock, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import SportTabs from "@/components/SportTabs";
import FloatingTelegram from "@/components/FloatingTelegram";
import { useAuth } from "@/context/AuthContext";
import { supabase, Tip, Match, TELEGRAM_LINK } from "@/lib/supabase";

const statusConfig = {
  pending: { icon: Clock, color: "text-status-pending", bg: "bg-status-pending/10", label: "Pending" },
  won: { icon: CheckCircle, color: "text-status-win", bg: "bg-status-win/10", label: "Won" },
  lost: { icon: XCircle, color: "text-status-loss", bg: "bg-status-loss/10", label: "Lost" },
};

export default function ResultsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"football" | "basketball">("football");
  const [statusFilter, setStatusFilter] = useState<"all" | "won" | "lost" | "pending">("all");
  const [tips, setTips] = useState<(Tip & { matches: Match[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (isAdmin) {
        router.push("/admin");
      }
    }
  }, [user, authLoading, isAdmin, router]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("tips")
        .select(`*, matches (*)`)
        .eq("sport", activeTab)
        .order("created_at", { ascending: false })
        .limit(50);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching results:", error);
      } else {
        setTips(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !isAdmin) {
      fetchResults();
    }
  }, [user, activeTab, statusFilter, isAdmin]);

  // Stats
  const totalTips = tips.length;
  const wonTips = tips.filter((t) => t.status === "won").length;
  const lostTips = tips.filter((t) => t.status === "lost").length;
  const winRate = totalTips > 0 ? Math.round((wonTips / (wonTips + lostTips || 1)) * 100) : 0;

  if (!mounted || authLoading || !user || isAdmin) {
    return (
      <div className="min-h-screen bg-vault-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  const userData = {
    name: profile?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    isVip: true,
  };

  const getTierColor = (oddsTier: string) => {
    if (oddsTier.includes("2.50")) return "border-amber-500/30";
    if (oddsTier.includes("3.50")) return "border-slate-400/30";
    if (oddsTier.includes("5.50")) return "border-gold/30";
    if (oddsTier.includes("10.50")) return "border-cyan-400/30";
    return "border-vip/30";
  };

  return (
    <div className="min-h-screen bg-vault-black">
      <DashboardNav user={userData} />

      <main className="pt-20 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
              Results History
            </h1>
            <p className="text-platinum/60">Track our performance and verify our predictions</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-display font-bold text-white">{totalTips}</p>
              <p className="text-platinum/60 text-sm">Total Tips</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-display font-bold text-status-win">{wonTips}</p>
              <p className="text-platinum/60 text-sm">Won</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-display font-bold text-status-loss">{lostTips}</p>
              <p className="text-platinum/60 text-sm">Lost</p>
            </div>
            <div className="glass-card-gold p-4 text-center">
              <p className="text-2xl font-display font-bold text-gold">{winRate}%</p>
              <p className="text-platinum/60 text-sm">Win Rate</p>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SportTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="flex gap-2">
              {(["all", "won", "lost", "pending"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? "bg-gold/10 text-gold border border-gold/30"
                      : "bg-vault-grey/50 text-platinum/60 border border-vault-border hover:border-gold/20"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : tips.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-platinum/60 mb-2">No results found.</p>
              <p className="text-platinum/40 text-sm">Try changing your filters.</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {tips.map((tip, index) => {
                const StatusIcon = statusConfig[tip.status as keyof typeof statusConfig].icon;
                const statusStyle = statusConfig[tip.status as keyof typeof statusConfig];

                return (
                  <motion.div
                    key={tip.id}
                    className={`glass-card p-4 sm:p-5 border-l-4 ${getTierColor(tip.odds_tier)}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${statusStyle.bg} flex items-center justify-center`}>
                          <StatusIcon className={`w-5 h-5 ${statusStyle.color}`} />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {tip.odds_tier} Odds • Ticket #{tip.ticket_number}
                          </p>
                          <p className="text-platinum/50 text-xs" suppressHydrationWarning>
                            {new Date(tip.created_at).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gold font-mono font-bold">{tip.total_odds}x</p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle.bg} ${statusStyle.color}`}>
                          {statusStyle.label}
                        </span>
                      </div>
                    </div>

                    {/* Matches */}
                    <div className="space-y-2">
                      {tip.matches?.map((match, mIndex) => (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-vault-grey/30"
                        >
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              {match.home_team} vs {match.away_team}
                            </p>
                            <p className="text-platinum/50 text-xs">{match.league}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gold text-sm font-medium">{match.tip}</p>
                            <p className="text-platinum/50 text-xs">@ {match.odds}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </main>

      <FloatingTelegram link={TELEGRAM_LINK} />
    </div>
  );
}