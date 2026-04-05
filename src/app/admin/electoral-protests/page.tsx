"use client";

import { useState } from "react";

interface Protest {
  id: number;
  created_at: string;
  protestant_name: string;
  protestant_house: string;
  protestant_email: string | null;
  protest_ground: string;
  specific_violations: string;
  evidence_summary: string;
  requested_relief: string;
  witnesses: string | null;
  proclamation_date: string;
  filed_within_deadline: boolean;
  status: string;
  tribunal_notes: string | null;
  verdict: string | null;
  verdict_date: string | null;
  presiding_authority: string | null;
  election_nullified: boolean | null;
  new_conclave_scheduled: string | null;
}

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

const GROUND_LABELS: Record<string, string> = {
  procedural_violation: "Procedural Violation",
  vote_tampering: "Vote Tampering",
  eligibility_issues: "Eligibility Issues",
};

const STATUS_BADGE: Record<string, string> = {
  filed: "bg-amber-900/60 text-amber-300",
  under_review: "bg-blue-900/60 text-blue-300",
  hearing_scheduled: "bg-purple-900/60 text-purple-300",
  resolved_upheld: "bg-emerald-900/60 text-emerald-300",
  resolved_dismiss: "bg-neutral-800 text-neutral-300",
  election_nullified: "bg-red-900/60 text-red-300",
};

export default function AdminElectoralProtestsPage() {
  const [protests, setProtests] = useState<Protest[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [verdict, setVerdict] = useState<Record<number, string>>({});
  const [presiding, setPresiding] = useState<Record<number, string>>({});

  async function fetchProtests() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/electoral-protests");
    if (!res.ok) {
      setError("Failed to fetch protests.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setProtests(data);
    setFetched(true);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string, extras: Record<string, unknown> = {}) {
    const note = notes[id] ?? null;
    const v = verdict[id] ?? null;
    const p = presiding[id] ?? null;
    const res = await fetch("/api/admin/electoral-protests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status,
        tribunal_notes: note,
        verdict: v,
        verdict_date: v ? new Date().toISOString() : undefined,
        presiding_authority: p,
        ...extras,
      }),
    });
    if (!res.ok) {
      setActionMsg("Failed to update.");
      return;
    }
    const data = await res.json();
    setProtests((prev) => prev.map((p) => (p.id === id ? data : p)));
    setActionMsg(`Status updated to ${status.replace(/_/g, " ")}.`);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteProtest(id: number) {
    const res = await fetch("/api/admin/electoral-protests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setActionMsg("Failed to delete.");
      return;
    }
    setProtests((prev) => prev.filter((p) => p.id !== id));
    setActionMsg("Protest deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Electoral Protests
        </h1>
        <p className="text-sm text-neutral-400">
          Manage electoral protests filed under Article VII, Section 10.
          Protests are adjudicated by the High Tribunal, presided by the
          Society Chief Adviser.
        </p>
      </div>

      {!fetched && (
        <button onClick={fetchProtests} disabled={loading} className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50">
          {loading ? "Loading…" : "Load Protests"}
        </button>
      )}

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
      {actionMsg && (
        <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">{actionMsg}</div>
      )}

      {fetched && protests.length === 0 && (
        <p className="text-sm text-neutral-500">No electoral protests filed.</p>
      )}

      {fetched && protests.length > 0 && (
        <div className="space-y-4">
          {protests.map((pr) => {
            const color = HOUSE_COLORS[pr.protestant_house] ?? "#666";
            const isExpanded = expandedId === pr.id;
            const isResolved = ["resolved_upheld", "resolved_dismiss", "election_nullified"].includes(pr.status);
            return (
              <article key={pr.id} className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: color }}>
                    {pr.protestant_house[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{pr.protestant_name}</h3>
                    <p className="text-xs text-neutral-400">
                      {pr.protestant_house} · {GROUND_LABELS[pr.protest_ground] ?? pr.protest_ground}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[pr.status] ?? "bg-neutral-800 text-neutral-300"}`}>
                    {pr.status.replace(/_/g, " ")}
                  </span>
                  {!pr.filed_within_deadline && (
                    <span className="rounded-full bg-red-900/60 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                      late filing
                    </span>
                  )}
                </div>

                {/* Summary */}
                <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-neutral-500 sm:grid-cols-3">
                  <p>Filed: <span className="text-neutral-300">{new Date(pr.created_at).toLocaleDateString()}</span></p>
                  <p>Proclamation: <span className="text-neutral-300">{new Date(pr.proclamation_date).toLocaleDateString()}</span></p>
                  {pr.presiding_authority && <p>Presiding: <span className="text-neutral-300">{pr.presiding_authority}</span></p>}
                </div>

                <button onClick={() => setExpandedId(isExpanded ? null : pr.id)} className="mt-3 text-sm font-medium text-neutral-400 transition hover:text-white">
                  {isExpanded ? "Hide details" : "View full protest"}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                    <div>
                      <p className="text-xs font-medium text-white">Specific Violations Alleged</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{pr.specific_violations}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Evidence Summary</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{pr.evidence_summary}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Requested Relief</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{pr.requested_relief}</p>
                    </div>
                    {pr.witnesses && (
                      <div>
                        <p className="text-xs font-medium text-white">Witnesses</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{pr.witnesses}</p>
                      </div>
                    )}
                    {pr.tribunal_notes && (
                      <div>
                        <p className="text-xs font-medium text-white">Tribunal Notes</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{pr.tribunal_notes}</p>
                      </div>
                    )}
                    {pr.verdict && (
                      <div>
                        <p className="text-xs font-medium text-white">Verdict</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{pr.verdict}</p>
                        {pr.verdict_date && <p className="mt-1 text-xs text-neutral-500">Delivered: {new Date(pr.verdict_date).toLocaleDateString()}</p>}
                      </div>
                    )}
                    {pr.election_nullified !== null && (
                      <p className={`text-sm font-semibold ${pr.election_nullified ? "text-red-400" : "text-emerald-400"}`}>
                        Election {pr.election_nullified ? "NULLIFIED" : "UPHELD"}
                      </p>
                    )}
                    {pr.new_conclave_scheduled && (
                      <p className="text-xs text-amber-400">
                        New Conclave scheduled: {new Date(pr.new_conclave_scheduled).toLocaleDateString()}
                      </p>
                    )}

                    {!isResolved && (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Presiding authority…"
                            value={presiding[pr.id] ?? ""}
                            onChange={(e) => setPresiding((p) => ({ ...p, [pr.id]: e.target.value }))}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                          />
                          <textarea
                            placeholder="Tribunal notes…"
                            value={notes[pr.id] ?? ""}
                            onChange={(e) => setNotes((p) => ({ ...p, [pr.id]: e.target.value }))}
                            rows={2}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                          />
                          <textarea
                            placeholder="Verdict (findings of fact, provisions applied)…"
                            value={verdict[pr.id] ?? ""}
                            onChange={(e) => setVerdict((p) => ({ ...p, [pr.id]: e.target.value }))}
                            rows={3}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => updateStatus(pr.id, "under_review")} className="rounded-full bg-blue-800 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-700">Under Review</button>
                          <button onClick={() => updateStatus(pr.id, "hearing_scheduled")} className="rounded-full bg-purple-800 px-3 py-1.5 text-xs font-semibold text-purple-200 transition hover:bg-purple-700">Hearing</button>
                          <button onClick={() => updateStatus(pr.id, "resolved_upheld")} className="rounded-full bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700">Upheld</button>
                          <button onClick={() => updateStatus(pr.id, "resolved_dismiss")} className="rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700">Dismissed</button>
                          <button onClick={() => updateStatus(pr.id, "election_nullified", { election_nullified: true })} className="rounded-full bg-red-800 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700">Nullify Election</button>
                          <button onClick={() => deleteProtest(pr.id)} className="rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700">Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
