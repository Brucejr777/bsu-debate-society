"use client";

import { useState } from "react";

interface Appeal {
  id: number;
  created_at: string;
  appeal_type: string;
  appellant_name: string;
  appellant_house: string;
  appellant_email: string | null;
  disputed_transaction_id: number | null;
  disputed_transaction_date: string | null;
  constitutional_ground: string | null;
  denied_request_id: number | null;
  denial_reason: string | null;
  appeal_ground: string;
  statement_of_appeal: string;
  supporting_evidence: string | null;
  requested_relief: string;
  status: string;
  presiding_authority: string | null;
  council_notes: string | null;
  decision: string | null;
  decision_date: string | null;
  decision_outcome: string | null;
}

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

const TYPE_LABELS: Record<string, string> = {
  point_dispute: "Point Dispute",
  records_access: "Records Access",
};

const OUTCOME_BADGE: Record<string, string> = {
  upheld: "bg-emerald-900/60 text-emerald-300",
  dismissed: "bg-neutral-800 text-neutral-300",
  modified: "bg-blue-900/60 text-blue-300",
  reversed: "bg-purple-900/60 text-purple-300",
  referred: "bg-amber-900/60 text-amber-300",
};

const STATUS_BADGE: Record<string, string> = {
  filed: "bg-amber-900/60 text-amber-300",
  under_review: "bg-blue-900/60 text-blue-300",
  hearing_scheduled: "bg-purple-900/60 text-purple-300",
  decided: "bg-neutral-700 text-neutral-300",
};

export default function AdminAppealsPage() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [decision, setDecision] = useState<Record<number, string>>({});
  const [outcome, setOutcome] = useState<Record<number, string>>({});
  const [presiding, setPresiding] = useState<Record<number, string>>({});

  async function fetchAppeals() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/appeals");
    if (!res.ok) {
      setError("Failed to fetch appeals.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setAppeals(data);
    setFetched(true);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string, extras: Record<string, unknown> = {}) {
    const note = notes[id] ?? null;
    const d = decision[id] ?? null;
    const o = outcome[id] || null;
    const p = presiding[id] ?? null;
    const res = await fetch("/api/admin/appeals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id, status,
        council_notes: note,
        decision: d,
        decision_date: d ? new Date().toISOString() : undefined,
        decision_outcome: o,
        presiding_authority: p,
        ...extras,
      }),
    });
    if (!res.ok) {
      setActionMsg("Failed to update.");
      return;
    }
    const data = await res.json();
    setAppeals((prev) => prev.map((a) => (a.id === id ? data : a)));
    setActionMsg(`Status updated to ${status.replace(/_/g, " ")}.`);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteAppeal(id: number) {
    const res = await fetch("/api/admin/appeals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setActionMsg("Failed to delete.");
      return;
    }
    setAppeals((prev) => prev.filter((a) => a.id !== id));
    setActionMsg("Appeal deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Appeals
        </h1>
        <p className="text-sm text-neutral-400">
          Manage appeals for point disputes (Article I, Section 8) and records
          access denials (Article VIII, Section 6).
        </p>
      </div>

      {!fetched && (
        <button onClick={fetchAppeals} disabled={loading} className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50">
          {loading ? "Loading…" : "Load Appeals"}
        </button>
      )}

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
      {actionMsg && (
        <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">{actionMsg}</div>
      )}

      {fetched && appeals.length === 0 && (
        <p className="text-sm text-neutral-500">No appeals filed.</p>
      )}

      {fetched && appeals.length > 0 && (
        <div className="space-y-4">
          {appeals.map((ap) => {
            const color = HOUSE_COLORS[ap.appellant_house] ?? "#666";
            const isExpanded = expandedId === ap.id;
            const isDecided = ap.status === "decided";
            return (
              <article key={ap.id} className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: color }}>
                    {ap.appellant_house[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{ap.appellant_name}</h3>
                    <p className="text-xs text-neutral-400">
                      {ap.appellant_house} · {TYPE_LABELS[ap.appeal_type] ?? ap.appeal_type}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[ap.status] ?? "bg-neutral-800 text-neutral-300"}`}>
                    {ap.status.replace(/_/g, " ")}
                  </span>
                  {ap.decision_outcome && (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${OUTCOME_BADGE[ap.decision_outcome] ?? "bg-neutral-800 text-neutral-300"}`}>
                      {ap.decision_outcome}
                    </span>
                  )}
                </div>

                {/* Summary */}
                <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-neutral-500 sm:grid-cols-3">
                  <p>Filed: <span className="text-neutral-300">{new Date(ap.created_at).toLocaleDateString()}</span></p>
                  <p>Ground: <span className="text-neutral-300">{ap.appeal_ground}</span></p>
                  {ap.presiding_authority && <p>Presiding: <span className="text-neutral-300">{ap.presiding_authority}</span></p>}
                </div>

                <button onClick={() => setExpandedId(isExpanded ? null : ap.id)} className="mt-3 text-sm font-medium text-neutral-400 transition hover:text-white">
                  {isExpanded ? "Hide details" : "View full appeal"}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                    {/* Appeal-specific details */}
                    {ap.appeal_type === "point_dispute" && (
                      <>
                        {ap.disputed_transaction_date && <p className="text-xs text-neutral-400">Disputed transaction date: <span className="text-neutral-300">{new Date(ap.disputed_transaction_date).toLocaleDateString()}</span></p>}
                        {ap.constitutional_ground && <p className="text-xs text-neutral-400">Constitutional ground: <span className="text-amber-300">{ap.constitutional_ground}</span></p>}
                      </>
                    )}
                    {ap.appeal_type === "records_access" && (
                      <>
                        {ap.denial_reason && <p className="text-xs text-neutral-400">Appeal ground: <span className="text-neutral-300">{ap.denial_reason}</span></p>}
                        {ap.denied_request_id && <p className="text-xs text-neutral-400">Original request ref: <span className="text-neutral-300">{ap.denied_request_id}</span></p>}
                      </>
                    )}

                    <div>
                      <p className="text-xs font-medium text-white">Statement of Appeal</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{ap.statement_of_appeal}</p>
                    </div>
                    {ap.supporting_evidence && (
                      <div>
                        <p className="text-xs font-medium text-white">Supporting Evidence</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{ap.supporting_evidence}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-white">Requested Relief</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{ap.requested_relief}</p>
                    </div>
                    {ap.council_notes && (
                      <div>
                        <p className="text-xs font-medium text-white">Council Notes</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{ap.council_notes}</p>
                      </div>
                    )}
                    {ap.decision && (
                      <div>
                        <p className="text-xs font-medium text-white">Decision</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{ap.decision}</p>
                        {ap.decision_date && <p className="mt-1 text-xs text-neutral-500">Date: {new Date(ap.decision_date).toLocaleDateString()}</p>}
                      </div>
                    )}

                    {!isDecided && (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Presiding authority…"
                            value={presiding[ap.id] ?? ""}
                            onChange={(e) => setPresiding((p) => ({ ...p, [ap.id]: e.target.value }))}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                          />
                          <textarea
                            placeholder="Council notes…"
                            value={notes[ap.id] ?? ""}
                            onChange={(e) => setNotes((p) => ({ ...p, [ap.id]: e.target.value }))}
                            rows={2}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                          />
                          <select
                            value={outcome[ap.id] ?? ""}
                            onChange={(e) => setOutcome((p) => ({ ...p, [ap.id]: e.target.value }))}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 outline-none transition focus:border-neutral-500"
                          >
                            <option value="">Select outcome</option>
                            <option value="upheld">Upheld</option>
                            <option value="dismissed">Dismissed</option>
                            <option value="modified">Modified</option>
                            <option value="reversed">Reversed</option>
                            <option value="referred">Referred to High Tribunal</option>
                          </select>
                          <textarea
                            placeholder="Decision…"
                            value={decision[ap.id] ?? ""}
                            onChange={(e) => setDecision((p) => ({ ...p, [ap.id]: e.target.value }))}
                            rows={3}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => updateStatus(ap.id, "under_review")} className="rounded-full bg-blue-800 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-700">Under Review</button>
                          <button onClick={() => updateStatus(ap.id, "hearing_scheduled")} className="rounded-full bg-purple-800 px-3 py-1.5 text-xs font-semibold text-purple-200 transition hover:bg-purple-700">Hearing</button>
                          <button onClick={() => updateStatus(ap.id, "decided")} className="rounded-full bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700">Decide</button>
                          <button onClick={() => deleteAppeal(ap.id)} className="rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700">Delete</button>
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
