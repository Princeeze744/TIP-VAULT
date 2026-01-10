"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Tip, Match } from "@/lib/supabase";

interface MatchInput {
  home: string;
  away: string;
  league: string;
  time: string;
  tip: string;
  odds: string;
}

interface AddTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  editData?: (Tip & { matches: Match[] }) | null;
}

const oddsOptions = [
  { value: "2.50", label: "2.50 Odds (Bronze)" },
  { value: "3.50", label: "3.50 Odds (Silver)" },
  { value: "5.50", label: "5.50 Odds (Gold)" },
  { value: "10.50", label: "10.50 Odds (Diamond)" },
  { value: "20+", label: "20+ Odds (Crown)" },
];

const sportOptions = [
  { value: "football", label: "⚽ Football" },
  { value: "basketball", label: "🏀 Basketball" },
];

export default function AddTipModal({ isOpen, onClose, onSubmit, editData }: AddTipModalProps) {
  const [sport, setSport] = useState("football");
  const [oddsTier, setOddsTier] = useState("2.50");
  const [ticketNumber, setTicketNumber] = useState("1");
  const [matches, setMatches] = useState<MatchInput[]>([
    { home: "", away: "", league: "", time: "", tip: "", odds: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setSport(editData.sport);
      setOddsTier(editData.odds_tier);
      setTicketNumber(String(editData.ticket_number));
      setMatches(
        editData.matches?.map((m) => ({
          home: m.home_team,
          away: m.away_team,
          league: m.league,
          time: m.match_time,
          tip: m.tip,
          odds: String(m.odds),
        })) || [{ home: "", away: "", league: "", time: "", tip: "", odds: "" }]
      );
    } else {
      // Reset form for new tip
      setSport("football");
      setOddsTier("2.50");
      setTicketNumber("1");
      setMatches([{ home: "", away: "", league: "", time: "", tip: "", odds: "" }]);
    }
    setError("");
    setSuccess(false);
  }, [editData, isOpen]);

  const addMatch = () => {
    setMatches([...matches, { home: "", away: "", league: "", time: "", tip: "", odds: "" }]);
  };

  const removeMatch = (index: number) => {
    setMatches(matches.filter((_, i) => i !== index));
  };

  const updateMatch = (index: number, field: keyof MatchInput, value: string) => {
    const updated = [...matches];
    updated[index][field] = value;
    setMatches(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const tipData = {
      sport,
      oddsTier,
      ticketNumber: parseInt(ticketNumber),
      matches,
      totalOdds: oddsTier === "20+" ? "20" : oddsTier,
      status: "pending",
    };

    try {
      // FIXED: Add timeout to prevent infinite hang
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out")), 15000)
      );
      
      await Promise.race([onSubmit(tipData), timeoutPromise]);
      
      setSuccess(true);
      setLoading(false);

      // Auto-close after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Reset form
        setMatches([{ home: "", away: "", league: "", time: "", tip: "", odds: "" }]);
        setSport("football");
        setOddsTier("2.50");
        setTicketNumber("1");
      }, 1500);
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err?.message || "Failed to save tip. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-vault-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-vault-obsidian border border-vault-border rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-vault-obsidian border-b border-vault-border p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-display font-bold text-white">
            {editData ? "Edit Tip" : "Add New Tip"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-vault-grey/50 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-platinum/60" />
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-status-win/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-status-win" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">
              {editData ? "Tip Updated!" : "Tip Added!"}
            </h3>
            <p className="text-platinum/60">The tip is now live.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-status-loss/10 border border-status-loss/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-status-loss flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-status-loss text-sm font-medium">Error</p>
                  <p className="text-status-loss/80 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Sport & Odds Tier */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-platinum/80 mb-2">Sport</label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white focus:border-gold/50 focus:outline-none transition-colors"
                  disabled={loading}
                >
                  {sportOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-platinum/80 mb-2">Odds Tier</label>
                <select
                  value={oddsTier}
                  onChange={(e) => setOddsTier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white focus:border-gold/50 focus:outline-none transition-colors"
                  disabled={loading}
                >
                  {oddsOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-platinum/80 mb-2">Ticket #</label>
                <select
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white focus:border-gold/50 focus:outline-none transition-colors"
                  disabled={loading}
                >
                  <option value="1">Ticket 1</option>
                  <option value="2">Ticket 2</option>
                </select>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
              <p className="text-gold text-sm">
                <strong>Note:</strong> The total odds displayed to users will be <strong>{oddsTier}</strong> (based on the tier selected), regardless of individual match odds.
              </p>
            </div>

            {/* Matches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-platinum/80">Matches</label>
                <button
                  type="button"
                  onClick={addMatch}
                  className="flex items-center gap-1 text-sm text-gold hover:text-gold-200 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" />
                  Add Match
                </button>
              </div>

              {matches.map((match, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-vault-grey/30 border border-vault-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-platinum/60">Match {index + 1}</span>
                    {matches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMatch(index)}
                        className="p-1 rounded hover:bg-status-loss/10 transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 text-status-loss" />
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Home Team"
                      value={match.home}
                      onChange={(e) => updateMatch(index, "home", e.target.value)}
                      className="px-3 py-2 rounded-lg bg-vault-obsidian border border-vault-border text-white text-sm focus:border-gold/50 focus:outline-none disabled:opacity-50"
                      disabled={loading}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Away Team"
                      value={match.away}
                      onChange={(e) => updateMatch(index, "away", e.target.value)}
                      className="px-3 py-2 rounded-lg bg-vault-obsidian border border-vault-border text-white text-sm focus:border-gold/50 focus:outline-none disabled:opacity-50"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="League"
                      value={match.league}
                      onChange={(e) => updateMatch(index, "league", e.target.value)}
                      className="px-3 py-2 rounded-lg bg-vault-obsidian border border-vault-border text-white text-sm focus:border-gold/50 focus:outline-none disabled:opacity-50"
                      disabled={loading}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Time (e.g., 15:00)"
                      value={match.time}
                      onChange={(e) => updateMatch(index, "time", e.target.value)}
                      className="px-3 py-2 rounded-lg bg-vault-obsidian border border-vault-border text-white text-sm focus:border-gold/50 focus:outline-none disabled:opacity-50"
                      disabled={loading}
                      required
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Tip (e.g., Over 1.5 Goals, BTTS, Home Win)"
                    value={match.tip}
                    onChange={(e) => updateMatch(index, "tip", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-vault-obsidian border border-vault-border text-white text-sm focus:border-gold/50 focus:outline-none disabled:opacity-50"
                    disabled={loading}
                    required
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {editData ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  {editData ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editData ? "Update Tip" : "Publish Tip"}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}