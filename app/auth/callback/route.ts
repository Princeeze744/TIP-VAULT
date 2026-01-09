import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");
  
  // Get the origin from the request URL (will be production URL on Railway)
  const origin = requestUrl.origin;

  // Handle errors
  if (error) {
    console.error("Auth error:", error, error_description);
    return NextResponse.redirect(`${origin}/login?error=${error}`);
  }

  if (code) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Code exchange error:", exchangeError);
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
      }

      if (data.user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", data.user.id)
          .single();

        if (profile?.account_type === "admin") {
          return NextResponse.redirect(`${origin}/admin`);
        }

        return NextResponse.redirect(`${origin}/dashboard`);
      }
    } catch (err) {
      console.error("Auth callback error:", err);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${origin}/login`);
}