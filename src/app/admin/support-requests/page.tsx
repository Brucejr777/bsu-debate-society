"use client";

import { useState } from "react";

interface SupportRequest {
  id: number;
  created_at: string;
  member_name: string;
  member_house: string;
  member_email: string;
  tournament_name: string;
  tournament_date: string;
  tournament_level: string;
  tournament_location: string | null;
  role_in_tournament: string;
  requested_support: string;
  estimated_cost: number | null;
  submission_deadline_met: boolean;
  status: string;
  approval_notes: string | null;
  post_tournament_report: string | null;
}

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-900/60 text-amber-300",
  approved: "bg-emerald-900/60 text-emerald-300",
  partially_approved: "bg-blue-900/60 text-blue-300",
  rejected: "bg-red-900/60 text-red-300",
  completed: "bg-purple-900/60 text-purple-300",
};

export default function AdminSupportRequestsPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function fetchRequests() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/support-requests");
    if (!res.ok) {
      setError("Failed to fetch support requests.");
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

    const res = await fetch("/api/admin/support-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, approval_notes: note }),
    });

    if (!res.ok) {
      setActionMsg("Failed to update support request.");
      return;
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, approval_notes: note } : r
      )
    );
    setActionMsg(`Request marked as ${status.replace("_", " ")}.`);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteRequest(id: number) {
    const res = await fetch("/api/admin/support-requests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      setActionMsg("Failed to delete support request.");
      return;
    }

    setRequests((prev) => prev.filter((r) => r.id !== id));
    setActionMsg("Support request deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          League Support Requests
        </h1>
        <p className="text-sm text-neutral-400">
          Review and manage tournament support requests from Debate League
          members. The High Council evaluates requests based on tournament
          prestige, member standing, and resource availability per Article III,
          Section 4.
        </p>
      </div>

      {!fetched && (
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Support Requests"}
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

      {fetched && requests.length === 0 && (
        <p className="text-sm text-neutral-500">No support requests found.</p>
      )}

      {fetched && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((req) => {
            const color = HOUSE_COLORS[req.member_house] ?? "#666";
            const isExpanded = expandedId === req.id;
            const isPast = new Date(req.tournament_date) < new Date();
            return (
              <article
                key={req.id}
                className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {req.member_house[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {req.member_name}
                      </h3>
                      <p className="text-sm text-neutral-400">
                        {req.tournament_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPast && (
                        <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-400">
                          past
                        </span>
                      )}
                      {!req.submission_deadline_met && (
                        <span className="rounded-full bg-amber-900/60 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                          late
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[req.status] ?? "bg-neutral-800 text-neutral-300"}`}
                      >
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-neutral-400 sm:grid-cols-3">
                    <p>
                      Tournament:{" "}
                      <span className="text-neutral-300">
                        {new Date(req.tournament_date).toLocaleDateString()}{" "}
                        &middot; {req.tournament_level}
                      </span>
                    </p>
                    <p>
                      Role:{" "}
                      <span className="text-neutral-300 capitalize">
                        {req.role_in_tournament}
                      </span>
                    </p>
                    <p>
                      Est. Cost:{" "}
                      <span className="text-neutral-300">
                        {req.estimated_cost != null
                          ? `₱${req.estimated_cost.toLocaleString()}`
                          : "Not specified"}
                      </span>
                    </p>
                  </div>

                  {/* Expand / Collapse */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : req.id)
                    }
                    className="text-sm font-medium text-neutral-400 transition hover:text-white"
                  >
                    {isExpanded ? "Hide details" : "View details"}
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="space-y-4 border-t border-neutral-800 pt-4">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-neutral-400 sm:grid-cols-2">
                        <p>
                          Email:{" "}
                          <span className="text-neutral-300">
                            {req.member_email}
                          </span>
                        </p>
                        {req.tournament_location && (
                          <p>
                            Location:{" "}
                            <span className="text-neutral-300">
                              {req.tournament_location}
                            </span>
                          </p>
                        )}
                        <p>
                          Submitted:{" "}
                          <span className="text-neutral-300">
                            {new Date(req.created_at).toLocaleDateString()}
                          </span>
                        </p>
                        <p>
                          Deadline met:{" "}
                          <span className="text-neutral-300">
                            {req.submission_deadline_met ? "Yes" : "No"}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          Requested Support
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                          {req.requested_support}
                        </p>
                      </div>

                      {req.approval_notes && (
                        <div>
                          <p className="text-sm font-medium text-white">
                            Approval Notes
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                            {req.approval_notes}
                          </p>
                        </div>
                      )}

                      {req.post_tournament_report && (
                        <div>
                          <p className="text-sm font-medium text-white">
                            Post-Tournament Report
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                            {req.post_tournament_report}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      {req.status !== "completed" && (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                          <textarea
                            placeholder="Approval notes…"
                            value={notes[req.id] ?? ""}
                            onChange={(e) =>
                              setNotes((prev) => ({
                                ...prev,
                                [req.id]: e.target.value,
                              }))
                            }
                            rows={2}
                            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                          />
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                updateStatus(req.id, "approved")
                              }
                              className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(req.id, "partially_approved")
                              }
                              className="rounded-full bg-blue-800 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-700"
                            >
                              Partial
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(req.id, "rejected")
                              }
                              className="rounded-full bg-red-800 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                            >
                              Reject
                            </button>
                            {req.status === "approved" && (
                              <button
                                onClick={() =>
                                  updateStatus(req.id, "completed")
                                }
                                className="rounded-full bg-purple-800 px-4 py-2 text-xs font-semibold text-purple-200 transition hover:bg-purple-700"
                              >
                                Mark Completed
                              </button>
                            )}
                            <button
                              onClick={() => deleteRequest(req.id)}
                              className="rounded-full bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
