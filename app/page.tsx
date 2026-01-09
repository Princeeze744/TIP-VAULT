"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  TrendingUp,
  Users,
  Zap,
  Trophy,
  Lock,
  ChevronRight,
  Star,
  Target,
  BarChart3,
  ArrowRight,
  Clock,
  CheckCircle,
  Sparkles,
  Crown,
  MessageCircle,
  Send,
  HelpCircle,
  ChevronDown,
  Check,
  Menu,
  X,
} from "lucide-react";

const TELEGRAM_LINK = "https://t.me/TIPVAULT1";

// ============ NAVBAR ============
function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-vault-black/95 backdrop-blur-xl border-b border-vault-border" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              </div>
              <span className="font-display font-bold text-lg sm:text-xl">
                <span className="text-white">TIP</span>
                <span className="text-gold-gradient">VAULT</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {["How It Works", "Odds", "Pricing", "FAQ"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-platinum/70 hover:text-gold text-sm transition-colors">
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-platinum/70 hover:text-white text-sm transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <motion.span
                  className="btn-primary text-sm cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.span>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-vault-grey border border-vault-border"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-gold" /> : <Menu className="w-5 h-5 text-platinum" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* FIXED: Mobile Menu with visible buttons */}
      {mobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-vault-black/98 backdrop-blur-xl" onClick={() => setMobileMenuOpen(false)} />
          <motion.div
            className="absolute top-20 left-4 right-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="glass-card overflow-hidden">
              <div className="p-2">
                {["How It Works", "Odds Tiers", "Pricing", "FAQ"].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-4 rounded-xl text-white hover:bg-gold/10 hover:text-gold transition-colors font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
              <div className="border-t border-vault-border p-4 space-y-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <span className="block text-center py-3.5 rounded-xl text-white bg-vault-grey border border-vault-border hover:border-gold/30 transition-colors font-medium">
                    Login
                  </span>
                </Link>
                {/* FIXED: Gold gradient button clearly visible */}
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <span className="block text-center py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-200 text-vault-black font-bold shadow-lg shadow-gold/20">
                    Get Started Free
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

// ============ TYPEWRITER ============
function Typewriter({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(word.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="text-gold font-semibold">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// ============ ANIMATED COUNTER ============
function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = value / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref} className="text-gold-gradient">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ============ LIVE ACTIVITY ============
function LiveActivity() {
  const activities = [
    { type: "win", user: "Chinedu O.", amount: "₦45,000", odds: "5.50" },
    { type: "join", user: "Blessing A.", location: "Lagos" },
    { type: "win", user: "Emmanuel K.", amount: "₦120,000", odds: "10.50" },
    { type: "win", user: "Fatima M.", amount: "₦28,000", odds: "3.50" },
  ];

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
  }, [activities.length]);

  const activity = activities[currentIndex];

  return (
    <div className="fixed bottom-24 left-4 z-30 hidden sm:block">
      {visible && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          className="glass-card p-3 pr-5 flex items-center gap-3 shadow-2xl"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === "win" ? "bg-status-win/20" : "bg-gold/20"}`}>
            {activity.type === "win" ? <CheckCircle className="w-5 h-5 text-status-win" /> : <Users className="w-5 h-5 text-gold" />}
          </div>
          <div>
            <p className="text-white text-sm font-medium">
              {activity.type === "win" ? (
                <>
                  <span className="text-status-win">{activity.user}</span> won{" "}
                  <span className="text-gold font-mono font-bold">{activity.amount}</span>
                </>
              ) : (
                <>
                  <span className="text-gold">{activity.user}</span> joined from {activity.location}
                </>
              )}
            </p>
            {activity.type === "win" && <p className="text-platinum/50 text-xs">@ {activity.odds} odds</p>}
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-status-win animate-pulse" />
        </motion.div>
      )}
    </div>
  );
}

// ============ FAQ ============
function FAQ() {
  const faqs = [
    { question: "How do I get started?", answer: "Simply create a free account using your email or Google. You get instant access to all 18 daily tips during our launch period. No credit card required!" },
    { question: "When are tips posted?", answer: "New tips drop every day at 6AM WAT. You get 9 football and 9 basketball predictions across different odds tiers." },
    { question: "How accurate are the predictions?", answer: "Our analysts maintain a verified 78% win rate. All results are tracked transparently." },
    { question: "Is there a free trial?", answer: "Yes! During our launch period, ALL 18 daily tips are completely FREE including premium high-odds predictions." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="glass-card overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full p-5 flex items-center justify-between gap-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-gold" />
              </div>
              <span className="text-white font-medium">{faq.question}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gold transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
          </button>
          {openIndex === index && (
            <div className="px-5 pb-5 pl-16">
              <p className="text-platinum/70 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ============ MAIN PAGE ============
export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 12, mins: 45, secs: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-vault-black overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-vip/5 rounded-full blur-[150px]" />
      </div>

      <LandingNavbar />
      <LiveActivity />

      {/* ============ HERO ============ */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-status-win/10 border border-status-win/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-win opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-win" />
              </span>
              <span className="text-status-win text-sm font-medium">FREE Access Ends In:</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              {[`${timeLeft.days}d`, `${timeLeft.hours}h`, `${timeLeft.mins}m`, `${timeLeft.secs}s`].map((t, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-bold">{t}</span>
              ))}
            </div>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <motion.h1 
              className="text-6xl sm:text-7xl lg:text-9xl font-display font-black tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.span 
                className="text-white inline-block"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                TIP
              </motion.span>
              <motion.span 
                className="text-gold-gradient inline-block"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                VAULT
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-platinum/60 text-sm sm:text-base tracking-[0.3em] mt-4 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              UNLOCK WINNING PREDICTIONS
            </motion.p>
          </motion.div>

          {/* Typewriter */}
          <motion.p
            className="mt-8 text-lg sm:text-xl lg:text-2xl text-platinum/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Access premium <Typewriter words={["Football", "Basketball", "2.50 Odds", "5.50 Odds", "10.50 Odds", "20+ Odds"]} /> predictions daily.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <motion.span
                className="btn-primary flex items-center justify-center gap-2 text-lg w-full sm:w-auto cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5" />
                Enter The Vault
                <ChevronRight className="w-5 h-5" />
              </motion.span>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <motion.span
                className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Today&#39;s Results
              </motion.span>
            </Link>
          </motion.div>

          {/* Trust */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {[
              { icon: Shield, text: "Verified Results", color: "text-status-win" },
              { icon: Users, text: "5,000+ Members", color: "text-gold" },
              { icon: TrendingUp, text: "78% Win Rate", color: "text-gold" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-platinum/60 text-sm">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-gold/30 flex items-start justify-center p-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gold"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ============ STATS ============ */}
      <section className="relative py-16 border-y border-vault-border bg-vault-obsidian/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: 5000, suffix: "+", label: "Active Members", icon: Users },
              { value: 78, suffix: "%", label: "Win Rate", icon: Target },
              { value: 18, suffix: "", label: "Daily Tips", icon: Zap },
              { value: 50, suffix: "M+", prefix: "₦", label: "Won by Members", icon: Trophy },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 sm:p-6 text-center"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <p className="text-platinum/60 text-xs sm:text-sm mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-4">
              <Zap className="w-4 h-4" /> Simple Process
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-white mb-4">
              Start Winning in <span className="text-gold-gradient">3 Easy Steps</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up with Google in 2 seconds. Free during launch.", icon: Users },
              { step: "02", title: "Check Daily Tips", desc: "Every 6AM, get 18 predictions across 5 odds tiers.", icon: BarChart3 },
              { step: "03", title: "Win Consistently", desc: "Follow tips, track results, grow your bankroll.", icon: Trophy },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="glass-card p-6 sm:p-8 relative overflow-hidden group hover:border-gold/30 transition-all"
              >
                <div className="absolute -top-4 -right-4 text-7xl sm:text-8xl font-display font-black text-gold/5 group-hover:text-gold/10 transition-colors">{item.step}</div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-gold" />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-platinum/60 text-sm sm:text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ODDS TIERS ============ */}
      <section id="odds" className="relative py-16 sm:py-24 bg-vault-obsidian/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-4">
              <Target className="w-4 h-4" /> Risk Levels
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-white mb-4">
              Choose Your <span className="text-gold-gradient">Odds Tier</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { odds: "2.50", tier: "Bronze", color: "odds-badge-bronze", tickets: 2 },
              { odds: "3.50", tier: "Silver", color: "odds-badge-silver", tickets: 2 },
              { odds: "5.50", tier: "Gold", color: "odds-badge-gold", tickets: 2 },
              { odds: "10.50", tier: "Diamond", color: "odds-badge-diamond", tickets: 2 },
              { odds: "20+", tier: "Crown", color: "odds-badge-crown", tickets: 1, special: true },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`glass-card p-4 sm:p-6 relative overflow-hidden group hover:border-gold/30 transition-all ${item.special ? "col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className={`odds-badge ${item.color}`}>{item.tier}</span>
                  {item.special && <Crown className="w-5 h-5 text-vip animate-pulse" />}
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold text-white group-hover:text-gold transition-colors mb-1 sm:mb-2">
                  {item.odds}<span className="text-sm sm:text-lg text-platinum/40 ml-1">odds</span>
                </div>
                <p className="text-platinum/60 text-xs sm:text-sm">{item.tickets} ticket{item.tickets > 1 ? "s" : ""}/day</p>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-8 sm:mt-12 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 rounded-full bg-gold/10 border border-gold/20">
              <Zap className="w-5 h-5 text-gold" />
              <span className="text-gold font-semibold text-sm sm:text-base">18 Total Tips Daily</span>
              <span className="text-platinum/40 hidden sm:inline">|</span>
              <span className="text-platinum/60 text-xs sm:text-sm">9 Football + 9 Basketball</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ PRICING - FIXED VISIBILITY ============ */}
      <section id="pricing" className="relative py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {/* FIXED: Badge with visible green text */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" /> Limited Time
            </span>
            {/* FIXED: Simple is white, Pricing is gold */}
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold mb-4">
              <span className="text-white">Simple</span>{" "}
              <span className="text-gold-gradient">Pricing</span>
            </h2>
            <p className="text-platinum/60 text-sm sm:text-base">Free during launch. No credit card required.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: "Free", price: "₦0", period: "Launch Special", features: ["All 18 daily tips", "All odds tiers", "Results tracking", "Telegram community"], cta: "Get Started Free", href: "/signup", popular: true, badge: "LIMITED" },
              { name: "Weekly", price: "₦1,500", period: "/week", features: ["All 18 daily tips", "VIP Telegram", "Priority support", "7 days"], cta: "Coming Soon", disabled: true },
              { name: "Monthly", price: "₦5,000", period: "/month", features: ["All 18 daily tips", "VIP Telegram", "Priority support", "30 days", "Save 17%"], cta: "Coming Soon", disabled: true, badge: "BEST VALUE" },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* FIXED: Badge visibility */}
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold z-10 ${
                    plan.popular 
                      ? "bg-gradient-to-r from-gold to-gold-200 text-vault-black shadow-lg shadow-gold/30" 
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  }`}>
                    {plan.badge}
                  </div>
                )}
                <div className={`h-full p-5 sm:p-6 rounded-2xl border transition-all ${
                  plan.popular 
                    ? "bg-gold/5 border-gold/30" 
                    : "bg-vault-obsidian/50 border-vault-border"
                } ${plan.disabled ? "opacity-60" : ""}`}>
                  <div className="text-center mb-5 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-3 sm:mb-4">{plan.name}</h3>
                    <div>
                      <span className="text-3xl sm:text-4xl font-display font-bold text-white">{plan.price}</span>
                      <span className="text-platinum/60 text-sm sm:text-base ml-1">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.popular ? "bg-gold/20" : "bg-emerald-500/20"
                        }`}>
                          <Check className={`w-3 h-3 ${plan.popular ? "text-gold" : "text-emerald-400"}`} />
                        </div>
                        <span className="text-platinum/70 text-sm sm:text-base">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.disabled ? (
                    <button disabled className="w-full py-3 sm:py-4 rounded-xl bg-vault-grey text-platinum/50 font-bold cursor-not-allowed text-sm sm:text-base">
                      {plan.cta}
                    </button>
                  ) : (
                    <Link href={plan.href || "#"}>
                      <span className="btn-primary block w-full text-center text-sm sm:text-base">
                        {plan.cta}
                      </span>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="relative py-16 sm:py-24 bg-vault-obsidian/50">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-4">
              <MessageCircle className="w-4 h-4" /> FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-white">
              Got <span className="text-gold-gradient">Questions?</span>
            </h2>
          </motion.div>
          <FAQ />
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="glass-card-gold p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gold/10 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 text-sm font-medium">150+ signed up in the last hour</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-white mb-4">
                Ready to Start <span className="text-gold-gradient">Winning</span>?
              </h2>
              <p className="text-platinum/60 max-w-xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
                Join 5,000+ members who unlock the vault every day.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link href="/signup">
                  <motion.span 
                    className="btn-primary text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer" 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-5 h-5" /> Create Free Account <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
                <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
                  <motion.span 
                    className="btn-secondary flex items-center justify-center gap-2 cursor-pointer" 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-5 h-5" /> Join Telegram
                  </motion.span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-10 sm:py-12 border-t border-vault-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gold" />
                </div>
                <span className="font-display font-bold text-xl">
                  <span className="text-white">TIP</span>
                  <span className="text-gold-gradient">VAULT</span>
                </span>
              </Link>
              <p className="text-platinum/60 text-sm mb-4">Unlock winning predictions daily.</p>
              <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gold text-sm hover:text-gold-200 transition-colors">
                <Send className="w-4 h-4" /> Join Telegram
              </a>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-platinum/60 text-sm">
                <li><a href="#how-it-works" className="hover:text-gold transition-colors">How It Works</a></li>
                <li><a href="#odds" className="hover:text-gold transition-colors">Odds Tiers</a></li>
                <li><a href="#pricing" className="hover:text-gold transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-platinum/60 text-sm">
                <li><Link href="/login" className="hover:text-gold transition-colors">Login</Link></li>
                <li><Link href="/signup" className="hover:text-gold transition-colors">Sign Up</Link></li>
                <li><Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-platinum/60 text-sm">
                <li><Link href="/terms" className="hover:text-gold transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-vault-border text-center text-platinum/40 text-sm">
            © 2025 TipVault. All rights reserved. Bet responsibly.
          </div>
        </div>
      </footer>

      {/* Floating Telegram */}
      <motion.a
        href={TELEGRAM_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-gold to-gold-200 flex items-center justify-center shadow-lg shadow-gold/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Send className="w-6 h-6 text-vault-black" />
      </motion.a>
    </div>
  );
}