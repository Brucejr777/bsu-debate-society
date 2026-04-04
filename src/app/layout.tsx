import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BSU Debate Society",
  description: "Welcome to the BSU Debate Society",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
