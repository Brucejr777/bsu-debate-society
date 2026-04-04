"use client";

import { useState } from "react";

const STATUS_OPTIONS = ["filed", "under_review", "hearing_scheduled", "resolved_minor", "resolved_major", "dismissed", "appealed"];
const STATUS_LABELS: Record<string, string> = {
  filed: "Filed",
  under_review: "Under Review",
  hearing_scheduled: "Hearing Scheduled",
  resolved_minor: "Resolved (Minor)",
  resolved_major: "Resolved (Major)",
  dismissed: "Dismissed",
  appealed: "Appealed",
};

const VIOLATION_TYPES = ["Minor Violation", "Major Violation"];

const HOUSE_LABELS: Record<string, string> = {
  Bathala: "House of Bathala",
  Kabunian: "House of Kabunian",
  Laon: "House of Laon",
  Manama: "House of Manama",
};

interface Complaint {
  id: number;
  created_at: string;
  complainant_name: string;
  complainant_house: string;
  respondent_name: string;
  respondent_house: string;
  incident_date: string;
  incident_time: string | null;
  incident_location: string;
  violation_type: string;
  provisions_violated: string | null;
  description: string;
  evidence_summary: string | null;
  witnesses: string | null;
  status: string;
  notes: string | null;
  sanction: string | null;
}

export default function AdminDisciplinePage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editSanction, setEditSanction] = useState("");

  async function fetchComplaints() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/discipline");
    if (!res.ok) {
      setError("Failed to fetch complaints.");
      setLoading(false);
      return;
    }
    setComplaints(await res.json());
    setLoaded(true);
    setLoading(false);
  }

  function flash(msg: string) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function updateStatus() {
    if (!selected) return;
    const res = await fetch("/api/admin/discipline", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selected.id,
        status: editingStatus,
        notes: editNotes || selected.notes,
        sanction: editSanction || selected.sanction,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to update.");
      return;
    }
    flash("Complaint updated.");
    await fetchComplaints();
    setSelected(null);
  }

  const statusBadge = (status: string) => {
    const s: Record<string, string> = {
      filed: "bg-blue-900/60 text-blue-300",
      under_review: "bg-amber-900/60 text-amber-300",
      hearing_scheduled: "bg-purple-900/60 text-purple-300",
      resolved_minor: "bg-emerald-900/60 text-emerald-300",
      resolved_major: "bg-emerald-900/60 text-emerald-300",
      dismissed: "bg-neutral-800 text-neutral-400",
      appealed: "bg-orange-900/60 text-orange-300",
    };
    return (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${s[status] ?? "bg-neutral-800 text-neutral-300"}`}>
        {STATUS_LABELS[status] ?? status}
      </span>
    );
  };

  const inputCls =
    "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const selectCls = inputCls;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Disciplinary Case Tracker
        </h1>
        <p className="text-sm text-neutral-400">
          Manage complaints, hearings, and sanctions per Article VI — Disciplinary
          Procedures and Due Process Implementation.
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {actionMsg && (
        <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">
          {actionMsg}
        </div>
      )}

      {/* Load Button */}
      {!loaded && (
        <button
          onClick={fetchComplaints}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Cases"}
        </button>
      )}

      {/* Cases List */}
      {loaded && complaints.length === 0 && (
        <p className="text-sm text-neutral-500">No complaints filed.</p>
      )}

      {loaded && complaints.length > 0 && (
        <div className="space-y-3">
          {complaints.map((c) => (
            <article
              key={c.id}
              className="cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-neutral-700"
              onClick={() => {
                setSelected(c);
                setEditingStatus(c.status);
                setEditNotes(c.notes ?? "");
                setEditSanction(c.sanction ?? "");
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{c.respondent_name}</h3>
                    {statusBadge(c.status)}
                    <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
                      {c.violation_type}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">
                    Reported by {c.complainant_name} ({HOUSE_LABELS[c.complainant_house]})
                    · Incident: {c.incident_date}
                  </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-neutral-600">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div className="space-y-6 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold text-white">Case Details</h2>
            <button
              onClick={() => setSelected(null)}
              className="rounded-lg p-1 text-neutral-500 transition hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          {/* Case Info Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-neutral-500">Respondent</p>
              <p className="text-sm font-medium text-white">{selected.respondent_name} ({HOUSE_LABELS[selected.respondent_house]})</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Complainant</p>
              <p className="text-sm font-medium text-white">{selected.complainant_name} ({HOUSE_LABELS[selected.complainant_house]})</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Incident</p>
              <p className="text-sm text-neutral-300">{selected.incident_date} {selected.incident_time ? `at ${selected.incident_time}` : ""} — {selected.incident_location}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Violation</p>
              <p className="text-sm text-neutral-300">{selected.violation_type}{selected.provisions_violated ? ` — ${selected.provisions_violated}` : ""}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-neutral-500">Description</p>
            <p className="mt-1 text-sm leading-7 text-neutral-300">{selected.description}</p>
          </div>

          {selected.evidence_summary && (
            <div>
              <p className="text-xs text-neutral-500">Evidence</p>
              <p className="mt-1 text-sm text-neutral-300">{selected.evidence_summary}</p>
            </div>
          )}

          {selected.witnesses && (
            <div>
              <p className="text-xs text-neutral-500">Witnesses</p>
              <p className="mt-1 text-sm text-neutral-300">{selected.witnesses}</p>
            </div>
          )}

          {/* Update Status */}
          <div className="space-y-3 border-t border-neutral-800 pt-6">
            <h3 className="text-lg font-medium text-white">Update Case Status</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Status</label>
                <select value={editingStatus} onChange={(e) => setEditingStatus(e.target.value)} className={selectCls}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Sanction / Outcome</label>
                <input value={editSanction} onChange={(e) => setEditSanction(e.target.value)} placeholder="e.g. Written warning, 10 hrs community service" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Internal Notes</label>
                <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} placeholder="Case notes…" className={inputCls + " resize-none"} />
              </div>
            </div>
            <button onClick={updateStatus} className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200">
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
