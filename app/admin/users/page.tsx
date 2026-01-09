"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Crown, Search, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase, Profile } from "@/lib/supabase";

export default function UsersPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = users.length;
  const vipUsers = users.filter((u) => u.account_type === "vip").length;
  const freeUsers = users.filter((u) => u.account_type === "free").length;

  if (!mounted || authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-vault-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Users</h1>
          <p className="text-platinum/60 mt-1">Manage all registered users</p>
        </div>

        <motion.button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vault-grey border border-vault-border hover:border-gold/30 transition-all text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className="w-4 h-4 text-platinum" />
          <span className="text-platinum">Refresh</span>
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-white">{totalUsers}</p>
          <p className="text-platinum/60 text-sm">Total Users</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-vip">{vipUsers}</p>
          <p className="text-platinum/60 text-sm">VIP Members</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-platinum">{freeUsers}</p>
          <p className="text-platinum/60 text-sm">Free Users</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-vault-grey/50 border border-vault-border text-white placeholder:text-platinum/40 focus:border-gold/50 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* Users List */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-platinum/30 mx-auto mb-4" />
            <p className="text-platinum/60">No users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-vault-border">
            {filteredUsers.map((userProfile, index) => (
              <motion.div
                key={userProfile.id}
                className="p-4 sm:p-5 hover:bg-vault-grey/30 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-gold font-semibold">
                        {userProfile.full_name?.charAt(0) || userProfile.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{userProfile.full_name || "No name"}</p>
                      <p className="text-platinum/50 text-sm">{userProfile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-platinum/40 text-xs hidden sm:block" suppressHydrationWarning>
                      Joined {new Date(userProfile.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    {userProfile.account_type === "vip" ? (
                      <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-vip/10 text-vip">
                        <Crown className="w-3 h-3" />
                        VIP
                      </span>
                    ) : userProfile.account_type === "admin" ? (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gold/10 text-gold">
                        Admin
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-vault-grey text-platinum/60">
                        Free
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}