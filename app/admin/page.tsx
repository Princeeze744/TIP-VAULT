"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, CheckCircle, XCircle, Clock, Loader2, RefreshCw, Trash2, ChevronDown, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminStats from "@/components/AdminStats";
import AddTipModal from "@/components/AddTipModal";
import { useAuth } from "@/context/AuthContext";
import { supabase, Tip, Match } from "@/lib/supabase";

const statusConfig = {
  pending: { icon: Clock, color: "text-status-pending", bg: "bg-status-pending/10", label: "Pending" },
  won: { icon: CheckCircle, color: "text-status-win", bg: "bg-status-win/10", label: "Won" },
  lost: { icon: XCircle, color: "text-status-loss", bg: "bg-status-loss/10", label: "Lost" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<(Tip & { matches: Match[] }) | null>(null);
  const [tips, setTips] = useState<(Tip & { matches: Match[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingTip, setDeletingTip] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth check
  useEffect(() => {
    if (!authLoading && mounted) {
      if (!user) {
        router.replace("/login");
      } else if (profile && profile.account_type !== "admin") {
        router.replace("/dashboard");
      }
    }
  }, [authLoading, mounted, user, profile, router]);

  // Fetch tips - optimized
  const fetchTips = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tips")
        .select(`*, matches (*)`)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setTips(data || []);
    } catch (err) {
      console.error("Error fetching tips:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Load tips when ready
  useEffect(() => {
    if (mounted && user && profile?.account_type === "admin") {
      fetchTips();
    }
  }, [mounted, user, profile, fetchTips]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTips();
  };

  // FIXED: Immediately update UI after adding tip
  const handleAddTip = async (data: any) => {
    try {
      const { data: tipData, error: tipError } = await supabase
        .from("tips")
        .insert({
          sport: data.sport,
          odds_tier: data.oddsTier,
          ticket_number: data.ticketNumber,
          total_odds: parseFloat(data.oddsTier === "20+" ? "20" : data.oddsTier), // Use tier odds
          status: "pending",
          is_vip_only: false,
        })
        .select()
        .single();

      if (tipError) throw tipError;

      const matchesData = data.matches.map((match: any) => ({
        tip_id: tipData.id,
        home_team: match.home,
        away_team: match.away,
        league: match.league,
        match_time: match.time,
        tip: match.tip,
        odds: parseFloat(match.odds) || 1,
      }));

      const { data: insertedMatches, error: matchError } = await supabase
        .from("matches")
        .insert(matchesData)
        .select();

      if (matchError) throw matchError;

      // FIXED: Immediately add to local state (no refetch delay)
      const newTip = { ...tipData, matches: insertedMatches || [] };
      setTips(prev => [newTip, ...prev]);
      
      setIsModalOpen(false);
      setEditingTip(null);
    } catch (err) {
      console.error("Error adding tip:", err);
      alert("Failed to add tip. Please try again.");
    }
  };

  // NEW: Edit tip handler
  const handleEditTip = async (data: any) => {
    if (!editingTip) return;
    
    try {
      // Update tip
      const { error: tipError } = await supabase
        .from("tips")
        .update({
          sport: data.sport,
          odds_tier: data.oddsTier,
          ticket_number: data.ticketNumber,
          total_odds: parseFloat(data.oddsTier === "20+" ? "20" : data.oddsTier),
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingTip.id);

      if (tipError) throw tipError;

      // Delete old matches
      await supabase.from("matches").delete().eq("tip_id", editingTip.id);

      // Insert new matches
      const matchesData = data.matches.map((match: any) => ({
        tip_id: editingTip.id,
        home_team: match.home,
        away_team: match.away,
        league: match.league,
        match_time: match.time,
        tip: match.tip,
        odds: parseFloat(match.odds) || 1,
      }));

      const { data: insertedMatches } = await supabase
        .from("matches")
        .insert(matchesData)
        .select();

      // Update local state immediately
      setTips(prev => prev.map(tip => 
        tip.id === editingTip.id 
          ? { 
              ...tip, 
              sport: data.sport,
              odds_tier: data.oddsTier,
              ticket_number: data.ticketNumber,
              total_odds: parseFloat(data.oddsTier === "20+" ? "20" : data.oddsTier),
              matches: insertedMatches || []
            } 
          : tip
      ));
      
      setIsModalOpen(false);
      setEditingTip(null);
    } catch (err) {
      console.error("Error updating tip:", err);
      alert("Failed to update tip. Please try again.");
    }
  };

  const handleUpdateStatus = async (tipId: string, status: "won" | "lost" | "pending") => {
    setUpdatingStatus(tipId);
    try {
      const { error } = await supabase
        .from("tips")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", tipId);

      if (error) throw error;
      
      // Update local state immediately
      setTips(prev => prev.map(tip => 
        tip.id === tipId ? { ...tip, status } : tip
      ));
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteTip = async (tipId: string) => {
    if (!confirm("Are you sure? This will permanently delete this tip.")) return;
    
    setDeletingTip(tipId);
    try {
      const { error } = await supabase.from("tips").delete().eq("id", tipId);
      if (error) throw error;
      
      // Update local state immediately
      setTips(prev => prev.filter(tip => tip.id !== tipId));
    } catch (err) {
      console.error("Error deleting tip:", err);
    } finally {
      setDeletingTip(null);
    }
  };

  const openEditModal = (tip: Tip & { matches: Match[] }) => {
    setEditingTip(tip);
    setIsModalOpen(true);
  };

  // Loading state
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-vault-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  // Not authorized
  if (!user || profile?.account_type !== "admin") {
    return (
      <div className="min-h-screen bg-vault-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Admin Dashboard</h1>
          <p className="text-platinum/60 mt-1" suppressHydrationWarning>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vault-grey border border-vault-border hover:border-gold/30 transition-all text-sm"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 text-platinum ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="text-platinum hidden sm:inline">Refresh</span>
          </button>
          
          <button
            onClick={() => {
              setEditingTip(null);
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add New Tip</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <AdminStats />
      </div>

      {/* Tips List */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-vault-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold text-white">All Tips</h2>
            <span className="text-xs text-gold bg-gold/10 px-2 py-1 rounded-full">{tips.length} Total</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : tips.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-platinum/60 mb-4">No tips yet.</p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
              Add Your First Tip
            </button>
          </div>
        ) : (
          <div className="divide-y divide-vault-border">
            {tips.map((tip) => {
              const StatusIcon = statusConfig[tip.status as keyof typeof statusConfig]?.icon || Clock;
              const statusStyle = statusConfig[tip.status as keyof typeof statusConfig] || statusConfig.pending;
              const isExpanded = expandedTip === tip.id;

              return (
                <div key={tip.id} className="hover:bg-vault-grey/20 transition-colors">
                  {/* Main Row */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg ${statusStyle.bg} flex items-center justify-center flex-shrink-0`}>
                          <StatusIcon className={`w-5 h-5 ${statusStyle.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-white font-medium">
                              {tip.sport.charAt(0).toUpperCase() + tip.sport.slice(1)}
                            </p>
                            <span className="text-platinum/40">•</span>
                            <span className="text-gold font-mono">{tip.odds_tier} Odds</span>
                            <span className="text-platinum/40 hidden sm:inline">•</span>
                            <span className="text-platinum/60 hidden sm:inline">Ticket #{tip.ticket_number}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-platinum/50 text-xs" suppressHydrationWarning>
                              {new Date(tip.created_at).toLocaleDateString("en-US", { 
                                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" 
                              })}
                            </span>
                            <span className="text-gold font-mono text-sm">
                              {tip.matches?.length || 0} matches
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {updatingStatus === tip.id ? (
                          <Loader2 className="w-5 h-5 text-gold animate-spin" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(tip.id, "won")}
                              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                tip.status === "won" 
                                  ? "bg-status-win text-white" 
                                  : "bg-status-win/10 text-status-win hover:bg-status-win/20"
                              }`}
                              title="Mark as Won"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(tip.id, "lost")}
                              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                tip.status === "lost" 
                                  ? "bg-status-loss text-white" 
                                  : "bg-status-loss/10 text-status-loss hover:bg-status-loss/20"
                              }`}
                              title="Mark as Lost"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(tip.id, "pending")}
                              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                tip.status === "pending" 
                                  ? "bg-status-pending text-white" 
                                  : "bg-status-pending/10 text-status-pending hover:bg-status-pending/20"
                              }`}
                              title="Mark as Pending"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* EDIT BUTTON */}
                        <button
                          onClick={() => openEditModal(tip)}
                          className="p-1.5 sm:p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
                          title="Edit Tip"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteTip(tip.id)}
                          disabled={deletingTip === tip.id}
                          className="p-1.5 sm:p-2 rounded-lg bg-status-loss/10 text-status-loss hover:bg-status-loss/20 transition-colors disabled:opacity-50"
                          title="Delete Tip"
                        >
                          {deletingTip === tip.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                          className="p-1.5 sm:p-2 rounded-lg bg-vault-grey/50 hover:bg-vault-grey transition-colors"
                        >
                          <ChevronDown className={`w-4 h-4 text-platinum transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Matches */}
                  {isExpanded && tip.matches && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                      <div className="bg-vault-grey/30 rounded-xl p-4 space-y-3">
                        <p className="text-platinum/60 text-sm font-medium">Matches ({tip.matches.length})</p>
                        {tip.matches.map((match) => (
                          <div
                            key={match.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-vault-obsidian/50"
                          >
                            <div>
                              <p className="text-white text-sm font-medium">
                                {match.home_team} vs {match.away_team}
                              </p>
                              <p className="text-platinum/50 text-xs">
                                {match.league} • {match.match_time}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-gold text-sm font-medium">{match.tip}</p>
                              <p className="text-platinum/50 text-xs">@ {match.odds}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddTipModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTip(null);
        }}
        onSubmit={editingTip ? handleEditTip : handleAddTip}
        editData={editingTip}
      />
    </div>
  );
}