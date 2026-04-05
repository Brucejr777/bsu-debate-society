import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
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
      <body className="min-h-full flex flex-col text-neutral-200">
        <div className="fixed inset-0 bg-neutral-900 z-[-3]" />
        <NetworkBackground />
        <div className="bg-mesh">
          <div className="blob blob-red" />
          <div className="blob blob-blue" />
          <div className="blob blob-purple" />
          <div className="blob blob-green" />
        </div>
        <Navbar />
        <main className="flex-1 lg:pl-64">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
