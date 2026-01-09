import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  account_type: "free" | "vip" | "admin";
  vip_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tip {
  id: string;
  sport: "football" | "basketball";
  odds_tier: string;
  ticket_number: number;
  total_odds: number;
  status: "pending" | "won" | "lost";
  is_vip_only: boolean;
  created_at: string;
  updated_at: string;
  matches?: Match[];
}

export interface Match {
  id: string;
  tip_id: string;
  home_team: string;
  away_team: string;
  league: string;
  match_time: string;
  tip: string;
  odds: number;
  created_at: string;
}

export interface VipRequest {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  amount: number;
  reference_number: string | null;
  screenshot_url: string | null;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at: string | null;
}

// Telegram Channel Link
export const TELEGRAM_LINK = "https://t.me/TIPVAULT1";

// Helper to format date for display
export function formatDisplayDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Helper to get date string for filtering (YYYY-MM-DD)
export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}