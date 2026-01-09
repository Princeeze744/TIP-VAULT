"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, DollarSign, TrendingUp, Users } from "lucide-react";

const activities = [
  { type: "win", user: "Chinedu O.", amount: "₦45,000", odds: "5.50", icon: CheckCircle },
  { type: "join", user: "Blessing A.", location: "Lagos", icon: Users },
  { type: "win", user: "Emmanuel K.", amount: "₦120,000", odds: "10.50", icon: CheckCircle },
  { type: "win", user: "Fatima M.", amount: "₦28,000", odds: "3.50", icon: CheckCircle },
  { type: "join", user: "David E.", location: "Abuja", icon: Users },
  { type: "win", user: "Grace U.", amount: "₦85,000", odds: "5.50", icon: CheckCircle },
  { type: "win", user: "Samuel A.", amount: "₦200,000", odds: "20+", icon: CheckCircle },
  { type: "join", user: "Mary O.", location: "Port Harcourt", icon: Users },
  { type: "win", user: "John D.", amount: "₦55,000", odds: "2.50", icon: CheckCircle },
  { type: "join", user: "Angela N.", location: "Enugu", icon: Users },
];

export default function LiveActivity() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentIndex];

  return (
    <div className="fixed bottom-24 left-4 z-40 hidden sm:block">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.8 }}
            className="glass-card p-3 pr-5 flex items-center gap-3 shadow-2xl"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activity.type === "win" ? "bg-status-win/20" : "bg-gold/20"
            }`}>
              <activity.icon className={`w-5 h-5 ${
                activity.type === "win" ? "text-status-win" : "text-gold"
              }`} />
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {activity.type === "win" ? (
                  <><span className="text-status-win">{activity.user}</span> just won <span className="text-gold font-mono">{activity.amount}</span></>
                ) : (
                  <><span className="text-gold">{activity.user}</span> joined from {activity.location}</>
                )}
              </p>
              {activity.type === "win" && (
                <p className="text-platinum/50 text-xs">
                  @ {activity.odds} odds
                </p>
              )}
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-status-win"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}