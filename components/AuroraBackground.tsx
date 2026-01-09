"use client";

import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-vault-black" />

      {/* Aurora layers */}
      <motion.div
        className="absolute top-0 left-1/4 w-[800px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "linear-gradient(180deg, rgba(212, 175, 55, 0.4) 0%, rgba(212, 175, 55, 0) 100%)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/4 right-1/4 w-[600px] h-[500px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: "linear-gradient(180deg, rgba(157, 78, 221, 0.4) 0%, rgba(157, 78, 221, 0) 100%)",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 w-[700px] h-[400px] rounded-full opacity-10 blur-[100px]"
        style={{
          background: "linear-gradient(0deg, rgba(0, 210, 106, 0.3) 0%, rgba(0, 210, 106, 0) 100%)",
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-noise" />

      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 7, 0.8) 100%)",
        }}
      />
    </div>
  );
}