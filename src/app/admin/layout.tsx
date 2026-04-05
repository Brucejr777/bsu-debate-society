import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">{children}</main>
    </div>
  );
}
