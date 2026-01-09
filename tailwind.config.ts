import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          black: "#050507",
          deep: "#0A0A0F",
          obsidian: "#101014",
          grey: "#18181E",
          light: "#232329",
          border: "#2A2A35",
          muted: "#71717A",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FDF9E9",
          100: "#F9F0C8",
          200: "#F4E4BA",
          300: "#E8CE6E",
          400: "#DCBA4D",
          500: "#D4AF37",
          600: "#B8960C",
          700: "#8B7209",
          800: "#5E4D06",
          900: "#312803",
        },
        platinum: {
          DEFAULT: "#C0C0C0",
          light: "#E8E8E8",
          dark: "#8A8A8A",
        },
        status: {
          win: "#00D26A",
          "win-glow": "rgba(0, 210, 106, 0.4)",
          loss: "#FF4757",
          "loss-glow": "rgba(255, 71, 87, 0.4)",
          pending: "#FFA502",
          "pending-glow": "rgba(255, 165, 2, 0.4)",
        },
        vip: {
          DEFAULT: "#9D4EDD",
          glow: "rgba(157, 78, 221, 0.4)",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 10vw, 8rem)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-lg": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["clamp(1.75rem, 4vw, 3rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #B8960C 0%, #D4AF37 25%, #F4E4BA 50%, #D4AF37 75%, #B8960C 100%)",
        "gold-gradient-text": "linear-gradient(90deg, #D4AF37 0%, #F4E4BA 50%, #D4AF37 100%)",
        "gold-shine": "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.5) 50%, transparent 100%)",
        "gold-radial": "radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%)",
        "vault-gradient": "radial-gradient(ellipse at top center, #18181E 0%, #0A0A0F 50%, #050507 100%)",
        "vault-spotlight": "radial-gradient(ellipse at top center, rgba(212,175,55,0.08) 0%, transparent 60%)",
        "mesh-gradient": `
          radial-gradient(at 40% 20%, rgba(212,175,55,0.08) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(157,78,221,0.05) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(212,175,55,0.05) 0px, transparent 50%),
          radial-gradient(at 80% 50%, rgba(0,210,106,0.03) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(212,175,55,0.08) 0px, transparent 50%),
          radial-gradient(at 80% 100%, rgba(157,78,221,0.05) 0px, transparent 50%)
        `,
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, transparent 100%)",
        "border-gradient": "linear-gradient(135deg, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0.1) 50%, rgba(212,175,55,0.5) 100%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "gold-sm": "0 2px 10px rgba(212, 175, 55, 0.15)",
        "gold-md": "0 4px 20px rgba(212, 175, 55, 0.2)",
        "gold-lg": "0 8px 40px rgba(212, 175, 55, 0.3)",
        "gold-xl": "0 12px 60px rgba(212, 175, 55, 0.4)",
        "gold-glow": "0 0 30px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.2)",
        "gold-glow-lg": "0 0 50px rgba(212, 175, 55, 0.5), 0 0 100px rgba(212, 175, 55, 0.3)",
        "gold-glow-intense": "0 0 60px rgba(212, 175, 55, 0.6), 0 0 120px rgba(212, 175, 55, 0.4), 0 0 180px rgba(212, 175, 55, 0.2)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212,175,55,0.2)",
        "inner-glow": "inset 0 1px 1px rgba(255,255,255,0.1)",
        "vip-glow": "0 0 40px rgba(157, 78, 221, 0.4)",
        "win-glow": "0 0 30px rgba(0, 210, 106, 0.4)",
      },
      animation: {
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "shimmer-slow": "shimmer 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "pulse-gold": "pulseGold 3s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
        "glow-text": "glowText 3s ease-in-out infinite alternate",
        "spin-slow": "spin 20s linear infinite",
        "spin-slower": "spin 40s linear infinite",
        "gradient": "gradient 8s ease infinite",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up-delayed": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
        "slide-down": "slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left": "slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right": "slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "blur-in": "blurIn 0.6s ease-out",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "border-flow": "borderFlow 3s linear infinite",
        "text-reveal": "textReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "counter": "counter 2s ease-out",
        "vault-open": "vaultOpen 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "lock-unlock": "lockUnlock 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "particle": "particle 3s ease-in-out infinite",
        "streak": "streak 1s ease-out forwards",
        "magnetic": "magnetic 0.3s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(2deg)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.2), 0 0 40px rgba(212, 175, 55, 0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.4), 0 0 80px rgba(212, 175, 55, 0.2)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "100%": { boxShadow: "0 0 50px rgba(212, 175, 55, 0.6), 0 0 100px rgba(212, 175, 55, 0.3)" },
        },
        glowText: {
          "0%": { textShadow: "0 0 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(212, 175, 55, 0.3)" },
          "100%": { textShadow: "0 0 40px rgba(212, 175, 55, 0.8), 0 0 80px rgba(212, 175, 55, 0.5), 0 0 120px rgba(212, 175, 55, 0.3)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        blurIn: {
          "0%": { opacity: "0", filter: "blur(10px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        borderFlow: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        textReveal: {
          "0%": { opacity: "0", transform: "translateY(100%)", filter: "blur(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        vaultOpen: {
          "0%": { transform: "scale(0.8) rotateY(-90deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotateY(0)", opacity: "1" },
        },
        lockUnlock: {
          "0%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(10deg) scale(1.1)" },
          "100%": { transform: "rotate(0) scale(1)" },
        },
        particle: {
          "0%, 100%": { transform: "translateY(0) translateX(0) scale(1)", opacity: "0.5" },
          "50%": { transform: "translateY(-100px) translateX(20px) scale(0.5)", opacity: "1" },
        },
        streak: {
          "0%": { transform: "translateX(-100%) scaleX(0)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateX(100%) scaleX(1)", opacity: "0" },
        },
        magnetic: {
          "0%": { transform: "translate(var(--x, 0), var(--y, 0))" },
          "100%": { transform: "translate(0, 0)" },
        },
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "smooth-in": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      backdropBlur: {
        xs: "2px",
      },
      screens: {
        "xs": "475px",
      },
    },
  },
  plugins: [],
};

export default config;