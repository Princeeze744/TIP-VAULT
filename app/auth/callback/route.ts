import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", data.user.id)
        .single();

      if (profile?.account_type === "admin") {
        return NextResponse.redirect(new URL("/admin", origin));
      }

      return NextResponse.redirect(new URL("/dashboard", origin));
    }
  }

  // If there's an error, redirect to login
  return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
}