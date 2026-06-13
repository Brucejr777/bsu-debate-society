"use client";
import { useState } from "react";

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-900/60 text-amber-300",
  under_review: "bg-blue-900/60 text-blue-300",
  resolved: "bg-emerald-900/60 text-emerald-300",
};

interface WhistleblowerReport {
  id: number;
  created_at: string;
  is_anonymous: boolean;
  contact_method: string | null;
  misconduct_types: string[];
  parties_involved: string | null;
  factual_summary: string;
  supporting_documentation: string | null;
  status: string;
}

export default function AdminWhistleblowerPage() {
  const [reports, setReports] = useState<WhistleblowerReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  async function fetchReports() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/whistleblower");
    if (!res.ok) {
      setError("Failed to fetch reports.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setReports(data);
    setFetched(true);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    const note = notes[id] ?? null;
    const res = await fetch("/api/admin/whistleblower", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status,
        notes: note,
      }),
    });
    if (!res.ok) {
      setActionMsg("Failed to update report.");
      return;
    }
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setActionMsg(`Report marked as ${status.replace("_", " ")}.`);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteReport(id: number) {
    const res = await fetch("/api/admin/whistleblower", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setActionMsg("Failed to delete report.");
      return;
    }
    setReports((prev) => prev.filter((r) => r.id !== id));
    setActionMsg("Report deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Whistleblower Reports
        </h1>
        <p className="text-sm text-neutral-400">
          Manage confidential disclosures of misconduct, ethical violations, or
          administrative malfeasance per Constitution Art. 3, Sec. 14.
        </p>
      </div>

      {!fetched && (
        <button
          onClick={fetchReports}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Reports"}
        </button>
      )}

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

      {fetched && reports.length === 0 && (
        <p className="text-sm text-neutral-500">No whistleblower reports filed.</p>
      )}

      {fetched && reports.length > 0 && (
        <div className="space-y-4">
          {reports.map((report) => {
            const isExpanded = expandedId === report.id;
            return (
              <article
                key={report.id}
                className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">
                      {report.is_anonymous ? "Anonymous Discloser" : "Identified Discloser"}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Filed: {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      STATUS_BADGE[report.status] ?? "bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    {report.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {report.misconduct_types.map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-400"
                    >
                      {type.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : report.id)}
                  className="mt-3 text-sm font-medium text-neutral-400 transition hover:text-white"
                >
                  {isExpanded ? "Hide details" : "View full report"}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                    {!report.is_anonymous && report.contact_method && (
                      <div>
                        <p className="text-xs font-medium text-white">Contact Method</p>
                        <p className="mt-1 text-sm text-neutral-300">{report.contact_method}</p>
                      </div>
                    )}

                    {report.parties_involved && (
                      <div>
                        <p className="text-xs font-medium text-white">Parties Involved</p>
                        <p className="mt-1 text-sm text-neutral-300">{report.parties_involved}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-medium text-white">Factual Summary</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                        {report.factual_summary}
                      </p>
                    </div>

                    {report.supporting_documentation && (
                      <div>
                        <p className="text-xs font-medium text-white">Supporting Documentation</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                          {report.supporting_documentation}
                        </p>
                      </div>
                    )}

                    {report.status !== "resolved" && (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                        <textarea
                          placeholder="Internal notes (confidential)…"
                          value={notes[report.id] ?? ""}
                          onChange={(e) =>
                            setNotes((p) => ({ ...p, [report.id]: e.target.value }))
                          }
                          rows={2}
                          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateStatus(report.id, "under_review")}
                            className="rounded-full bg-blue-800 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-700"
                          >
                            Under Review
                          </button>
                          <button
                            onClick={() => updateStatus(report.id, "resolved")}
                            className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                          >
                            Resolved
                          </button>
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="rounded-full bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
                          >
                            Delete
                          </button>
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