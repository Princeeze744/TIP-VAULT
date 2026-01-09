import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");
  
  const origin = requestUrl.origin;
  
  console.log("=== AUTH CALLBACK DEBUG ===");
  console.log("Full URL:", requestUrl.href);
  console.log("Origin:", origin);
  console.log("Code present:", !!code);
  console.log("Error:", error);
  
  if (error) {
    console.error("Auth error:", error, error_description);
    return NextResponse.redirect(`${origin}/login?error=${error}`);
  }
  
  if (code) {
    console.log("Processing code...");
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      console.log("Exchanging code for session...");
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error("Code exchange error:", exchangeError);
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
      }
      
      console.log("Session exchanged successfully, user:", data.user?.email);
      
      if (data.user) {
        console.log("Fetching profile for user:", data.user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", data.user.id)
          .single();
        
        console.log("Profile account_type:", profile?.account_type);
        
        if (profile?.account_type === "admin") {
          console.log("Redirecting to /admin");
          return NextResponse.redirect(`${origin}/admin`);
        }
        
        console.log("Redirecting to /dashboard");
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    } catch (err) {
      console.error("Auth callback error:", err);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
  }
  
  console.log("No code provided, redirecting to login");
  return NextResponse.redirect(`${origin}/login`);
}