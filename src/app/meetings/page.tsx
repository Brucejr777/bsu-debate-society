"use client";

import { useEffect, useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  society_assembly: "Society Assembly",
  high_council: "High Council",
  chancellors_council: "Council of House Chancellors",
  house_assembly: "House Assembly",
  special: "Special Meeting",
};

interface Meeting {
  id: number;
  created_at: string;
  meeting_type: string;
  title: string;
  meeting_date: string;
  meeting_time: string | null;
  venue: string | null;
  virtual_link: string | null;
  agenda: string | null;
  presiding_officer: string | null;
  status: string;
  minutes: string | null;
  published: boolean;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/meetings")
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setMeetings(arr.filter((m: Meeting) => m.published));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load meetings.");
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const upcoming = meetings
    .filter((m) => new Date(m.meeting_date) >= now && m.status !== "cancelled")
    .sort((a, b) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime());
  const past = meetings
    .filter((m) => new Date(m.meeting_date) < now || m.status === "completed")
    .sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime());

  const statusBadge = (status: string) => {
    const s: Record<string, string> = {
      scheduled: "bg-blue-900/60 text-blue-300",
      completed: "bg-emerald-900/60 text-emerald-300",
      cancelled: "bg-red-900/60 text-red-300",
      in_progress: "bg-amber-900/60 text-amber-300",
    };
    return (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${s[status] ?? "bg-neutral-800 text-neutral-300"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Back */}
          <div>
            <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
              </svg>
              Back to Home
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Article IV — Rules & Procedures
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffec3a] via-[#ffd700] to-[#ffa100] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Meetings & Minutes
            </h1>
          </div>

          {/* Intro */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Society convenes monthly through Society Assembly Meetings, High Council
              meetings, Council of House Chancellors sessions, and House Assemblies.
              Meeting notices, agendas, and minutes are published transparently in
              accordance with Article IV, Section 3.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article IV
            </p>
          </article>

          {loading && <p className="text-center text-neutral-500">Loading meetings…</p>}
          {error && (
            <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-center text-sm text-red-400">{error}</div>
          )}

          {/* Upcoming */}
          {!loading && upcoming.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Upcoming Meetings</h2>
              {upcoming.map((m) => (
                <article key={m.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{m.title}</h3>
                        {statusBadge(m.status)}
                      </div>
                      <p className="text-sm text-neutral-400">
                        {TYPE_LABELS[m.meeting_type] ?? m.meeting_type}
                      </p>
                    </div>
                    <button
                      onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                      className="rounded-full border border-neutral-700 px-4 py-1.5 text-xs font-medium text-neutral-400 transition hover:text-white"
                    >
                      {expanded === m.id ? "Collapse" : "Details"}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-400">
                    <p>
                      📅 {new Date(m.meeting_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    {m.meeting_time && <p>🕐 {m.meeting_time}</p>}
                    {m.venue && <p>📍 {m.venue}</p>}
                    {m.presiding_officer && <p>👤 Presiding: {m.presiding_officer}</p>}
                  </div>
                  {expanded === m.id && m.agenda && (
                    <div className="mt-4 border-t border-neutral-800 pt-4">
                      <p className="text-xs font-medium text-neutral-400">Agenda</p>
                      <p className="mt-2 text-sm whitespace-pre-wrap leading-7 text-neutral-300">{m.agenda}</p>
                    </div>
                  )}
                  {expanded === m.id && m.virtual_link && (
                    <div className="mt-3">
                      <a href={m.virtual_link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-400 underline underline-offset-4 transition hover:text-blue-300">
                        Join Meeting →
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {/* Past Meetings / Minutes */}
          {!loading && past.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Past Meetings & Minutes</h2>
              {past.map((m) => (
                <article key={m.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{m.title}</h3>
                        {statusBadge(m.status)}
                      </div>
                      <p className="text-sm text-neutral-400">
                        {TYPE_LABELS[m.meeting_type] ?? m.meeting_type} · {new Date(m.meeting_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <button
                      onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                      className="rounded-full border border-neutral-700 px-4 py-1.5 text-xs font-medium text-neutral-400 transition hover:text-white"
                    >
                      {expanded === m.id ? "Collapse" : "Details"}
                    </button>
                  </div>
                  {expanded === m.id && (
                    <div className="mt-4 space-y-3 border-t border-neutral-800 pt-4">
                      {m.agenda && (
                        <div>
                          <p className="text-xs font-medium text-neutral-400">Agenda</p>
                          <p className="mt-1 text-sm whitespace-pre-wrap leading-7 text-neutral-300">{m.agenda}</p>
                        </div>
                      )}
                      {m.minutes ? (
                        <div>
                          <p className="text-xs font-medium text-emerald-400">Minutes</p>
                          <p className="mt-1 text-sm whitespace-pre-wrap leading-7 text-neutral-300">{m.minutes}</p>
                        </div>
                      ) : (
                        <p className="text-xs italic text-neutral-600">Minutes not yet published.</p>
                      )}
                      {m.presiding_officer && <p className="text-xs text-neutral-500">Presided by: {m.presiding_officer}</p>}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {!loading && upcoming.length === 0 && past.length === 0 && (
            <p className="text-center text-sm text-neutral-500">No meetings scheduled or recorded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
