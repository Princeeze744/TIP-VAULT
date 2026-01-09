"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ChevronDown, Loader2, User, Check, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { level: 0, text: "", color: "" };
    if (pass.length < 6) return { level: 1, text: "Too short", color: "bg-status-loss" };
    if (pass.length < 8) return { level: 2, text: "Weak", color: "bg-status-pending" };
    if (!/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) return { level: 3, text: "Fair", color: "bg-status-pending" };
    return { level: 4, text: "Strong", color: "bg-status-win" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        if (error.message.includes("already registered")) {
          setError("This email is already registered. Please login instead.");
        } else {
          setError(error.message);
        }
      } else {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Google sign up failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vault-black flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
            </div>
            <span className="font-display font-bold text-xl sm:text-2xl">
              <span className="text-white">TIP</span>
              <span className="text-gold-gradient">VAULT</span>
            </span>
          </Link>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-platinum/60 text-sm sm:text-base">Join thousands of winners today</p>
          </div>

          {/* Card */}
          <div className="glass-card p-5 sm:p-6 lg:p-8">
            {error && (
              <motion.div
                className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-status-loss/10 border border-status-loss/30 text-status-loss text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Benefits Banner */}
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 rounded-xl bg-gold/5 border border-gold/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                <span className="text-gold font-semibold text-sm sm:text-base">Launch Special - FREE Access:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                {["18 daily tips", "All sports", "Win tracking", "Telegram VIP"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-platinum/70">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-status-win flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Button */}
            <motion.button
              onClick={handleGoogleSignup}
              disabled={googleLoading}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-semibold flex items-center justify-center gap-3 transition-colors disabled:opacity-70 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </>
              )}
            </motion.button>

            <p className="text-center text-platinum/40 text-xs sm:text-sm mt-3 mb-5 sm:mb-6">
              Recommended - Quick & secure, no password needed
            </p>

            {/* Divider */}
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="w-full flex items-center justify-center gap-2 text-platinum/60 hover:text-platinum transition-colors py-2"
            >
              <div className="h-px flex-1 bg-vault-border" />
              <span className="text-xs sm:text-sm px-2 flex items-center gap-1">
                Or use email
                <ChevronDown className={`w-4 h-4 transition-transform ${showEmailForm ? "rotate-180" : ""}`} />
              </span>
              <div className="h-px flex-1 bg-vault-border" />
            </button>

            {/* Email Form */}
            {showEmailForm && (
              <motion.form
                onSubmit={handleEmailSignup}
                className="mt-5 sm:mt-6 space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <div>
                  <label className="block text-platinum/60 text-xs sm:text-sm mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-platinum/40" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-vault-grey border border-vault-border focus:border-gold/50 focus:outline-none text-white placeholder-platinum/40 transition-colors text-sm sm:text-base"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-platinum/60 text-xs sm:text-sm mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-platinum/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-vault-grey border border-vault-border focus:border-gold/50 focus:outline-none text-white placeholder-platinum/40 transition-colors text-sm sm:text-base"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-platinum/60 text-xs sm:text-sm mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-platinum/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-xl bg-vault-grey border border-vault-border focus:border-gold/50 focus:outline-none text-white placeholder-platinum/40 transition-colors text-sm sm:text-base"
                      placeholder="Min 6 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-platinum/40 hover:text-platinum transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              level <= passwordStrength.level ? passwordStrength.color : "bg-vault-border"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${
                        passwordStrength.level <= 2 ? "text-status-loss" : 
                        passwordStrength.level === 3 ? "text-status-pending" : "text-status-win"
                      }`}>
                        {passwordStrength.text}
                      </p>
                    </div>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                </motion.button>
              </motion.form>
            )}

            {/* Terms */}
            <p className="text-center text-platinum/40 text-xs mt-4 sm:mt-6">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-gold hover:text-gold-200">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-gold hover:text-gold-200">Privacy Policy</Link>
            </p>
          </div>

          {/* Login Link */}
          <p className="text-center mt-5 sm:mt-6 text-platinum/60 text-sm sm:text-base">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:text-gold-200 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}