"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lock,
  LayoutDashboard,
  PlusCircle,
  Users,
  Crown,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Crown, label: "VIP Requests", href: "/admin/vip-requests" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { signOut, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-vault-obsidian border-r border-vault-border hidden lg:flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-vault-border">
          <Link href="/admin" className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-gold" />
            <span className="font-display font-bold text-xl">
              TIP<span className="text-gold">VAULT</span>
            </span>
          </Link>
          <p className="text-platinum/40 text-xs mt-1">Admin Panel</p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-platinum/60 hover:text-white hover:bg-vault-grey/50"
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Badge */}
        <div className="p-4 border-t border-vault-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-vip/5 border border-vip/20">
            <Shield className="w-5 h-5 text-vip" />
            <div>
              <p className="text-white font-medium text-sm">Admin</p>
              <p className="text-platinum/50 text-xs">Full Access</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-vault-border">
          <motion.button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-status-loss hover:bg-status-loss/10 transition-colors disabled:opacity-50"
            whileHover={{ x: 4 }}
          >
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold font-semibold text-sm">
                {profile?.full_name?.charAt(0) || "A"}
              </span>
            </div>
            <LogOut className={`w-5 h-5 ${loggingOut ? "animate-pulse" : ""}`} />
            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </motion.button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-vault-obsidian/95 backdrop-blur-xl border-b border-vault-border lg:hidden z-40">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold" />
            <span className="font-display font-bold text-lg">
              TIP<span className="text-gold">VAULT</span>
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-vault-grey/50 border border-vault-border"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gold" />
            ) : (
              <Menu className="w-5 h-5 text-platinum" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-vault-black/90 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="absolute top-16 left-0 right-0 bottom-0 p-4 overflow-y-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              {/* Admin Badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-vip/5 border border-vip/20 mb-4">
                <Shield className="w-5 h-5 text-vip" />
                <div>
                  <p className="text-white font-medium">Admin</p>
                  <p className="text-platinum/50 text-xs">Full Access</p>
                </div>
              </div>

              {/* Nav Items */}
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                        <span
                          className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                            isActive
                              ? "bg-gold/10 border border-gold/20 text-gold"
                              : "bg-vault-grey/30 border border-vault-border text-platinum"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Logout */}
              <motion.button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-status-loss/30 text-status-loss hover:bg-status-loss/10 transition-colors disabled:opacity-50"
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