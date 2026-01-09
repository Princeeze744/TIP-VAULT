"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function ResetPasswordContent() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-vault-black flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-status-win/10 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <CheckCircle className="w-10 h-10 text-status-win" />
          </motion.div>
          <h1 className="text-2xl font-display font-bold text-white mb-2">Password Reset!</h1>
          <p className="text-platinum/60 mb-6">
            Your password has been updated successfully. Redirecting to login...
          </p>
          <Loader2 className="w-6 h-6 text-gold animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vault-black flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-2">Reset Password</h1>
          <p className="text-platinum/60">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              className="flex items-center gap-2 p-4 rounded-xl bg-status-loss/10 border border-status-loss/30 text-status-loss"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-platinum/80 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/40" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white placeholder:text-platinum/40 focus:border-gold/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-platinum/40 hover:text-platinum"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-platinum/80 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/40" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white placeholder:text-platinum/40 focus:border-gold/50 focus:outline-none"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-vault-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}