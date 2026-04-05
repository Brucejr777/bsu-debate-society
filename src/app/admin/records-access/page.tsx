"use client";

import { useState } from "react";

interface AccessRequest {
  id: number;
  created_at: string;
  requester_name: string;
  requester_house: string;
  requester_email: string;
  records_classification: string;
  specific_records_sought: string;
  purpose: string;
  preferred_format: string;
  scope: string;
  additional_notes: string | null;
  status: string;
  processed_by: string | null;
  processing_notes: string | null;
  processed_at: string | null;
  fulfilled_at: string | null;
}

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-900/60 text-amber-300",
  processing: "bg-blue-900/60 text-blue-300",
  fulfilled: "bg-emerald-900/60 text-emerald-300",
  denied: "bg-red-900/60 text-red-300",
};

export default function AdminRecordsAccessPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [processedBy, setProcessedBy] = useState<Record<number, string>>({});

  async function fetchRequests() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/records-access");
    if (!res.ok) {
      setError("Failed to fetch requests.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setRequests(data);
    setFetched(true);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    const note = notes[id] ?? null;
    const by = processedBy[id] ?? null;
    const res = await fetch("/api/admin/records-access", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status,
        processing_notes: note,
        processed_by: by,
        processed_at: new Date().toISOString(),
        fulfilled_at: status === "fulfilled" ? new Date().toISOString() : undefined,
      }),
    });
    if (!res.ok) {
      setActionMsg("Failed to update.");
      return;
    }
    const data = await res.json();
    setRequests((prev) => prev.map((r) => (r.id === id ? data : r)));
    setActionMsg(`Status updated to ${status}.`);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteRequest(id: number) {
    const res = await fetch("/api/admin/records-access", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setActionMsg("Failed to delete.");
      return;
    }
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setActionMsg("Request deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Records Access Requests
        </h1>
        <p className="text-sm text-neutral-400">
          Process member requests for access to Public or Restricted Records per
          Article VIII, Section 4. Respond within 10 working days.
        </p>
      </div>

      {!fetched && (
        <button onClick={fetchRequests} disabled={loading} className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50">
          {loading ? "Loading…" : "Load Requests"}
        </button>
      )}

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
      {actionMsg && (
        <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">{actionMsg}</div>
      )}

      {fetched && requests.length === 0 && (
        <p className="text-sm text-neutral-500">No access requests found.</p>
      )}

      {fetched && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((req) => {
            const color = HOUSE_COLORS[req.requester_house] ?? "#666";
            const isExpanded = expandedId === req.id;
            return (
              <article key={req.id} className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: color }}>
                    {req.requester_house[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{req.requester_name}</h3>
                    <p className="text-xs text-neutral-400">
                      {req.requester_house} · {req.records_classification} · {req.scope}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[req.status] ?? "bg-neutral-800 text-neutral-300"}`}>
                    {req.status}
                  </span>
                </div>

                {/* Summary */}
                <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-neutral-500 sm:grid-cols-3">
                  <p>Requested: <span className="text-neutral-300">{new Date(req.created_at).toLocaleDateString()}</span></p>
                  <p>Format: <span className="text-neutral-300">{req.preferred_format}</span></p>
                  <p>Email: <span className="text-neutral-300">{req.requester_email}</span></p>
                </div>

                <div className="mt-2">
                  <p className="text-xs text-neutral-400 line-clamp-2">{req.specific_records_sought}</p>
                </div>

                {/* Expand */}
                <button onClick={() => setExpandedId(isExpanded ? null : req.id)} className="mt-3 text-sm font-medium text-neutral-400 transition hover:text-white">
                  {isExpanded ? "Hide details" : "View details"}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                    <div>
                      <p className="text-xs font-medium text-white">Specific Records Sought</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{req.specific_records_sought}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Purpose</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{req.purpose}</p>
                    </div>
                    {req.additional_notes && (
                      <div>
                        <p className="text-xs font-medium text-white">Additional Notes</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{req.additional_notes}</p>
                      </div>
                    )}
                    {req.processing_notes && (
                      <div>
                        <p className="text-xs font-medium text-white">Processing Notes</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{req.processing_notes}</p>
                      </div>
                    )}
                    {req.processed_at && (
                      <p className="text-xs text-neutral-500">Processed: {new Date(req.processed_at).toLocaleDateString()}</p>
                    )}
                    {req.fulfilled_at && (
                      <p className="text-xs text-neutral-500">Fulfilled: {new Date(req.fulfilled_at).toLocaleDateString()}</p>
                    )}

                    {req.status !== "fulfilled" && req.status !== "denied" && (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Processed by…"
                            value={processedBy[req.id] ?? ""}
                            onChange={(e) => setProcessedBy((p) => ({ ...p, [req.id]: e.target.value }))}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                          />
                          <textarea
                            placeholder="Processing notes…"
                            value={notes[req.id] ?? ""}
                            onChange={(e) => setNotes((p) => ({ ...p, [req.id]: e.target.value }))}
                            rows={2}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => updateStatus(req.id, "processing")} className="rounded-full bg-blue-800 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-700">Processing</button>
                          <button onClick={() => updateStatus(req.id, "fulfilled")} className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700">Fulfilled</button>
                          <button onClick={() => updateStatus(req.id, "denied")} className="rounded-full bg-red-800 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-700">Denied</button>
                          <button onClick={() => deleteRequest(req.id)} className="rounded-full bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700">Delete</button>
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
