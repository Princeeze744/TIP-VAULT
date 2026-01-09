import type { Metadata, Viewport } from "next";
import { Outfit, Syne, Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0F",
};

export const metadata: Metadata = {
  title: "TipVault | Unlock Winning Predictions",
  description:
    "Access premium football and basketball predictions. Join thousands of winners unlocking the vault daily.",
  keywords: [
    "betting tips",
    "football predictions",
    "basketball predictions",
    "sports betting",
    "tipvault",
  ],
  authors: [{ name: "TipVault" }],
  creator: "TipVault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`
          ${outfit.variable} 
          ${syne.variable} 
          ${spaceMono.variable} 
          font-sans 
          antialiased 
          bg-vault-black 
          text-white 
          selection:bg-gold/30 
          selection:text-gold-200
          overflow-x-hidden
        `}
        suppressHydrationWarning
      >
        <AuthProvider>
          {/* Noise Overlay */}
          <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.015] mix-blend-overlay">
            <div className="absolute inset-0 bg-noise" />
          </div>

          {/* Main Content */}
          <main className="relative z-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}