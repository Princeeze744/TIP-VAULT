"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Lock,
  LayoutDashboard,
  Trophy,
  User,
  Crown,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DashboardNavProps {
  user?: {
    name: string;
    email: string;
    isVip: boolean;
  };
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const { signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Trophy, label: "Results", href: "/dashboard/results" },
    { icon: Crown, label: "VIP", href: "/dashboard/vip" },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-vault-black/90 backdrop-blur-xl border-b border-vault-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-gold" />
              <span className="font-display font-bold text-xl">
                TIP<span className="text-gold-gradient">VAULT</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href}>
                  <motion.span
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer
                      ${item.active 
                        ? "bg-gold/10 text-gold" 
                        : "text-platinum/60 hover:text-white hover:bg-vault-grey/50"
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </motion.span>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <motion.button
                className="relative p-2 rounded-lg hover:bg-vault-grey/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-platinum/60" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
              </motion.button>

              {/* Profile Dropdown - Desktop */}
              <div className="hidden md:block relative">
                <motion.button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-vault-grey/50 transition-colors"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold font-semibold text-sm">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
                    <p className="text-xs text-platinum/50">
                      {user?.isVip ? "⭐ VIP Member" : "Free Member"}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-platinum/50 transition-transform ${profileDropdown ? "rotate-180" : ""}`} />
                </motion.button>

                <AnimatePresence>
                  {profileDropdown && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileDropdown(false)}
                      />
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-56 bg-vault-obsidian border border-vault-border rounded-xl shadow-xl overflow-hidden z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Link href="/dashboard/profile" onClick={() => setProfileDropdown(false)}>
                          <span className="flex items-center gap-3 px-4 py-3 hover:bg-vault-grey/50 transition-colors cursor-pointer">
                            <User className="w-4 h-4 text-platinum/60" />
                            <span className="text-sm text-platinum">Profile Settings</span>
                          </span>
                        </Link>
                        {!user?.isVip && (
                          <Link href="/dashboard/vip" onClick={() => setProfileDropdown(false)}>
                            <span className="flex items-center gap-3 px-4 py-3 hover:bg-vault-grey/50 transition-colors cursor-pointer">
                              <Crown className="w-4 h-4 text-gold" />
                              <span className="text-sm text-gold">Upgrade to VIP</span>
                            </span>
                          </Link>
                        )}
                        <div className="border-t border-vault-border" />
                        <button 
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-status-loss/10 transition-colors disabled:opacity-50"
                        >
                          <LogOut className={`w-4 h-4 text-status-loss ${loggingOut ? "animate-pulse" : ""}`} />
                          <span className="text-sm text-status-loss">
                            {loggingOut ? "Logging out..." : "Logout"}
                          </span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden p-2 rounded-lg bg-vault-grey/50 border border-vault-border"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gold" />
                ) : (
                  <Menu className="w-5 h-5 text-platinum" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-vault-black/90 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="absolute top-16 left-0 right-0 bottom-0 p-4 overflow-y-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              {/* User Info */}
              <div className="glass-card-gold p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold font-bold text-lg">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user?.name || "User"}</p>
                    <p className="text-sm text-platinum/50">{user?.email || "user@example.com"}</p>
                    {user?.isVip ? (
                      <span className="inline-flex items-center gap-1 text-xs text-gold">
                        <Crown className="w-3 h-3" /> VIP Member
                      </span>
                    ) : (
                      <span className="text-xs text-platinum/50">Free Member</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Nav Items */}
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <span className={`
                        flex items-center gap-3 px-4 py-4 rounded-xl transition-all cursor-pointer
                        ${item.active 
                          ? "bg-gold/10 border border-gold/20 text-gold" 
                          : "bg-vault-grey/30 border border-vault-border text-platinum hover:border-gold/20"
                        }
                      `}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Upgrade CTA */}
              {!user?.isVip && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link href="/dashboard/vip" onClick={() => setMobileMenuOpen(false)}>
                    <span className="btn-primary w-full flex items-center justify-center gap-2">
                      <Crown className="w-5 h-5" />
                      Upgrade to VIP
                    </span>
                  </Link>
                </motion.div>
              )}

              {/* Logout */}
              <motion.button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-status-loss/30 text-status-loss hover:bg-status-loss/10 transition-colors disabled:opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <LogOut className={`w-5 h-5 ${loggingOut ? "animate-pulse" : ""}`} />
                {loggingOut ? "Logging out..." : "Logout"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}