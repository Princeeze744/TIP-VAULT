"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Chinedu A.",
    location: "Lagos",
    text: "I made ₦450k in my first month with TipVault. The 5.50 odds tier is my favorite - consistent wins!",
    amount: "₦450,000",
    avatar: "CA",
  },
  {
    id: 2,
    name: "Emmanuel O.",
    location: "Abuja",
    text: "Finally found a tips service that actually delivers. 78% win rate is no joke. Changed my life!",
    amount: "₦280,000",
    avatar: "EO",
  },
  {
    id: 3,
    name: "Blessing I.",
    location: "Port Harcourt",
    text: "Started with the free trial and now I'm a VIP member. Best decision I ever made!",
    amount: "₦620,000",
    avatar: "BI",
  },
  {
    id: 4,
    name: "Tunde M.",
    location: "Ibadan",
    text: "The 20+ odds ticket hits more than I expected. Made ₦1.2M from just one ticket last week!",
    amount: "₦1,200,000",
    avatar: "TM",
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Testimonial */}
      <div className="relative h-[300px] sm:h-[250px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <div className="glass-card-gold p-6 sm:p-8 h-full flex flex-col">
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-gold/30 mb-4" />

              {/* Text */}
              <p className="text-lg sm:text-xl text-platinum-light leading-relaxed flex-grow">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-vault-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                    {testimonials[current].avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonials[current].name}</p>
                    <p className="text-sm text-vault-muted">{testimonials[current].location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-vault-muted uppercase tracking-wider">Won</p>
                  <p className="text-xl font-mono font-bold text-gold">{testimonials[current].amount}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <motion.button
          className="w-10 h-10 rounded-full bg-vault-grey border border-vault-border flex items-center justify-center hover:border-gold/50 transition-colors"
          onClick={() => paginate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5 text-platinum" />
        </motion.button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === current ? "w-6 bg-gold" : "bg-vault-light hover:bg-vault-muted"
              }`}
            />
          ))}
        </div>

        <motion.button
          className="w-10 h-10 rounded-full bg-vault-grey border border-vault-border flex items-center justify-center hover:border-gold/50 transition-colors"
          onClick={() => paginate(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5 text-platinum" />
        </motion.button>
      </div>
    </div>
  );
}