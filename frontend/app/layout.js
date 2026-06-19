import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "AquaWatch — Water Pollution Reporter",
  description:
    "Report water pollution incidents with a photo and a pin, and track government response in real time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col bg-surface text-ink antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0B2B2E",
              color: "#F6F8F7",
              fontSize: "13px",
              borderRadius: "10px",
            },
          }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-mist py-6 text-center text-xs text-ink-soft">
          <span className="font-data">AquaWatch · Final-year project · Built for cleaner waterways</span>
        </footer>
      </body>
    </html>
  );
}
