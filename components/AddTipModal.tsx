"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Loader2, CheckCircle } from "lucide-react";
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

const emptyMatch: MatchInput = { home: "", away: "", league: "", time: "", tip: "", odds: "1.5" };

export default function AddTipModal({ isOpen, onClose, onSubmit, editData }: AddTipModalProps) {
  const [sport, setSport] = useState("football");
  const [oddsTier, setOddsTier] = useState("2.50");
  const [ticketNumber, setTicketNumber] = useState("1");
  const [matches, setMatches] = useState<MatchInput[]>([{ ...emptyMatch }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Prevent double submission
  const isSubmitting = useRef(false);

  // Reset form when modal opens/closes or editData changes
  useEffect(() => {
    if (!isOpen) {
      isSubmitting.current = false;
      setLoading(false);
      setError("");
      return;
    }
    
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
        })) || [{ ...emptyMatch }]
      );
    } else {
      setSport("football");
      setOddsTier("2.50");
      setTicketNumber("1");
      setMatches([{ ...emptyMatch }]);
    }
    setError("");
  }, [editData, isOpen]);

  const addMatch = () => {
    setMatches([...matches, { ...emptyMatch }]);
  };

  const removeMatch = (index: number) => {
    if (matches.length > 1) {
      setMatches(matches.filter((_, i) => i !== index));
    }
  };

  const updateMatch = (index: number, field: keyof MatchInput, value: string) => {
    const updated = [...matches];
    updated[index] = { ...updated[index], [field]: value };
    setMatches(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting.current || loading) {
      return;
    }
    
    isSubmitting.current = true;
    setLoading(true);
    setError("");

    const tipData = {
      sport,
      oddsTier,
      ticketNumber: parseInt(ticketNumber),
      matches: matches.filter(m => m.home && m.away && m.tip),
      totalOdds: oddsTier === "20+" ? "20" : oddsTier,
      status: "pending",
    };

    try {
      await onSubmit(tipData);
      // Close immediately on success
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save. Please try again.");
      isSubmitting.current = false;
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-vault-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-vault-obsidian border border-vault-border rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-vault-obsidian border-b border-vault-border p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-display font-bold text-white">
            {editData ? "Edit Tip" : "Add New Tip"}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-vault-grey/50 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-platinum/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-status-loss/10 border border-status-loss/30 text-status-loss text-sm">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-platinum/80 mb-2">Sport</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white focus:border-gold/50 focus:outline-none transition-colors disabled:opacity-50"
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
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white focus:border-gold/50 focus:outline-none transition-colors disabled:opacity-50"
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
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white focus:border-gold/50 focus:outline-none transition-colors disabled:opacity-50"
              >
                <option value="1">Ticket 1</option>
                <option value="2">Ticket 2</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gold/5 border border-gold/20">
            <p className="text-gold text-sm">
              <strong>Tip:</strong> Total odds shown to users will be <strong>{oddsTier}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-platinum/80">
                Matches ({matches.length})
              </label>
              <button
                type="button"
                onClick={addMatch}
                disabled={loading}
                className="flex items-center gap-1 text-sm text-gold hover:text-gold-200 transition-colors disabled:opacity-50"
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
                      disabled={loading}
                      className="p-1 rounded hover:bg-status-loss/10 transition-colors disabled:opacity-50"
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
                    disabled={loading}
                    className="px-3 py-2 rounded-lg bg-vault-obsidian border border-vault-border text-white text-sm focus:border-gold/50 focus:outline-none disabled:opacity-50"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Away Team"
                    value={match.away}
                    onChange={(e) => updateMatch(index, "away", e.target.value)}
                    disabled={loading}
                    className="px-3 py-2 rounded-lg bg-vault-obsidian border border-vault-border text-white text-sm focus:border-gold/50 focus:outline-none disabled:opacity-50"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="League"
                    value={match.league}
                    onChange={(e) => updateMatch(index, "league", e.target.value)}
                    disabled={loading}
                    className="px-3 py-2 rounded-lg bg-vault-obsidian border border-vault-border text-white text-sm focus:border-gold/50 focus:outline-none disabled:opacity-50"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g., 15:00)"
                    value={match.time}
                    onChange={(e) => updateMatch(index, "time", e.target.value)}
                    disabled={loading}
                    className="px-3 py-2 rounded-lg bg-vault-obsidian border border-vault-border text-white text-sm focus:border-gold/50 focus:outline-none disabled:opacity-50"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Tip (e.g., Over 1.5 Goals, BTTS, Home Win)"
                  value={match.tip}
                  onChange={(e) => updateMatch(index, "tip", e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 rounded-lg bg-vault-obsidian border border-vault-border text-white text-sm focus:border-gold/50 focus:outline-none disabled:opacity-50"
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {editData ? "Saving..." : "Publishing..."}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {editData ? "Save Changes" : "Publish Tip"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}