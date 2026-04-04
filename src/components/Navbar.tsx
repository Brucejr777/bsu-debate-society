"use client";

import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Houses", href: "/houses" },
  { label: "Standings", href: "/standings" },
  { label: "League", href: "/league" },
  { label: "Governance", href: "/governance" },
  { label: "Elections", href: "/elections" },
  { label: "Documents", href: "/documents" },
  { label: "Contact", href: "/contact" },
  { label: "Apply", href: "/apply" },
];

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Memberships", href: "/admin/memberships" },
  { label: "House Points", href: "/admin/points" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Admin Login", href: "/admin/login" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        {/* Logo / Brand */}
        <a href="/" className="flex items-center gap-3 text-sm font-semibold text-white">
          <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-bold tracking-widest text-neutral-950">
            BSU
          </span>
          <span className="tracking-wide">Debate Society</span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-400 transition hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}

          {/* Admin Dropdown */}
          <li className="relative">
            <button
              type="button"
              onClick={() => setAdminOpen((prev) => !prev)}
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              Admin
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`size-4 transition-transform ${adminOpen ? "rotate-180" : ""}`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {adminOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-neutral-800 bg-neutral-950 p-2 shadow-xl shadow-black/30">
                {adminLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
                    onClick={() => setAdminOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </li>
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
            {navLinks.map((link) => (
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
            <li className="pt-2">
              <p className="px-4 text-xs font-semibold uppercase tracking-widest text-neutral-600">
                Admin
              </p>
              <ul className="mt-1 space-y-1">
                {adminLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="block rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-500 transition hover:bg-neutral-800 hover:text-white"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
