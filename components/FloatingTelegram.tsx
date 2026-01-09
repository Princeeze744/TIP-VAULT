"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

interface FloatingTelegramProps {
  link: string;
}

export default function FloatingTelegram({ link }: FloatingTelegramProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-vault-obsidian border border-vault-border rounded-lg shadow-xl whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="text-sm text-white">Join our Telegram!</p>
            <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2 bg-vault-obsidian border-r border-b border-vault-border" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-600 shadow-lg shadow-gold/25 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-20" />
        
        {/* Icon */}
        <Send className="w-6 h-6 text-vault-black" />
      </motion.a>
    </motion.div>
  );
}