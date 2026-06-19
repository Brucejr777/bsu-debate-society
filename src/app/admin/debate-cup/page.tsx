// src/app/admin/debate-cup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RBAC, Role } from "@/lib/rbac";

interface Officer {
  id: string;
  email: string;
  full_name: string;
  role: string;
  house_affiliation: string;
}

const HOUSES = ["Bathala", "Kabunian", "Laon", "Manama"];
const HOUSE_LABELS: Record<string, string> = {
  Bathala: "House of Bathala",
  Kabunian: "House of Kabunian",
  Laon: "House of Laon",
  Manama: "House of Manama",
};
const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

const STATUS_OPTIONS = ["scheduled", "in_progress", "completed", "cancelled", "postponed"];
const STATUS_BADGE: Record<string, string> = {
  scheduled: "bg-blue-900/60 text-blue-300",
  in_progress: "bg-amber-900/60 text-amber-300",
  completed: "bg-emerald-900/60 text-emerald-300",
  cancelled: "bg-red-900/60 text-red-300",
  postponed: "bg-neutral-800 text-neutral-400",
};

interface Match {
  id: number;
  created_at: string;
  semester: string;
  round_number: number;
  match_date: string | null;
  match_time: string | null;
  venue: string | null;
  virtual_link: string | null;
  house_a: string;
  house_b: string;
  motion: string | null;
  status: string;
  published: boolean;
}

const emptyForm = {
  semester: "",
  round_number: "1",
  match_date: "",
  match_time: "",
  venue: "",
  virtual_link: "",
  house_a: HOUSES[0],
  house_b: HOUSES[1],
  motion: "",
  status: "scheduled",
  published: false,
};

export default function AdminDebateCupPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 1. Fetch current officer profile for RBAC
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  // 2. Determine if user can manage Debate Cup records
  const canManage = officer
    ? RBAC.canAccessAdminRoute(officer.role as Role, "/admin/debate-cup")
    : false;

  async function fetchMatches() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/debate-cup");
      if (!res.ok) throw new Error("Failed to fetch matches.");
      const data = await res.json();
      setMatches(data);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to load Debate Cup matches.");
    } finally {
      setLoading(false);
    }
  }

  async function submitMatch(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      semester: form.semester,
      round_number: parseInt(form.round_number, 10) || 1,
      match_date: form.match_date || null,
      match_time: form.match_time || null,
      venue: form.venue || null,
      virtual_link: form.virtual_link || null,
      house_a: form.house_a,
      house_b: form.house_b,
      motion: form.motion || null,
      status: form.status,
      published: form.published,
    };

    const previousMatches = [...matches];
    const tempId = editingId ?? Date.now();
    
    setMatches((prev) =>
      editingId
        ? prev.map((m) => (m.id === editingId ? { ...m, ...body } : m))
        : [{ id: tempId, created_at: new Date().toISOString(), ...body }, ...prev]
    );

    try {
      const res = editingId
        ? await fetch("/api/admin/debate-cup", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, ...body }),
          })
        : await fetch("/api/admin/debate-cup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save.");
      }
      const data = await res.json();
      
      setMatches((prev) =>
        editingId
          ? prev.map((m) => (m.id === editingId ? data : m))
          : prev.map((m) => (m.id === tempId ? data : m))
      );
      toast.success(editingId ? "Match updated." : "Match scheduled.");
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      setMatches(previousMatches);
      toast.error(err.message || "Failed to save match.");
    }
  }

  async function deleteMatch(id: number) {
    if (!confirm("Are you sure you want to delete this match?")) return;
    const previousMatches = [...matches];
    setMatches((prev) => prev.filter((m) => m.id !== id));

    try {
      const res = await fetch("/api/admin/debate-cup", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Match deleted.");
    } catch (err) {
      setMatches(previousMatches);
      toast.error("Failed to delete match.");
    }
  }

  async function togglePublished(id: number, current: boolean) {
    const previousMatches = [...matches];
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, published: !current } : m)));

    try {
      const res = await fetch("/api/admin/debate-cup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, published: !current }),
      });
      if (!res.ok) throw new Error("Failed to update.");
      const data = await res.json();
      setMatches((prev) => prev.map((m) => (m.id === id ? data : m)));
      toast.success(`Match ${!current ? "published" : "unpublished"}.`);
    } catch (err) {
      setMatches(previousMatches);
      toast.error("Failed to update match.");
    }
  }

  function startEdit(m: Match) {
    setEditingId(m.id);
    setForm({
      semester: m.semester,
      round_number: m.round_number.toString(),
      match_date: m.match_date ? m.match_date.split("T")[0] : "",
      match_time: m.match_time || "",
      venue: m.venue || "",
      virtual_link: m.virtual_link || "",
      house_a: m.house_a,
      house_b: m.house_b,
      motion: m.motion || "",
      status: m.status,
      published: m.published,
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  const updateForm = (field: string, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const inputCls = "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const btnPrimary = "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnSecondary = "rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white";
  const btnDanger = "rounded-full bg-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900";
  const btnEdit = "rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";

  // Group matches by round for better UI
  const groupedMatches = matches.reduce((acc, m) => {
    const key = `Round ${m.round_number}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {} as Record<string, Match[]>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Inter-House Debate Cup</h1>
        <p className="text-sm text-neutral-400">
          Schedule and manage Debate Cup matches per Article I, Section 10. 
          Published matches are visible on the public Debate Cup page.
        </p>
      </div>

      {/* View Only Notice for Unauthorized Roles */}
      {!canManage && officer && (
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-300/80">
            <strong className="text-amber-200">View Only:</strong> Per the Society Constitution and Rules, 
            only the <strong className="text-white">High Council and House Chancellors</strong> can manage 
            Debate Cup schedules. You may view the matches for transparency purposes.
          </p>
        </div>
      )}

      {/* Load / Add Buttons */}
      <div className="flex gap-2">
        {!fetched && (
          <button onClick={fetchMatches} disabled={loading} className={btnPrimary}>
            {loading ? "Loading…" : "Load Matches"}
          </button>
        )}
        {fetched && !showForm && canManage && (
          <button onClick={startNew} className={btnPrimary}>
            + Schedule Match
          </button>
        )}
      </div>

      {/* Form (Protected) */}
      {showForm && canManage && (
        <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-white">
            {editingId ? "Edit Match" : "Schedule New Match"}
          </h2>
          <form onSubmit={submitMatch} className="mx-auto max-w-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Semester</label>
                <input value={form.semester} onChange={(e) => updateForm("semester", e.target.value)} required placeholder="2026-2027 Second Semester" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Round Number</label>
                <input type="number" min="1" value={form.round_number} onChange={(e) => updateForm("round_number", e.target.value)} required className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>House A</label>
                <select value={form.house_a} onChange={(e) => updateForm("house_a", e.target.value)} className={inputCls}>
                  {HOUSES.map((h) => <option key={h} value={h}>{HOUSE_LABELS[h]}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>House B</label>
                <select value={form.house_b} onChange={(e) => updateForm("house_b", e.target.value)} className={inputCls}>
                  {HOUSES.filter(h => h !== form.house_a).map((h) => <option key={h} value={h}>{HOUSE_LABELS[h]}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" value={form.match_date} onChange={(e) => updateForm("match_date", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input type="time" value={form.match_time} onChange={(e) => updateForm("match_time", e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Motion</label>
              <input value={form.motion} onChange={(e) => updateForm("motion", e.target.value)} placeholder="e.g. This House believes that..." className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Venue</label>
                <input value={form.venue} onChange={(e) => updateForm("venue", e.target.value)} placeholder="e.g. BSU Main Auditorium" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Virtual Link</label>
                <input value={form.virtual_link} onChange={(e) => updateForm("virtual_link", e.target.value)} placeholder="https://zoom.us/..." className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.status} onChange={(e) => updateForm("status", e.target.value)} className={inputCls}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="form_pub" checked={form.published} onChange={(e) => updateForm("published", e.target.checked)} className="size-4 rounded border-neutral-600 bg-neutral-800 accent-neutral-500" />
                  <label htmlFor="form_pub" className="text-sm text-neutral-300">Publish to public</label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className={btnPrimary}>{editingId ? "Update" : "Schedule"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className={btnSecondary}>Cancel</button>
            </div>
          </form>
        </article>
      )}

      {/* Empty State */}
      {fetched && matches.length === 0 && (
        <p className="text-sm text-neutral-500">No matches scheduled yet.</p>
      )}

      {/* Matches List (Grouped by Round) */}
      {fetched && matches.length > 0 && (
        <div className="space-y-8">
          {Object.entries(groupedMatches).map(([round, roundMatches]) => (
            <div key={round} className="space-y-3">
              <h2 className="text-lg font-semibold text-neutral-200 border-b border-neutral-800 pb-2">{round}</h2>
              {roundMatches.map((m) => {
                const colorA = HOUSE_COLORS[m.house_a] ?? "#666";
                const colorB = HOUSE_COLORS[m.house_b] ?? "#666";
                return (
                  <article key={m.id} className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-5 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: colorA }}>
                          {m.house_a[0]}
                        </div>
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">VS</span>
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: colorB }}>
                          {m.house_b[0]}
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-semibold text-white">
                            {HOUSE_LABELS[m.house_a]?.replace("House of ", "")} vs {HOUSE_LABELS[m.house_b]?.replace("House of ", "")}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {m.match_date ? new Date(m.match_date).toLocaleDateString() : "TBD"}
                            {m.match_time && ` at ${m.match_time}`}
                            {m.venue && ` • ${m.venue}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${STATUS_BADGE[m.status] ?? "bg-neutral-800 text-neutral-300"}`}>
                          {m.status.replace(/_/g, " ")}
                        </span>
                        {m.published && (
                          <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">published</span>
                        )}
                        
                        {/* Action Buttons (RBAC Protected) */}
                        {canManage && (
                          <>
                            <button onClick={() => startEdit(m)} className={btnEdit}>Edit</button>
                            <button onClick={() => togglePublished(m.id, m.published)} className={btnEdit}>
                              {m.published ? "Unpublish" : "Publish"}
                            </button>
                            <button onClick={() => deleteMatch(m.id)} className={btnDanger}>Delete</button>
                          </>
                        )}
                      </div>
                    </div>
                    {m.motion && (
                      <p className="mt-3 text-sm italic text-neutral-400 border-t border-neutral-800 pt-3">
                        Motion: {m.motion}
                      </p>
                    )}
                    {m.virtual_link && (
                      <a href={m.virtual_link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-blue-400 hover:text-blue-300 underline">
                        Join Virtual Meeting →
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}