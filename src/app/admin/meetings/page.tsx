"use client";

import { useState, type FormEvent } from "react";

const MEETING_TYPES = [
  { value: "society_assembly", label: "Society Assembly" },
  { value: "high_council", label: "High Council" },
  { value: "chancellors_council", label: "Council of House Chancellors" },
  { value: "house_assembly", label: "House Assembly" },
  { value: "special", label: "Special Meeting" },
];

const STATUS_OPTIONS = ["scheduled", "in_progress", "completed", "cancelled"];

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

const TYPE_LABELS: Record<string, string> = {};
MEETING_TYPES.forEach((t) => (TYPE_LABELS[t.value] = t.label));

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);

  async function fetchMeetings() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/meetings");
    if (!res.ok) { setError("Failed to fetch meetings."); setLoading(false); return; }
    const data = await res.json();
    setMeetings(Array.isArray(data) ? data : []);
    setLoaded(true);
    setLoading(false);
  }

  function flash(msg: string) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const body = {
      meeting_type: fd.get("meeting_type") as string,
      title: fd.get("title") as string,
      meeting_date: fd.get("meeting_date") as string,
      meeting_time: (fd.get("meeting_time") as string) || null,
      venue: (fd.get("venue") as string) || null,
      virtual_link: (fd.get("virtual_link") as string) || null,
      agenda: (fd.get("agenda") as string) || null,
      presiding_officer: (fd.get("presiding_officer") as string) || null,
      status: fd.get("status") as string,
      minutes: (fd.get("minutes") as string) || null,
      published: fd.get("published") === "on",
    };

    const res = editing
      ? await fetch("/api/meetings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...body }) })
      : await fetch("/api/meetings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

    if (!res.ok) { const err = await res.json(); setError(err.error ?? "Failed."); return; }

    flash(editing ? "Meeting updated." : "Meeting scheduled.");
    setShowForm(false);
    setEditing(null);
    await fetchMeetings();
  }

  async function deleteMeeting(id: number) {
    const res = await fetch("/api/meetings", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (!res.ok) { const err = await res.json(); setError(err.error ?? "Failed."); return; }
    flash("Meeting deleted.");
    await fetchMeetings();
  }

  const inputCls = "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const btnPrimary = "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnDanger = "rounded-full bg-red-800/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-700";
  const btnEdit = "rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";

  const statusBadge = (status: string) => {
    const s: Record<string, string> = {
      scheduled: "bg-blue-900/60 text-blue-300",
      completed: "bg-emerald-900/60 text-emerald-300",
      cancelled: "bg-red-900/60 text-red-300",
      in_progress: "bg-amber-900/60 text-amber-300",
    };
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${s[status] ?? "bg-neutral-800 text-neutral-300"}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Meetings & Minutes</h1>
        <p className="text-sm text-neutral-400">
          Schedule meetings, publish agendas, and post minutes per Article IV.
        </p>
      </div>

      {/* Feedback */}
      {error && <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</div>}
      {actionMsg && <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">{actionMsg}</div>}

      {/* Load / Add */}
      {!loaded && <button onClick={fetchMeetings} disabled={loading} className={btnPrimary}>{loading ? "Loading…" : "Load Meetings"}</button>}
      {loaded && <button onClick={() => { setShowForm(true); setEditing(null); }} className={btnPrimary}>+ Schedule Meeting</button>}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-950/95 p-6">
          <h3 className="text-lg font-medium text-white">{editing ? "Edit Meeting" : "Schedule Meeting"}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Meeting Type</label>
              <select name="meeting_type" defaultValue={editing?.meeting_type ?? MEETING_TYPES[0].value} className={inputCls}>
                {MEETING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" defaultValue={editing?.status ?? "scheduled"} className={inputCls}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Title</label>
              <input name="title" required placeholder="e.g. Monthly Society Assembly — March 2026" defaultValue={editing?.title ?? ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input name="meeting_date" type="date" required defaultValue={editing?.meeting_date ?? ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Time</label>
              <input name="meeting_time" type="time" defaultValue={editing?.meeting_time ?? ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Venue</label>
              <input name="venue" placeholder="e.g. BSU Main Campus, Room 204" defaultValue={editing?.venue ?? ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Virtual Link (optional)</label>
              <input name="virtual_link" placeholder="https://meet.google.com/..." defaultValue={editing?.virtual_link ?? ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Presiding Officer</label>
              <input name="presiding_officer" placeholder="e.g. President, House Chancellor" defaultValue={editing?.presiding_officer ?? ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Published</label>
              <div className="mt-2 flex items-center gap-2">
                <input type="checkbox" name="published" defaultChecked={editing?.published ?? true} className="size-4 rounded border-neutral-600 bg-neutral-800" />
                <span className="text-sm text-neutral-400">Visible on public page</span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Agenda</label>
              <textarea name="agenda" rows={4} placeholder={"1. Call to order\n2. President's report\n3. House point standings\n4. Open forum\n5. Adjournment"} defaultValue={editing?.agenda ?? ""} className={inputCls + " resize-none"} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Minutes (post-meeting)</label>
              <textarea name="minutes" rows={5} placeholder="Meeting minutes summary..." defaultValue={editing?.minutes ?? ""} className={inputCls + " resize-none"} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className={btnPrimary}>{editing ? "Update" : "Schedule"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white">Cancel</button>
          </div>
        </form>
      )}

      {/* Meetings List */}
      {loaded && meetings.length === 0 && <p className="text-sm text-neutral-500">No meetings scheduled.</p>}
      {loaded && meetings.length > 0 && (
        <div className="space-y-3">
          {meetings.sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime()).map((m) => (
            <article key={m.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{m.title}</h3>
                    {statusBadge(m.status)}
                  </div>
                  <p className="text-sm text-neutral-400">
                    {TYPE_LABELS[m.meeting_type] ?? m.meeting_type} · {new Date(m.meeting_date).toLocaleDateString()}
                    {m.meeting_time ? ` at ${m.meeting_time}` : ""}
                    {m.venue ? ` — ${m.venue}` : ""}
                  </p>
                  {m.minutes && <p className="text-xs text-emerald-400">✓ Minutes published</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(m); setShowForm(true); }} className={btnEdit}>Edit</button>
                  <button onClick={() => deleteMeeting(m.id)} className={btnDanger}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
