"use client";

import { motion } from "framer-motion";

interface TipVaultLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  animated?: boolean;
  showTagline?: boolean;
}

const sizeClasses = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-4xl",
  xl: "text-5xl",
  hero: "text-display-xl",
};

export default function TipVaultLogo({
  size = "md",
  animated = true,
  showTagline = false,
}: TipVaultLogoProps) {
  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const glowVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const letters = "TIPVAULT".split("");

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Logo */}
      <div className="relative">
        {/* Background Glow */}
        {animated && (
          <motion.div
            className="absolute inset-0 blur-3xl bg-gold/30 rounded-full scale-150"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />
        )}

        {/* Logo Text */}
        <motion.h1
          className={`
            ${sizeClasses[size]} 
            font-display 
            font-extrabold 
            tracking-tight
            relative
            z-10
            flex
            perspective-1000
          `}
          initial="hidden"
          animate="visible"
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={animated ? letterVariants : undefined}
              className={`
                inline-block
                ${i < 3 ? "text-white" : "text-gold-gradient"}
                ${animated ? "hover:scale-110 hover:text-shadow-gold-intense transition-all duration-300 cursor-default" : ""}
              `}
              style={{
                textShadow:
                  i >= 3
                    ? "0 0 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.3)"
                    : "none",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Shimmer Effect */}
        {animated && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              animate={{
                x: ["-200%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Tagline */}
      {showTagline && (
        <motion.p
          className="text-platinum/80 text-sm sm:text-base tracking-[0.3em] uppercase font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Unlock Winning Predictions
        </motion.p>
      )}
    </div>
  );
}