"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  words: string[];
  className?: string;
}

export default function Typewriter({ words, className = "" }: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < word.length) {
            setCurrentText(word.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(word.slice(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        className="inline-block w-[3px] h-[1em] bg-gold ml-1 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  );
}