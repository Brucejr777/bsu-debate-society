// src/app/admin/meetings/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { RBAC, Role, isHouseChancellor, getHouseFromRole } from "@/lib/rbac";

interface Officer {
  id: string;
  email: string;
  full_name: string;
  role: string;
  house_affiliation: string;
}

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

const MEETING_TYPES = [
  { value: "society_assembly", label: "Society Assembly" },
  { value: "high_council", label: "High Council Meeting" },
  { value: "house_assembly", label: "House Assembly" },
  { value: "committee", label: "Committee Meeting" },
];

const STATUS_OPTIONS = ["scheduled", "in_progress", "completed", "cancelled", "postponed"];
const STATUS_BADGE: Record<string, string> = {
  scheduled: "bg-blue-900/60 text-blue-300",
  in_progress: "bg-amber-900/60 text-amber-300",
  completed: "bg-emerald-900/60 text-emerald-300",
  cancelled: "bg-red-900/60 text-red-300",
  postponed: "bg-neutral-800 text-neutral-400",
};

const TYPE_BADGE: Record<string, string> = {
  society_assembly: "bg-purple-900/60 text-purple-300",
  high_council: "bg-sky-900/60 text-sky-300",
  house_assembly: "bg-emerald-900/60 text-emerald-300",
  committee: "bg-neutral-800 text-neutral-300",
};

const emptyForm = {
  meeting_type: "society_assembly",
  title: "",
  meeting_date: "",
  meeting_time: "",
  venue: "",
  virtual_link: "",
  agenda: "",
  presiding_officer: "",
  status: "scheduled",
  minutes: "",
  published: false,
};

export default function AdminMeetingsPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  const canManage = officer ? RBAC.canAccessAdminRoute(officer.role as Role, "/admin/meetings") : false;
  const isChancellor = officer ? isHouseChancellor(officer.role as Role) : false;
  const userHouse = officer ? getHouseFromRole(officer.role as Role) : null;

  async function fetchMeetings() {
    setLoading(true);
    try {
      const res = await fetch("/api/meetings");
      if (!res.ok) throw new Error("Failed to fetch meetings.");
      const data = await res.json();
      setMeetings(data);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to load meetings.");
    } finally {
      setLoading(false);
    }
  }

  async function submitMeeting(e: FormEvent) {
    e.preventDefault();
    const body = {
      meeting_type: form.meeting_type,
      title: form.title,
      meeting_date: form.meeting_date,
      meeting_time: form.meeting_time || null,
      venue: form.venue || null,
      virtual_link: form.virtual_link || null,
      agenda: form.agenda || null,
      presiding_officer: form.presiding_officer || null,
      status: form.status,
      minutes: form.minutes || null,
      published: form.published,
    };

    const previousMeetings = [...meetings];
    const tempId = editingId ?? Date.now();
    
    setMeetings((prev) =>
      editingId
        ? prev.map((m) => (m.id === editingId ? { ...m, ...body } : m))
        : [{ id: tempId, created_at: new Date().toISOString(), ...body }, ...prev]
    );

    try {
      const res = editingId
        ? await fetch("/api/meetings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, ...body }),
          })
        : await fetch("/api/meetings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save.");
      }
      const data = await res.json();
      
      setMeetings((prev) =>
        editingId
          ? prev.map((m) => (m.id === editingId ? data : m))
          : prev.map((m) => (m.id === tempId ? data : m))
      );
      toast.success(editingId ? "Meeting updated." : "Meeting scheduled.");
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      setMeetings(previousMeetings);
      toast.error(err.message || "Failed to save meeting.");
    }
  }

  async function deleteMeeting(id: number) {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    const previousMeetings = [...meetings];
    setMeetings((prev) => prev.filter((m) => m.id !== id));

    try {
      const res = await fetch("/api/meetings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Meeting deleted.");
    } catch (err) {
      setMeetings(previousMeetings);
      toast.error("Failed to delete meeting.");
    }
  }

  async function togglePublished(id: number, current: boolean) {
    const previousMeetings = [...meetings];
    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, published: !current } : m)));

    try {
      const res = await fetch("/api/meetings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, published: !current }),
      });
      if (!res.ok) throw new Error("Failed to update.");
      const data = await res.json();
      setMeetings((prev) => prev.map((m) => (m.id === id ? data : m)));
      toast.success(`Meeting ${!current ? "published" : "unpublished"}.`);
    } catch (err) {
      setMeetings(previousMeetings);
      toast.error("Failed to update meeting.");
    }
  }

  function startEdit(m: Meeting) {
    setEditingId(m.id);
    setForm({
      meeting_type: m.meeting_type,
      title: m.title,
      meeting_date: m.meeting_date ? m.meeting_date.split("T")[0] : "",
      meeting_time: m.meeting_time || "",
      venue: m.venue || "",
      virtual_link: m.virtual_link || "",
      agenda: m.agenda || "",
      presiding_officer: m.presiding_officer || "",
      status: m.status,
      minutes: m.minutes || "",
      published: m.published,
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      // If Chancellor, lock to house_assembly
      meeting_type: isChancellor ? "house_assembly" : "society_assembly",
    });
    setShowForm(true);
  }

  const updateForm = (field: string, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  // Check if the current officer can manage this specific meeting
  function canManageMeeting(m: Meeting) {
    if (!canManage) return false;
    // House Chancellors can only manage House Assemblies
    if (isChancellor && m.meeting_type !== "house_assembly") return false;
    return true;
  }

  const inputCls = "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const btnPrimary = "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnSecondary = "rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white";
  const btnDanger = "rounded-full bg-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900";
  const btnEdit = "rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Meeting Management</h1>
        <p className="text-sm text-neutral-400">
          Schedule and manage Society, High Council, and House Assembly meetings per Article 7.
        </p>
      </div>

      {/* Jurisdiction Notice for House Chancellors */}
      {isChancellor && userHouse && (
        <article className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-5 shrink-0 text-amber-400">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.75.75 0 01.714.544l.126.5a.75.75 0 01-.714.956H9a.75.75 0 000 1.5h.253a.75.75 0 01.714.544l.126.5a.75.75 0 01-.714.956H9a.75.75 0 000 1.5h.253a.75.75 0 01.714.544l.126.5a.75.75 0 01-.714.956H9a.75.75 0 000 1.5" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-amber-200">House-Level Jurisdiction Active</h3>
              <p className="mt-1 text-xs leading-5 text-amber-300/80">
                As the Chancellor of the <strong className="text-white">House of {userHouse}</strong>, you can only schedule and manage 
                <strong className="text-white"> House Assembly</strong> meetings. Society-wide and High Council meetings are managed by the Executive Secretary and High Council.
              </p>
            </div>
          </div>
        </article>
      )}

      {/* View Only Notice for Unauthorized Roles */}
      {!canManage && officer && (
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-300/80">
            <strong className="text-amber-200">View Only:</strong> You do not have permission to manage meetings.
          </p>
        </div>
      )}

      {/* Load / Add Buttons */}
      <div className="flex gap-2">
        {!fetched && (
          <button onClick={fetchMeetings} disabled={loading} className={btnPrimary}>
            {loading ? "Loading…" : "Load Meetings"}
          </button>
        )}
        {fetched && !showForm && canManage && (
          <button onClick={startNew} className={btnPrimary}>
            + Schedule Meeting
          </button>
        )}
      </div>

      {/* Form (Protected & Contextualized) */}
      {showForm && canManage && (
        <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-white">
            {editingId ? "Edit Meeting" : "Schedule New Meeting"}
          </h2>
          <form onSubmit={submitMeeting} className="mx-auto max-w-xl space-y-4">
            <div>
              <label className={labelCls}>Meeting Type</label>
              {isChancellor ? (
                <input type="text" value="House Assembly" readOnly className={inputCls + " opacity-70 cursor-not-allowed"} />
              ) : (
                <select value={form.meeting_type} onChange={(e) => updateForm("meeting_type", e.target.value)} className={inputCls}>
                  {MEETING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className={labelCls}>Title</label>
              <input value={form.title} onChange={(e) => updateForm("title", e.target.value)} required placeholder="e.g. General Society Assembly" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" value={form.meeting_date} onChange={(e) => updateForm("meeting_date", e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input type="time" value={form.meeting_time} onChange={(e) => updateForm("meeting_time", e.target.value)} className={inputCls} />
              </div>
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
            <div>
              <label className={labelCls}>Presiding Officer</label>
              <input value={form.presiding_officer} onChange={(e) => updateForm("presiding_officer", e.target.value)} placeholder="e.g. Society President" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Agenda</label>
              <textarea value={form.agenda} onChange={(e) => updateForm("agenda", e.target.value)} rows={3} placeholder="1. Call to order..." className={inputCls} />
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
            {editingId && (
              <div>
                <label className={labelCls}>Meeting Minutes</label>
                <textarea value={form.minutes} onChange={(e) => updateForm("minutes", e.target.value)} rows={4} placeholder="Paste or type meeting minutes here..." className={inputCls} />
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="submit" className={btnPrimary}>{editingId ? "Update" : "Schedule"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className={btnSecondary}>Cancel</button>
            </div>
          </form>
        </article>
      )}

      {/* Empty State */}
      {fetched && meetings.length === 0 && (
        <p className="text-sm text-neutral-500">No meetings scheduled yet.</p>
      )}

      {/* Meetings List */}
      {fetched && meetings.length > 0 && (
        <div className="space-y-4">
          {meetings.map((m) => {
            const canEdit = canManageMeeting(m);
            return (
              <article key={m.id} className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{m.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${TYPE_BADGE[m.meeting_type] ?? "bg-neutral-800 text-neutral-300"}`}>
                        {m.meeting_type.replace(/_/g, " ")}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${STATUS_BADGE[m.status] ?? "bg-neutral-800 text-neutral-300"}`}>
                        {m.status.replace(/_/g, " ")}
                      </span>
                      {m.published && (
                        <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">published</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-400">
                      {new Date(m.meeting_date).toLocaleDateString()}
                      {m.meeting_time && ` at ${m.meeting_time}`}
                      {m.venue && ` • ${m.venue}`}
                    </p>
                    {m.presiding_officer && (
                      <p className="text-xs text-neutral-500">Presiding: {m.presiding_officer}</p>
                    )}
                  </div>
                  
                  {/* Action Buttons (RBAC Protected) */}
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(m)} className={btnEdit}>Edit</button>
                      <button onClick={() => togglePublished(m.id, m.published)} className={btnEdit}>
                        {m.published ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => deleteMeeting(m.id)} className={btnDanger}>Delete</button>
                    </div>
                  )}
                </div>
                
                {m.agenda && (
                  <div className="mt-4 border-t border-neutral-800 pt-4">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Agenda</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-300">{m.agenda}</p>
                  </div>
                )}
                
                {m.minutes && (
                  <div className="mt-4 border-t border-neutral-800 pt-4">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Minutes</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-300">{m.minutes}</p>
                  </div>
                )}

                {m.virtual_link && (
                  <a href={m.virtual_link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs text-blue-400 hover:text-blue-300 underline">
                    Join Virtual Meeting →
                  </a>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}