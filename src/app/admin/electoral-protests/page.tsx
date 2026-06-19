// src/app/admin/electoral-protests/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import RBACGuard, { type Officer } from "@/components/RBACGuard";
import { RBAC, Role } from "@/lib/rbac";

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
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [protests, setProtests] = useState<Protest[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [verdict, setVerdict] = useState<Record<number, string>>({});
  const [presiding, setPresiding] = useState<Record<number, string>>({});

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  // 1. Fetch current officer profile for RBAC context
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  async function fetchProtests(reset = false) {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    try {
      const res = await fetch(`/api/admin/electoral-protests?page=${currentPage}&limit=${limit}`);
      if (!res.ok) {
        throw new Error("Failed to fetch protests.");
      }
      const { data, count } = await res.json();
      if (reset) {
        setProtests(data || []);
      } else {
        setProtests((prev) => [...prev, ...(data || [])]);
      }
      setHasMore((currentPage * limit) < (count || 0));
      setPage(currentPage);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to fetch protests.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string, extras: Record<string, unknown> = {}) {
    const note = notes[id] ?? null;
    const v = verdict[id] ?? null;
    const p = presiding[id] ?? null;

    // Optimistic update
    const previousProtests = [...protests];
    const updatedProtest = {
      ...previousProtests.find((pr) => pr.id === id)!,
      status,
      tribunal_notes: note,
      verdict: v,
      verdict_date: v ? new Date().toISOString() : null, // 👈 FIXED: Changed undefined to null
      presiding_authority: p,
      ...extras,
    };

    setProtests((prev) =>
      prev.map((pr) => (pr.id === id ? updatedProtest : pr))
    );

    try {
      const res = await fetch("/api/admin/electoral-protests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          tribunal_notes: note,
          verdict: v,
          verdict_date: v ? new Date().toISOString() : null, // 👈 FIXED: Changed undefined to null
          presiding_authority: p,
          ...extras,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update.");
      }

      const data = await res.json();
      // Confirm the update with the actual server response
      setProtests((prev) => prev.map((pr) => (pr.id === id ? data : pr)));
      toast.success(`Status updated to ${status.replace(/_/g, " ")}.`);
    } catch (err) {
      // Revert on failure
      setProtests(previousProtests);
      toast.error("Failed to update protest status.");
    }
  }

  async function deleteProtest(id: number) {
    if (!confirm("Are you sure you want to permanently delete this electoral protest record?")) return;

    // Optimistic update
    const previousProtests = [...protests];
    setProtests((prev) => prev.filter((pr) => pr.id !== id));

    try {
      const res = await fetch("/api/admin/electoral-protests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete.");
      }

      toast.success("Protest deleted.");
    } catch (err) {
      // Revert on failure
      setProtests(previousProtests);
      toast.error("Failed to delete protest.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Jurisdiction Context */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            Electoral Protests
          </h1>
          <p className="text-sm text-neutral-400">
            Manage electoral protests filed under Article VII, Section 10.
            Protests must be filed within three (3) days of Proclamation.
          </p>
        </div>

        {/* High Tribunal Jurisdiction Banner */}
        <article className="rounded-2xl border border-purple-900/40 bg-purple-950/20 p-5">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-5 shrink-0 text-purple-400">
              <path fillRule="evenodd" d="M10 2a5.5 5.5 0 0 0-5.5 5.5v.75H3.375A2.375 2.375 0 0 0 1 10.625v4.75A2.375 2.375 0 0 0 3.375 17.75h13.25a2.375 2.375 0 0 0 2.375-2.375v-4.75a2.375 2.375 0 0 0-2.375-2.375H15.5V7.5A5.5 5.5 0 0 0 10 2Zm0 2.5a3 3 0 0 1 3 3v.75H7V7.5a3 3 0 0 1 3-3Zm-4.5 6.25h9v4.25a.875.875 0 0 1-.875.875H3.375a.875.875 0 0 1-.875-.875v-4.25Z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-purple-200">
                High Tribunal Jurisdiction Active
              </h3>
              <p className="mt-1 text-xs leading-5 text-purple-300/80">
                Electoral protests are adjudicated exclusively by the <strong className="text-white">High Tribunal</strong>,
                presided over by the Society Chief Adviser, with the President and House Chancellors serving as the Jury of the Pillars.
                The decision of the Tribunal is <strong className="text-white">final and executory</strong>.
              </p>
              <p className="mt-1 text-[11px] italic text-purple-400/60">
                — Rules and Procedures, Article VII, Section 10 & Article 10
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* RBAC Guard: Blocks non-High Tribunal members */}
      <RBACGuard
        officer={officer}
        checkPermission={(o) => RBAC.canManageElectoralProtests(o.role as Role)}
        fallback={
          <div className="rounded-3xl border border-red-900/40 bg-red-950/20 p-10 text-center">
            <h2 className="text-xl font-semibold text-red-200">Access Restricted to the High Tribunal</h2>
            <p className="mt-3 text-sm leading-6 text-red-300/80">
              You do not possess the constitutional clearance to view or adjudicate electoral protests.
              This module is strictly reserved for the President, Chief Adviser, and the Council of House Chancellors.
            </p>
          </div>
        }
      >
        {/* Load Button */}
        {!fetched && (
          <button
            onClick={() => fetchProtests(true)}
            disabled={loading}
            className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load Protests"}
          </button>
        )}

        {/* Empty State */}
        {fetched && protests.length === 0 && (
          <p className="text-sm text-neutral-500">No electoral protests filed.</p>
        )}

        {/* Protests List */}
        {fetched && protests.length > 0 && (
          <div className="space-y-4">
            {protests.map((pr) => {
              const color = HOUSE_COLORS[pr.protestant_house] ?? "#666";
              const isExpanded = expandedId === pr.id;
              const isResolved = ["resolved_upheld", "resolved_dismiss", "election_nullified"].includes(pr.status);

              return (
                <article
                  key={pr.id}
                  className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {pr.protestant_house[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">
                        {pr.protestant_name}
                      </h3>
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

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : pr.id)}
                    className="mt-3 text-sm font-medium text-neutral-400 transition hover:text-white"
                  >
                    {isExpanded ? "Hide details" : "View full protest"}
                  </button>

                  {/* Expanded Details & Actions */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                      <div>
                        <p className="text-xs font-medium text-white">Specific Violations Alleged</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                          {pr.specific_violations}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-white">Evidence Summary</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                          {pr.evidence_summary}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-white">Requested Relief</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                          {pr.requested_relief}
                        </p>
                      </div>

                      {pr.witnesses && (
                        <div>
                          <p className="text-xs font-medium text-white">Witnesses</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                            {pr.witnesses}
                          </p>
                        </div>
                      )}

                      {pr.tribunal_notes && (
                        <div>
                          <p className="text-xs font-medium text-white">Tribunal Notes</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                            {pr.tribunal_notes}
                          </p>
                        </div>
                      )}

                      {pr.verdict && (
                        <div>
                          <p className="text-xs font-medium text-white">Verdict</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                            {pr.verdict}
                          </p>
                          {pr.verdict_date && (
                            <p className="mt-1 text-xs text-neutral-500">
                              Delivered: {new Date(pr.verdict_date).toLocaleDateString()}
                            </p>
                          )}
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

                      {/* Action Panel (Only if not resolved) */}
                      {!isResolved && (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              placeholder="Presiding authority (e.g., Society Chief Adviser)…"
                              value={presiding[pr.id] ?? ""}
                              onChange={(e) => setPresiding((p) => ({ ...p, [pr.id]: e.target.value }))}
                              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                            />
                            <textarea
                              placeholder="Tribunal notes / deliberations…"
                              value={notes[pr.id] ?? ""}
                              onChange={(e) => setNotes((p) => ({ ...p, [pr.id]: e.target.value }))}
                              rows={2}
                              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                            />
                            <textarea
                              placeholder="Final Verdict (findings of fact, provisions applied)…"
                              value={verdict[pr.id] ?? ""}
                              onChange={(e) => setVerdict((p) => ({ ...p, [pr.id]: e.target.value }))}
                              rows={3}
                              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => updateStatus(pr.id, "under_review")}
                              className="rounded-full bg-blue-800 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-700"
                            >
                              Under Review
                            </button>
                            <button
                              onClick={() => updateStatus(pr.id, "hearing_scheduled")}
                              className="rounded-full bg-purple-800 px-3 py-1.5 text-xs font-semibold text-purple-200 transition hover:bg-purple-700"
                            >
                              Hearing
                            </button>
                            <button
                              onClick={() => updateStatus(pr.id, "resolved_upheld")}
                              className="rounded-full bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                            >
                              Upheld
                            </button>
                            <button
                              onClick={() => updateStatus(pr.id, "resolved_dismiss")}
                              className="rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
                            >
                              Dismissed
                            </button>
                            <button
                              onClick={() => updateStatus(pr.id, "election_nullified", { election_nullified: true })}
                              className="rounded-full bg-red-800 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                            >
                              Nullify Election
                            </button>
                            <button
                              onClick={() => deleteProtest(pr.id)}
                              className="rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
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

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => fetchProtests(false)}
                  disabled={loading}
                  className="rounded-full border border-neutral-700 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white disabled:opacity-50"
                >
                  {loading ? "Loading more..." : "Load More Protests"}
                </button>
              </div>
            )}
          </div>
        )}
      </RBACGuard>
    </div>
  );
}