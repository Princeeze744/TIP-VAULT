"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Home, BarChart3, Trophy, Crown, LogIn, Rocket } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BarChart3, label: "How It Works", href: "/#how-it-works" },
  { icon: Trophy, label: "Odds Tiers", href: "/#odds" },
  { icon: Crown, label: "VIP Access", href: "/#vip" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-vault-black/90 backdrop-blur-xl z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-16 left-0 right-0 bottom-0 z-40 md:hidden overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-4 py-6 space-y-2">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8 px-4">
                <Lock className="w-8 h-8 text-gold" />
                <span className="font-display font-bold text-2xl">
                  TIP<span className="text-gold-gradient">VAULT</span>
                </span>
              </div>

              {/* Menu Items */}
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-4 rounded-xl bg-vault-grey/30 border border-vault-border hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <span className="font-medium text-white">{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <div className="h-px bg-vault-border my-6" />

              {/* Auth Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/login" onClick={onClose}>
                  <span className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border border-vault-border hover:border-gold/30 transition-all duration-300">
                    <LogIn className="w-5 h-5 text-platinum" />
                    <span className="font-medium text-platinum">Login</span>
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/signup" onClick={onClose}>
                  <span className="w-full btn-primary flex items-center justify-center gap-3 !py-4">
                    <Rocket className="w-5 h-5" />
                    <span>Get Started Free</span>
                  </span>
                </Link>
              </motion.div>

              {/* Trust Badge */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-vault-muted text-sm">
                  Trusted by <span className="text-gold font-semibold">5,000+</span> winners
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}