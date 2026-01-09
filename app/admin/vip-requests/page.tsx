"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, CheckCircle, XCircle, Clock, Loader2, RefreshCw, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase, VipRequest } from "@/lib/supabase";

const statusConfig = {
  pending: { icon: Clock, color: "text-status-pending", bg: "bg-status-pending/10", label: "Pending" },
  approved: { icon: CheckCircle, color: "text-status-win", bg: "bg-status-win/10", label: "Approved" },
  rejected: { icon: XCircle, color: "text-status-loss", bg: "bg-status-loss/10", label: "Rejected" },
};

export default function VIPRequestsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [requests, setRequests] = useState<VipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/dashboard");
      }
    }
  }, [user, authLoading, isAdmin, router]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("vip_requests")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchRequests();
    }
  }, [user, isAdmin]);

  const handleUpdateStatus = async (requestId: string, status: "approved" | "rejected", userId?: string) => {
    setProcessing(requestId);

    try {
      // Update VIP request status
      const { error: requestError } = await supabase
        .from("vip_requests")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (requestError) throw requestError;

      // If approved, update user's account type to VIP
      if (status === "approved" && userId) {
        const vipExpiresAt = new Date();
        vipExpiresAt.setMonth(vipExpiresAt.getMonth() + 1); // 1 month VIP

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            account_type: "vip",
            vip_expires_at: vipExpiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (profileError) throw profileError;
      }

      fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setProcessing(null);
    }
  };

  if (!mounted || authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-vault-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">VIP Requests</h1>
          <p className="text-platinum/60 mt-1">Review and approve VIP upgrade requests</p>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-status-pending/10 text-status-pending text-sm font-medium">
              {pendingCount} Pending
            </span>
          )}
          <motion.button
            onClick={fetchRequests}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vault-grey border border-vault-border hover:border-gold/30 transition-all text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4 text-platinum" />
            <span className="text-platinum hidden sm:inline">Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <Crown className="w-12 h-12 text-platinum/30 mx-auto mb-4" />
            <p className="text-platinum/60">No VIP requests yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-vault-border">
            {requests.map((request, index) => {
              const statusStyle = statusConfig[request.status as keyof typeof statusConfig];
              const StatusIcon = statusStyle.icon;

              return (
                <motion.div
                  key={request.id}
                  className="p-4 sm:p-6 hover:bg-vault-grey/30 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold font-bold">
                          {request.user_name?.charAt(0) || request.user_email?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{request.user_name || "Unknown"}</p>
                        <p className="text-platinum/50 text-sm">{request.user_email}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-gold font-mono font-semibold">₦{request.amount}</span>
                          <span className="text-platinum/40 text-xs">•</span>
                          <span className="text-platinum/40 text-xs">Ref: {request.reference_number || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-platinum/40 text-xs" suppressHydrationWarning>
                        {new Date(request.submitted_at).toLocaleDateString("en-US")}
                      </span>

                      {request.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => handleUpdateStatus(request.id, "approved", request.user_id)}
                            disabled={processing === request.id}
                            className="px-4 py-2 rounded-lg bg-status-win/10 text-status-win text-sm font-medium hover:bg-status-win/20 disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {processing === request.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Approve"
                            )}
                          </motion.button>
                          <motion.button
                            onClick={() => handleUpdateStatus(request.id, "rejected")}
                            disabled={processing === request.id}
                            className="px-4 py-2 rounded-lg bg-status-loss/10 text-status-loss text-sm font-medium hover:bg-status-loss/20 disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Reject
                          </motion.button>
                        </div>
                      ) : (
                        <span className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusStyle.label}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}