"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, Profile } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any; isAdmin?: boolean }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  isVip: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// HARDCODED production URL to fix OAuth redirect
const PRODUCTION_URL = "https://tip-vault-production.up.railway.app";

const getRedirectUrl = () => {
  // Always use environment variable if available
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/login`;
  }
  
  // In production, use production URL
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return `${window.location.origin}/login`;
  }
  
  // For local development
  if (typeof window !== "undefined") {
    return `${window.location.origin}/login`;
  }
  
  // Fallback to production
  return `${PRODUCTION_URL}/login`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error.message);
        return null;
      }

      if (data) {
        setProfile(data as Profile);
        return data as Profile;
      }
      
      return null;
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      return null;
    }
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.log("Auth error, clearing session:", error.message);
          await supabase.auth.signOut();
          if (mounted) {
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        await supabase.auth.signOut();
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth event:", event);

        if (event === "TOKEN_REFRESHED" && !session) {
          console.log("Token refresh failed, clearing session");
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const existingProfile = await fetchProfile(session.user.id);
          
          if (!existingProfile && event === "SIGNED_IN") {
            const { error } = await supabase.from("profiles").insert({
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
              account_type: "free",
            });
            
            if (!error) {
              await fetchProfile(session.user.id);
            } else {
              console.error("Error creating profile:", error);
            }
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = getRedirectUrl();
      console.log("SignUp redirectTo:", redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        return { error };
      }

      if (data?.user?.identities?.length === 0) {
        return { 
          error: { message: "This email is already registered. Please login instead." } 
        };
      }

      if (data?.user && !data.session) {
        return { error: null, needsVerification: true };
      }

      if (data?.session) {
        await fetchProfile(data.user!.id);
        return { error: null, needsVerification: false };
      }

      return { error: null, needsVerification: true };
    } catch (err) {
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        return { error: null, isAdmin: profileData?.account_type === "admin" };
      }

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = getRedirectUrl();
      console.log("Google OAuth redirectTo:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      return { error };
    } catch (err) {
      return { error: err };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : PRODUCTION_URL;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/reset-password`,
      });

      return { error };
    } catch (err) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      router.push("/");
    } catch (err) {
      console.error("Error signing out:", err);
      setUser(null);
      setProfile(null);
      setSession(null);
      router.push("/");
    }
  };

  const isVip = true;
  const isAdmin = profile?.account_type === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        isVip,
        isAdmin,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}