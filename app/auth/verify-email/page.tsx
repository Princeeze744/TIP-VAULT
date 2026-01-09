"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!email) {
      setError("No email address found. Please try signing up again.");
      return;
    }

    setResending(true);
    setError("");

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setResent(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-vault-black flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Icon */}
        <motion.div
          className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <Mail className="w-10 h-10 text-gold" />
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
          Check Your Email
        </h1>

        {/* Description */}
        <p className="text-platinum/60 mb-2">
          We&apos;ve sent a verification link to:
        </p>
        <p className="text-gold font-medium mb-6">
          {email || "your email address"}
        </p>
        <p className="text-platinum/60 mb-8">
          Click the link in the email to verify your account and start winning!
        </p>

        {/* Success message */}
        {resent && (
          <motion.div
            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-status-win/10 border border-status-win/30 text-status-win mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm">Verification email resent successfully!</p>
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <motion.div
            className="p-4 rounded-xl bg-status-loss/10 border border-status-loss/30 text-status-loss mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Info Box */}
        <div className="bg-vault-obsidian/50 border border-vault-border rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-platinum/80 mb-2">
            <strong className="text-white">Didn&apos;t receive the email?</strong>
          </p>
          <ul className="text-sm text-platinum/60 space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure you entered the correct email</li>
            <li>• Wait a few minutes and try again</li>
          </ul>
        </div>

        {/* Resend Button */}
        <motion.button
          onClick={handleResend}
          disabled={resending || !email}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-vault-border text-platinum hover:border-gold/30 hover:text-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          whileHover={{ scale: resending ? 1 : 1.02 }}
          whileTap={{ scale: resending ? 1 : 0.98 }}
        >
          {resending ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Resend Verification Email
            </>
          )}
        </motion.button>

        {/* Back to Login */}
        <Link href="/login">
          <motion.span
            className="inline-flex items-center gap-2 text-gold hover:text-gold-200 transition-colors"
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-vault-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}