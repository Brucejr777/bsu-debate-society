import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Using Inter and Roboto Mono as fallbacks for Geist, which is Next.js 15+ only
const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BSU Debate Society",
  description: "Fostering critical thinking, effective communication, and intellectual curiosity at Benguet State University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Pure black background */}
        <div className="fixed inset-0 bg-black z-[-2]" />
        <Navbar />
        <main className="flex-1 lg:pl-64">{children}</main>
        <Footer />
      </body>
    </html>
  );
}