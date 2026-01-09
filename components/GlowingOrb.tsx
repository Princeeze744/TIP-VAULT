"use client";

import { motion } from "framer-motion";

interface GlowingOrbProps {
  color?: "gold" | "purple" | "cyan" | "green";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  delay?: number;
}

const colors = {
  gold: "from-gold/30 to-gold/5",
  purple: "from-purple-500/30 to-purple-500/5",
  cyan: "from-cyan-500/30 to-cyan-500/5",
  green: "from-emerald-500/30 to-emerald-500/5",
};

const sizes = {
  sm: "w-32 h-32",
  md: "w-64 h-64",
  lg: "w-96 h-96",
  xl: "w-[500px] h-[500px]",
};

export default function GlowingOrb({ color = "gold", size = "md", className = "", delay = 0 }: GlowingOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-radial ${colors[color]} blur-3xl pointer-events-none ${sizes[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}