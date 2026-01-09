"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
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
          <h1 className="text-2xl font-display font-bold text-white mb-2">Check Your Email</h1>
          <p className="text-platinum/60 mb-6">
            We&apos;ve sent a password reset link to <span className="text-gold">{email}</span>
          </p>
          <Link href="/login">
            <motion.span
              className="inline-flex items-center gap-2 text-gold hover:text-gold-200"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </motion.span>
          </Link>
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
          <h1 className="text-2xl font-display font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-platinum/60">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              className="flex items-center gap-2 p-4 rounded-xl bg-status-loss/10 border border-status-loss/30 text-status-loss"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-platinum/80 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login">
            <motion.span
              className="inline-flex items-center gap-2 text-gold hover:text-gold-200"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}