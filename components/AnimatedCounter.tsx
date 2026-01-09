"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <motion.span
      ref={ref}
      className="stat-number text-gold-gradient"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {prefix}
      {count.toLocaleString()}
      {decimals > 0 && `.${String(count).slice(-decimals)}`}
      {suffix}
    </motion.span>
  );
}