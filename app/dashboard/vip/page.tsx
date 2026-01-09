"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Check, Copy, Upload, Loader2, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import FloatingTelegram from "@/components/FloatingTelegram";
import { useAuth } from "@/context/AuthContext";
import { supabase, TELEGRAM_LINK } from "@/lib/supabase";

const plans = [
  {
    id: "weekly",
    name: "Weekly",
    price: "₦1,500",
    priceUSD: "~$1",
    duration: "7 days",
    features: ["All 18 daily tips", "All odds tiers unlocked", "Telegram VIP channel"],
    popular: false,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "₦5,000",
    priceUSD: "~$3",
    duration: "30 days",
    features: ["All 18 daily tips", "All odds tiers unlocked", "Telegram VIP channel", "Priority support"],
    popular: true,
  },
  {
    id: "quarterly",
    name: "3 Months",
    price: "₦12,000",
    priceUSD: "~$8",
    duration: "90 days",
    features: ["All 18 daily tips", "All odds tiers unlocked", "Telegram VIP channel", "Priority support", "Save 20%"],
    popular: false,
  },
];

const bankDetails = {
  bankName: "Opay",
  accountNumber: "1234567890",
  accountName: "TipVault Technologies",
};

export default function VIPPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isAdmin } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [step, setStep] = useState(1);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitProof = async () => {
    if (!referenceNumber.trim()) {
      setError("Please enter your payment reference number");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const plan = plans.find((p) => p.id === selectedPlan);
      
      const { error: insertError } = await supabase.from("vip_requests").insert({
        user_id: user?.id,
        user_email: user?.email,
        user_name: profile?.full_name,
        amount: parseFloat(plan?.price.replace(/[₦,]/g, "") || "0"),
        reference_number: referenceNumber.trim(),
        status: "pending",
      });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Loading state
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-vault-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  const userData = {
    name: profile?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    isVip: true,
  };

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-vault-black">
        <DashboardNav user={userData} />
        <main className="pt-20 pb-24 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-status-win/10 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-status-win" />
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">
              Payment Proof Submitted!
            </h1>
            <p className="text-platinum/60 mb-2">
              We&apos;ll verify your payment within 1-2 hours.
            </p>
            <p className="text-platinum/40 text-sm mb-6">
              You&apos;ll receive a confirmation once your VIP access is activated.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vault-black">
      <DashboardNav user={userData} />

      <main className="pt-20 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vip/10 border border-vip/30 mb-4">
              <Crown className="w-4 h-4 text-vip" />
              <span className="text-vip text-sm font-medium">Upgrade to VIP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
              Unlock All Premium Tips
            </h1>
            <p className="text-platinum/60">
              Get access to our highest-odds predictions
            </p>
          </motion.div>

          {/* Step 1: Select Plan */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {plans.map((plan) => (
                  <motion.button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                      selectedPlan === plan.id
                        ? "border-gold bg-gold/5"
                        : "border-vault-border bg-vault-grey/30 hover:border-gold/30"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold text-vault-black text-xs font-bold rounded-full">
                        POPULAR
                      </span>
                    )}
                    <p className="text-platinum/60 text-sm mb-1">{plan.name}</p>
                    <p className="text-2xl font-display font-bold text-white mb-1">{plan.price}</p>
                    <p className="text-platinum/40 text-xs mb-4">{plan.priceUSD} • {plan.duration}</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-platinum/70">
                          <Check className="w-4 h-4 text-status-win" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full btn-primary flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Continue to Payment
              </button>
            </motion.div>
          )}

          {/* Step 2: Payment Details */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
              <div className="glass-card-gold p-6 mb-6">
                <h3 className="text-lg font-display font-semibold text-white mb-4">Bank Transfer Details</h3>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-vault-grey/50">
                    <p className="text-platinum/60 text-xs">Bank Name</p>
                    <p className="text-white font-medium">{bankDetails.bankName}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-vault-grey/50">
                    <div>
                      <p className="text-platinum/60 text-xs">Account Number</p>
                      <p className="text-white font-mono font-medium">{bankDetails.accountNumber}</p>
                    </div>
                    <button onClick={() => copyToClipboard(bankDetails.accountNumber)} className="p-2 rounded-lg hover:bg-vault-grey">
                      {copied ? <Check className="w-4 h-4 text-status-win" /> : <Copy className="w-4 h-4 text-platinum/60" />}
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-vault-grey/50">
                    <p className="text-platinum/60 text-xs">Account Name</p>
                    <p className="text-white font-medium">{bankDetails.accountName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gold/10 border border-gold/30">
                    <p className="text-gold text-xs">Amount to Pay</p>
                    <p className="text-gold font-display font-bold text-xl">{plans.find((p) => p.id === selectedPlan)?.price}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 btn-secondary">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 btn-primary">I&apos;ve Made Payment</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Submit Proof */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
              <div className="glass-card p-6 mb-6">
                <h3 className="text-lg font-display font-semibold text-white mb-4">Submit Payment Proof</h3>
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-status-loss/10 border border-status-loss/30 text-status-loss mb-4">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-platinum/80 mb-2">Payment Reference Number *</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter your transaction reference"
                    className="w-full px-4 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white placeholder:text-platinum/40 focus:border-gold/50 focus:outline-none"
                  />
                  <p className="text-platinum/40 text-xs mt-1">Find this in your bank app or receipt</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} disabled={uploading} className="flex-1 btn-secondary">Back</button>
                <button onClick={handleSubmitProof} disabled={uploading} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  {uploading ? <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</> : <><Upload className="w-5 h-5" />Submit Proof</>}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <FloatingTelegram link={TELEGRAM_LINK} />
    </div>
  );
}