"use client";

import { useState, type ReactNode } from "react";

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Memberships", href: "/admin/memberships" },
  { label: "House Points", href: "/admin/points" },
  { label: "Messages", href: "/admin/messages" },
  { label: "League & Awards", href: "/admin/league" },
  { label: "Discipline", href: "/admin/discipline" },
  { label: "Finance", href: "/admin/finance" },
  { label: "Meetings", href: "/admin/meetings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
          {/* Logo */}
          <a
            href="/admin/dashboard"
            className="flex items-center gap-3 text-sm font-semibold text-white"
          >
            <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-bold tracking-widest text-neutral-950">
              ADMIN
            </span>
            <span className="hidden sm:inline tracking-wide">
              Debate Society
            </span>
          </a>

          {/* Desktop Nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {adminLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-neutral-400 transition hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-neutral-400 transition hover:text-white md:hidden"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {open && (
          <div className="border-t border-neutral-800 bg-neutral-950 md:hidden">
            <ul className="space-y-1 px-6 py-4">
              {adminLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">{children}</main>
    </div>
  );
}
