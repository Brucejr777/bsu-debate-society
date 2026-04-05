"use client";

import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Houses", href: "/houses" },
  { label: "Membership", href: "/membership" },
  { label: "Standings", href: "/standings" },
  { label: "House Cup", href: "/house-cup" },
  { label: "House of Sem.", href: "/house-of-semester" },
  { label: "Debate Cup", href: "/debate-cup" },
  { label: "League", href: "/league" },
  { label: "Ledger", href: "/individual-ledger" },
  { label: "Governance", href: "/governance" },
  { label: "Finance", href: "/finance" },
  { label: "Meetings", href: "/meetings" },
  { label: "Discipline", href: "/discipline" },
  { label: "Elections", href: "/elections" },
  { label: "Electoral Protest", href: "/electoral-protest" },
  { label: "Appeals", href: "/appeals" },
  { label: "Documents", href: "/documents" },
  { label: "Records Access", href: "/records-access" },
  { label: "SOSA", href: "/sosa" },
  { label: "Nominate", href: "/nominate" },
  { label: "Contact", href: "/contact" },
  { label: "Apply", href: "/apply" },
];

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Memberships", href: "/admin/memberships" },
  { label: "House Points", href: "/admin/points" },
  { label: "House Cup", href: "/admin/house-cup" },
  { label: "House of Sem.", href: "/admin/house-of-semester" },
  { label: "Indiv. Points", href: "/admin/individual-points" },
  { label: "Messages", href: "/admin/messages" },
  { label: "League & Awards", href: "/admin/league" },
  { label: "Debate Cup", href: "/admin/debate-cup" },
  { label: "Nominations", href: "/admin/nominations" },
  { label: "Support Requests", href: "/admin/support-requests" },
  { label: "Records Access", href: "/admin/records-access" },
  { label: "Electoral Protests", href: "/admin/electoral-protests" },
  { label: "Appeals", href: "/admin/appeals" },
  { label: "SOSA", href: "/admin/sosa" },
  { label: "Discipline", href: "/admin/discipline" },
  { label: "Finance", href: "/admin/finance" },
  { label: "Meetings", href: "/admin/meetings" },
  { label: "Admin Login", href: "/admin/login" },
];

const SIDEBAR_WIDTH = "w-64";

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={onClick}
          className="group block rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-all hover:bg-gradient-to-r hover:from-[#ffd700]/15 hover:to-[#daa520]/8"
        >
          <span className="transition-colors group-hover:text-[#ffd700]">{link.label}</span>
        </a>
      ))}
    </>
  );
}

function AdminSection({ onClick }: { onClick?: () => void }) {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="mt-2 pt-2 border-t border-[#daa520]/20">
      <button
        type="button"
        onClick={() => setAdminOpen((prev) => !prev)}
        className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-all hover:bg-gradient-to-r hover:from-[#ffd700]/15 hover:to-[#daa520]/8"
      >
        <span className="transition-colors group-hover:text-[#ffd700]">Admin</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-4 text-[#ffd700] transition-transform ${adminOpen ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {adminOpen && (
        <div className="mt-1 space-y-0.5 pl-2">
          {adminLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClick}
              className="group block rounded-lg px-3 py-2 text-xs font-medium text-neutral-500 transition-all hover:bg-gradient-to-r hover:from-[#ffd700]/15 hover:to-[#daa520]/8"
            >
              <span className="transition-colors group-hover:text-[#ffd700]">{link.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Sidebar (lg+) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-neutral-800/80 bg-gradient-to-b from-neutral-950 via-neutral-950/98 to-neutral-950 backdrop-blur-xl lg:flex`}
      >
        {/* Brand */}
        <a href="/" className="group flex items-center gap-3 px-6 py-6">
          <span className="rounded-full bg-gradient-to-br from-[#ffec3a] via-[#ffd700] to-[#ffa100] px-2.5 py-1 text-xs font-bold tracking-widest text-neutral-950 transition-transform group-hover:scale-105 shadow-[0_0_12px_rgba(255,215,0,0.3)]">
            BSU
          </span>
          <span className="text-sm font-semibold tracking-wide text-neutral-200 transition-colors group-hover:text-white">
            Debate Society
          </span>
        </a>

        {/* Nav Links */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <NavLinks />
          <AdminSection />
        </nav>
      </aside>

      {/* ── Mobile Top Bar (< lg) ── */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-gradient-to-r from-neutral-950/95 via-neutral-900/95 to-neutral-950/95 backdrop-blur-xl lg:hidden">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 text-sm font-semibold">
            <span className="rounded-full bg-gradient-to-br from-[#ffec3a] via-[#ffd700] to-[#ffa100] px-2.5 py-1 text-xs font-bold tracking-widest text-neutral-950 transition-transform hover:scale-105 shadow-[0_0_12px_rgba(255,215,0,0.3)]">
              BSU
            </span>
            <span className="tracking-wide text-neutral-200">Debate Society</span>
          </a>

          {/* Hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-neutral-400 transition hover:text-white"
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

        {/* Mobile Dropdown */}
        {open && (
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-neutral-800/80 bg-neutral-950/98 backdrop-blur-xl">
            <div className="space-y-0.5 px-6 py-4">
              <NavLinks onClick={() => setOpen(false)} />
              <AdminSection onClick={() => setOpen(false)} />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
