"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Lock,
  LayoutDashboard,
  PlusCircle,
  Users,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: PlusCircle, label: "Add Tips", href: "/admin/add-tips" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Trophy, label: "VIP Requests", href: "/admin/vip-requests" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-vault-obsidian border-r border-vault-border z-50">
        {/* Logo */}
        <div className="p-6 border-b border-vault-border">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white">
                TIP<span className="text-gold-gradient">VAULT</span>
              </span>
              <p className="text-xs text-platinum/50">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer
                    ${isActive 
                      ? "bg-gold/10 text-gold border border-gold/20" 
                      : "text-platinum/60 hover:text-white hover:bg-vault-grey/50"
                    }
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
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
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-vip/10 border border-vip/20">
            <Shield className="w-5 h-5 text-vip" />
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-platinum/50">Full Access</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4">
          <motion.button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-status-loss/30 text-status-loss hover:bg-status-loss/10 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className={`w-5 h-5 ${loggingOut ? "animate-pulse" : ""}`} />
            {loggingOut ? "Logging out..." : "Logout"}
          </motion.button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-vault-black/90 backdrop-blur-xl border-b border-vault-border z-50">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-gold" />
            <span className="font-display font-bold text-lg">
              TIP<span className="text-gold-gradient">VAULT</span>
            </span>
            <span className="text-xs text-vip bg-vip/10 px-2 py-0.5 rounded-full">Admin</span>
          </Link>

          <motion.button
            className="p-2 rounded-lg bg-vault-grey/50 border border-vault-border"
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
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40"
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
                        <span className={`
                          flex items-center gap-3 px-4 py-4 rounded-xl transition-all cursor-pointer
                          ${isActive 
                            ? "bg-gold/10 border border-gold/20 text-gold" 
                            : "bg-vault-grey/30 border border-vault-border text-platinum"
                          }
                        `}>
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-status-loss/30 text-status-loss hover:bg-status-loss/10 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <LogOut className="w-5 h-5" />
                {loggingOut ? "Logging out..." : "Logout"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}