"use client";

import { motion } from "framer-motion";

interface SportTabsProps {
  activeTab: "football" | "basketball";
  onTabChange: (tab: "football" | "basketball") => void;
}

export default function SportTabs({ activeTab, onTabChange }: SportTabsProps) {
  return (
    <div className="flex bg-vault-obsidian/50 p-1.5 rounded-xl border border-vault-border">
      {[
        { id: "football" as const, label: "⚽ Football", emoji: "⚽" },
        { id: "basketball" as const, label: "🏀 Basketball", emoji: "🏀" },
      ].map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative flex-1 px-4 sm:px-6 py-3 rounded-lg text-sm font-medium transition-colors
            ${activeTab === tab.id ? "text-vault-black" : "text-platinum/60 hover:text-white"}
          `}
          whileTap={{ scale: 0.98 }}
        >
          {activeTab === tab.id && (
            <motion.div
              className="absolute inset-0 bg-gold-gradient rounded-lg"
              layoutId="activeTab"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.emoji} {tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}