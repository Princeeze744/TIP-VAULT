"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function InputField({
  label,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange,
  error,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label className="block text-sm font-medium text-platinum/80">
        {label}
      </label>
      <div className="relative">
        {/* Icon */}
        <div
          className={`
            absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300
            ${focused ? "text-gold" : "text-vault-muted"}
          `}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full pl-12 pr-12 py-4 rounded-xl
            bg-vault-obsidian/50 text-white
            border transition-all duration-300
            placeholder:text-vault-muted
            focus:outline-none
            ${error 
              ? "border-status-loss focus:border-status-loss" 
              : focused 
                ? "border-gold/50 shadow-[0_0_0_4px_rgba(212,175,55,0.1)]" 
                : "border-vault-border hover:border-vault-light"
            }
          `}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-vault-muted hover:text-platinum transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Focus Glow */}
        {focused && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: "linear-gradient(90deg, rgba(212,175,55,0.1) 0%, transparent 50%, rgba(212,175,55,0.1) 100%)",
            }}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          className="text-status-loss text-sm flex items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}