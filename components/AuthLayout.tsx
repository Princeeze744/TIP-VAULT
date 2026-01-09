"use client";

import { motion } from "framer-motion";
import { Lock, TrendingUp, Shield, Users } from "lucide-react";
import Link from "next/link";
import GoldParticles from "./GoldParticles";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showStats?: boolean;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  showStats = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding (Hidden on mobile, shown on lg+) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-vault-deep overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-vault-gradient" />
        <div className="absolute inset-0 bg-vault-spotlight opacity-60" />
        <GoldParticles count={30} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="relative">
              <Lock className="w-10 h-10 text-gold" />
              <div className="absolute inset-0 bg-gold/30 blur-xl" />
            </div>
            <span className="font-display font-bold text-3xl">
              TIP<span className="text-gold-gradient">VAULT</span>
            </span>
          </Link>

          {/* Headline */}
          <motion.h1
            className="text-4xl xl:text-5xl font-display font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Unlock Your
            <br />
            <span className="text-gold-gradient">Winning Streak</span>
          </motion.h1>

          <motion.p
            className="text-platinum/60 text-lg mb-12 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Join thousands of winners accessing premium predictions daily. Your journey to consistent wins starts here.
          </motion.p>

          {/* Stats */}
          {showStats && (
            <motion.div
              className="grid grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: Users, value: "5,000+", label: "Members" },
                { icon: TrendingUp, value: "78%", label: "Win Rate" },
                { icon: Shield, value: "18", label: "Daily Tips" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/10 mb-3">
                    <stat.icon className="w-6 h-6 text-gold" />
                  </div>
                  <div className="text-2xl font-display font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-platinum/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-vault-black to-transparent" />
        </div>

        {/* Decorative Vault Door Lines */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-px h-[60%] bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile Header */}
        <div className="lg:hidden px-4 py-4 flex items-center justify-between border-b border-vault-border bg-vault-black/80 backdrop-blur-xl sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-gold" />
            <span className="font-display font-bold text-xl">
              TIP<span className="text-gold-gradient">VAULT</span>
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-vault-black">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title */}
            <div className="text-center mb-8">
              <motion.h2
                className="text-2xl sm:text-3xl font-display font-bold mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h2>
              <motion.p
                className="text-platinum/60 text-sm sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            </div>

            {/* Form Content */}
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}