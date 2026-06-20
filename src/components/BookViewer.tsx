// src/components/BookViewer.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Section {
  label: string;
  file: string;
}

interface BookViewerProps {
  title: string;
  sections: Section[];
  basePath: string;
  defaultFile?: string;
}

export default function BookViewer({
  title,
  sections,
  basePath,
  defaultFile,
}: BookViewerProps) {
  const [currentFile, setCurrentFile] = useState(
    defaultFile || sections[0]?.file || ""
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const iframeSrc = `${basePath}/${currentFile}`;

  const handleSectionClick = (file: string) => {
    setCurrentFile(file);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-white">
      {/* ── Mobile Toolbar ── */}
      <div className="flex items-center gap-3 border-b border-neutral-800 bg-neutral-900/80 px-4 py-3 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
          aria-label="Open table of contents"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <span>Contents</span>
        </button>
        <span className="truncate text-sm font-medium text-neutral-400">
          {title}
        </span>
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-neutral-900/95 p-4 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          aria-label="Close table of contents"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <Link
            href="/documents"
            className="text-sm font-medium text-neutral-400 transition hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            ← Back to Documents
          </Link>
        </div>

        <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>

        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.file}
              onClick={() => handleSectionClick(section.file)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                currentFile === section.file
                  ? "bg-amber-900/30 text-amber-200"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Backdrop overlay (mobile only) ── */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Reopen button (desktop only, when sidebar is closed) ── */}
      {!isSidebarOpen && !isMobile && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-64 top-1/2 z-50 -translate-y-1/2 flex items-center gap-2 rounded-r-lg border border-l-0 border-amber-700/50 bg-amber-800/95 px-3 py-4 text-sm font-medium text-white shadow-lg transition hover:bg-amber-700"
          aria-label="Open table of contents"
          title="Show contents"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <span className="hidden sm:inline">Contents</span>
        </button>
      )}

      {/* ── Main content: iframe ── */}
      <main className="flex-1 overflow-hidden">
        <iframe
          src={iframeSrc}
          className="h-full w-full border-0"
          title={title}
        />
      </main>
    </div>
  );
}