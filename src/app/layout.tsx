// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BSU Debate Society | Official Portal",
  description:
    "The official digital governance, membership, and transparency platform of the BSU Debate Society.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-neutral-950 text-neutral-100 selection:bg-amber-500/30 selection:text-amber-100`}
      >
        {/* Global Navigation */}
        <Navbar />

        {/* Main Content Wrapper */}
        <main className="w-full lg:pl-64">
          <div className="min-h-screen">
            {children}
          </div>
        </main>

        {/* Global Toast Notifications */}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#171717",
              border: "1px solid #262626",
              color: "#fff",
              borderRadius: "12px",
            },
            classNames: {
              toast: "shadow-xl shadow-black/40",
              title: "text-sm font-semibold",
              description: "text-xs text-neutral-400",
            },
          }}
        />
      </body>
    </html>
  );
}