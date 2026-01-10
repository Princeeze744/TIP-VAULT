"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, RefreshCw, Zap, Loader2, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import SportTabs from "@/components/SportTabs";
import TipCard from "@/components/TipCard";
import UserProfileCard from "@/components/UserProfileCard";
import FloatingTelegram from "@/components/FloatingTelegram";
import { useAuth } from "@/context/AuthContext";
import { supabase, Tip, Match, TELEGRAM_LINK, getDateString } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"football" | "basketball">("football");
  const [tips, setTips] = useState<(Tip & { matches: Match[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && mounted) {
      if (!user) {
        router.replace("/login");
      } else if (isAdmin) {
        router.replace("/admin");
      }
    }
  }, [user, authLoading, isAdmin, router, mounted]);

  const fetchTips = useCallback(async (showLoader = false) => {
    if (!user || isAdmin) {
      setLoading(false);
      setInitialLoadDone(true);
      return;
    }
    
    if (showLoader) setLoading(true);
    
    try {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("tips")
        .select("*, matches (*)")
        .eq("sport", activeTab)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTips(data || []);
    } catch (err) {
      console.error("Error fetching tips:", err);
      setTips([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setInitialLoadDone(true);
    }
  }, [user, isAdmin, activeTab, selectedDate]);

  useEffect(() => {
    if (mounted && user && !isAdmin && !authLoading) {
      fetchTips(true);
    }
  }, [mounted, user, isAdmin, authLoading]);

  useEffect(() => {
    if (initialLoadDone && user && !isAdmin) {
      fetchTips(false);
    }
  }, [activeTab, selectedDate]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTips(false);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const isToday = getDateString(selectedDate) === getDateString(new Date());
  const wonTips = tips.filter((t) => t.status === "won").length;
  const pendingTips = tips.filter((t) => t.status === "pending").length;
  const lostTips = tips.filter((t) => t.status === "lost").length;

  if (!mounted || (authLoading && !initialLoadDone)) {
    return (
      <div className="min-h-screen bg-vault-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!user || isAdmin) {
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
    joinedAt: profile?.created_at 
      ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "Jan 2025",
    stats: {
      tipsViewed: tips.length,
      winRate: tips.length > 0 ? Math.round((wonTips / tips.length) * 100) : 0,
    },
  };

  const getTierColor = (oddsTier: string) => {
    if (oddsTier.includes("2.50")) return "bronze";
    if (oddsTier.includes("3.50")) return "silver";
    if (oddsTier.includes("5.50")) return "gold";
    if (oddsTier.includes("10.50")) return "diamond";
    return "crown";
  };

  const TelegramButton = () => (
    <a
      href={TELEGRAM_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-primary w-full inline-flex items-center justify-center gap-2 text-sm"
    >
      <Send className="w-4 h-4" />
      <span>Join Telegram</span>
    </a>
  );

  return (
    <div className="min-h-screen bg-vault-black">
      <DashboardNav user={userData} />

      <main className="pt-20 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {isToday ? "Today's Tips" : "Past Tips"}
                </h1>
                
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={goToPreviousDay}
                    className="p-2 rounded-lg bg-vault-grey/50 border border-vault-border hover:border-gold/30 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-platinum" />
                  </button>
                  
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vault-grey/50 border border-vault-border">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span className="text-platinum text-sm font-medium" suppressHydrationWarning>
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-xs font-medium">
                        Today
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={goToNextDay}
                    disabled={isToday}
                    className="p-2 rounded-lg bg-vault-grey/50 border border-vault-border hover:border-gold/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-platinum" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vault-grey border border-vault-border hover:border-gold/30 transition-all text-sm"
                disabled={isRefreshing || loading}
              >
                <RefreshCw className={`w-4 h-4 text-platinum ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="text-platinum hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-6">
              <SportTabs activeTab={activeTab} onTabChange={setActiveTab} />

              <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-gold/5 border border-gold/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gold" />
                  <span className="text-gold font-semibold">{tips.length} Tips</span>
                </div>
                <div className="h-4 w-px bg-gold/30 hidden sm:block" />
                <div className="flex items-center gap-4 text-sm text-platinum/60">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-status-win" />
                    {wonTips} Won
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-status-pending" />
                    {pendingTips} Pending
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-status-loss" />
                    {lostTips} Lost
                  </span>
                </div>
              </div>

              {loading && !initialLoadDone ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                </div>
              ) : tips.length === 0 ? (
                <div className="text-center py-20 glass-card">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gold/50" />
                  </div>
                  <p className="text-platinum/60 mb-2 text-lg">No {activeTab} tips for this date</p>
                  <p className="text-platinum/40 text-sm">Check back later or try a different date</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {tips.map((tip) => (
                    <TipCard
                      key={tip.id}
                      tier={tip.odds_tier + " Odds"}
                      tierColor={getTierColor(tip.odds_tier)}
                      tierOdds={tip.odds_tier}
                      status={tip.status}
                      ticketNumber={tip.ticket_number}
                      isLocked={false}
                      matches={tip.matches?.map((m) => ({
                        home: m.home_team,
                        away: m.away_team,
                        league: m.league,
                        time: m.match_time,
                        tip: m.tip,
                        odds: Number(m.odds),
                      })) || []}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <UserProfileCard user={userData} />

              <div className="glass-card p-5">
                <h3 className="font-display font-semibold text-white mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-platinum/60 text-sm">Win Rate</span>
                    <span className="text-gold font-mono font-semibold">
                      {tips.length > 0 ? Math.round((wonTips / (wonTips + lostTips || 1)) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-vault-grey rounded-full overflow-hidden">
                    <div
                      className="h-full bg-status-win rounded-full transition-all duration-500"
                      style={{ width: `${tips.length > 0 ? (wonTips / (wonTips + lostTips || 1)) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card-gold p-5 text-center">
                <p className="text-white font-semibold mb-2">Join Our Community</p>
                <p className="text-platinum/60 text-sm mb-4">Get instant notifications</p>
                <TelegramButton />
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingTelegram link={TELEGRAM_LINK} />
    </div>
  );
}