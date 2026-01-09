"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Crown, Calendar, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isAdmin, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
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

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("Please enter your name");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-vault-black">
      <DashboardNav user={userData} />

      <main className="pt-20 pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-platinum/60">Manage your account information</p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            className="glass-card p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-vault-border">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-display font-bold text-2xl">
                  {userData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">{userData.name}</h2>
                <p className="text-platinum/60">{userData.email}</p>
                {profile?.account_type === "vip" ? (
                  <span className="inline-flex items-center gap-1 text-xs text-vip mt-1">
                    <Crown className="w-3 h-3" /> VIP Member
                  </span>
                ) : (
                  <span className="text-xs text-platinum/40 mt-1">Free Member</span>
                )}
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <motion.div
                className="flex items-center gap-2 p-3 rounded-lg bg-status-win/10 border border-status-win/30 text-status-win mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle className="w-4 h-4" />
                <p className="text-sm">Profile updated successfully!</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                className="flex items-center gap-2 p-3 rounded-lg bg-status-loss/10 border border-status-loss/30 text-status-loss mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-platinum/80 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white placeholder:text-platinum/40 focus:border-gold/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-platinum/80 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-vault-grey/30 border border-vault-border text-platinum/50 cursor-not-allowed"
                />
                <p className="text-platinum/40 text-xs mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-platinum/80 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Member Since
                </label>
                <input
                  type="text"
                  value={
                    profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"
                  }
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-vault-grey/30 border border-vault-border text-platinum/50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-6 btn-primary flex items-center justify-center gap-2"
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            className="glass-card p-6 border-status-loss/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-display font-semibold text-status-loss mb-2">
              Danger Zone
            </h3>
            <p className="text-platinum/60 text-sm mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-4 py-2 rounded-lg border border-status-loss/30 text-status-loss hover:bg-status-loss/10 transition-colors text-sm">
              Delete Account
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}