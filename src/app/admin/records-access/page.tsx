// src/app/admin/records-access/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RBAC, Role, House, getHouseFromRole, isHouseChancellor } from "@/lib/rbac";

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

interface Officer {
  id: string;
  email: string;
  full_name: string;
  role: string;
  house_affiliation: string;
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

const getClassificationBadge = (classification: string) => {
  const lower = classification.toLowerCase();
  if (lower.includes("public")) return "bg-emerald-900/60 text-emerald-300";
  if (lower.includes("restricted")) return "bg-amber-900/60 text-amber-300";
  if (lower.includes("confidential")) return "bg-red-900/60 text-red-300";
  return "bg-neutral-800 text-neutral-300";
};

export default function AdminRecordsAccessPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [processedBy, setProcessedBy] = useState<Record<number, string>>({});

  // 1. Fetch current officer profile for RBAC context
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/records-access");
      if (!res.ok) throw new Error("Failed to fetch requests.");
      const data = await res.json();
      setRequests(data);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    const note = notes[id] ?? null;
    const by = processedBy[id] ?? null;
    
    const previousRequests = [...requests];
    const updatedRequest = {
      ...previousRequests.find((r) => r.id === id)!,
      status,
      processing_notes: note,
      processed_by: by,
      processed_at: new Date().toISOString(),
      fulfilled_at: status === "fulfilled" ? new Date().toISOString() : null,
    };
    
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? updatedRequest : r))
    );

    try {
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
      if (!res.ok) throw new Error("Failed to update.");
      const data = await res.json();
      setRequests((prev) => prev.map((r) => (r.id === id ? data : r)));
      toast.success(`Status updated to ${status}.`);
    } catch (err) {
      setRequests(previousRequests);
      toast.error("Failed to update request status.");
    }
  }

  async function deleteRequest(id: number) {
    const previousRequests = [...requests];
    setRequests((prev) => prev.filter((r) => r.id !== id));

    try {
      const res = await fetch("/api/admin/records-access", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Request deleted.");
    } catch (err) {
      setRequests(previousRequests);
      toast.error("Failed to delete request.");
    }
  }

  const userHouse = officer ? getHouseFromRole(officer.role as Role) : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Records Access Requests</h1>
        <p className="text-sm text-neutral-400">
          Process member requests for access to Public or Restricted Records per Article VIII, Section 4.
        </p>
      </div>

      {/* Jurisdiction Banner for House Chancellors */}
      {officer && isHouseChancellor(officer.role as Role) && userHouse && (
        <article className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-5 shrink-0 text-amber-400">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.75.75 0 01.714.544l.126.5a.75.75 0 01-.714.956H9a.75.75 0 000 1.5h.253a.75.75 0 01.714.544l.126.5a.75.75 0 01-.714.956H9a.75.75 0 000 1.5h.253a.75.75 0 01.714.544l.126.5a.75.75 0 01-.714.956H9a.75.75 0 000 1.5" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-amber-200">House-Level Jurisdiction Active</h3>
              <p className="mt-1 text-xs leading-5 text-amber-300/80">
                As the Chancellor of the <strong className="text-white">House of {userHouse}</strong>, you are viewing and processing 
                only the House-level records access requests for your House. Society-wide requests are managed by the Executive Secretary.
              </p>
            </div>
          </div>
        </article>
      )}

      {!fetched && (
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Requests"}
        </button>
      )}

      {fetched && requests.length === 0 && (
        <p className="text-sm text-neutral-500">No access requests found for your jurisdiction.</p>
      )}

      {fetched && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((req) => {
            const color = HOUSE_COLORS[req.requester_house] ?? "#666";
            const isExpanded = expandedId === req.id;
            
            // Check if the current officer has permission to manage this specific request
            const canManage = officer 
              ? RBAC.canManageRecordsAccess(
                  officer.role as Role, 
                  userHouse, 
                  req.scope, 
                  req.requester_house as House
                )
              : false;

            // Delete is strictly for Exec Sec and President
            const canDelete = officer 
              ? (officer.role === Role.EXECUTIVE_SECRETARY || officer.role === Role.PRESIDENT)
              : false;

            return (
              <article
                key={req.id}
                className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {req.requester_house[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">
                      {req.requester_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-neutral-400">
                        {req.requester_house} · {req.scope}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getClassificationBadge(
                          req.records_classification
                        )}`}
                      >
                        {req.records_classification}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      STATUS_BADGE[req.status] ?? "bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                {/* Summary */}
                <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-neutral-500 sm:grid-cols-3">
                  <p>
                    Requested:{" "}
                    <span className="text-neutral-300">
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </p>
                  <p>
                    Format:{" "}
                    <span className="text-neutral-300">
                      {req.preferred_format}
                    </span>
                  </p>
                  <p>
                    Email:{" "}
                    <span className="text-neutral-300">
                      {req.requester_email}
                    </span>
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {req.specific_records_sought}
                  </p>
                </div>

                {/* Expand */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : req.id)}
                  className="mt-3 text-sm font-medium text-neutral-400 transition hover:text-white"
                >
                  {isExpanded ? "Hide details" : "View details"}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                    <div>
                      <p className="text-xs font-medium text-white">
                        Specific Records Sought
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                        {req.specific_records_sought}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Purpose</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                        {req.purpose}
                      </p>
                    </div>
                    {req.additional_notes && (
                      <div>
                        <p className="text-xs font-medium text-white">
                          Additional Notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                          {req.additional_notes}
                        </p>
                      </div>
                    )}
                    {req.processing_notes && (
                      <div>
                        <p className="text-xs font-medium text-white">
                          Processing Notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                          {req.processing_notes}
                        </p>
                      </div>
                    )}
                    {req.processed_at && (
                      <p className="text-xs text-neutral-500">
                        Processed:{" "}
                        {new Date(req.processed_at).toLocaleDateString()}
                        {req.processed_by && ` by ${req.processed_by}`}
                      </p>
                    )}
                    {req.fulfilled_at && (
                      <p className="text-xs text-neutral-500">
                        Fulfilled:{" "}
                        {new Date(req.fulfilled_at).toLocaleDateString()}
                      </p>
                    )}

                    {/* Actions */}
                    {req.status !== "fulfilled" && req.status !== "denied" && (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                        {canManage ? (
                          <>
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                placeholder="Processed by…"
                                value={processedBy[req.id] ?? ""}
                                onChange={(e) =>
                                  setProcessedBy((p) => ({
                                    ...p,
                                    [req.id]: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                              />
                              <textarea
                                placeholder="Processing notes…"
                                value={notes[req.id] ?? ""}
                                onChange={(e) =>
                                  setNotes((p) => ({
                                    ...p,
                                    [req.id]: e.target.value,
                                  }))
                                }
                                rows={2}
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                              />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => updateStatus(req.id, "processing")}
                                className="rounded-full bg-blue-800 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-700"
                              >
                                Processing
                              </button>
                              <button
                                onClick={() => updateStatus(req.id, "fulfilled")}
                                className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                              >
                                Fulfilled
                              </button>
                              <button
                                onClick={() => updateStatus(req.id, "denied")}
                                className="rounded-full bg-red-800 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                              >
                                Denied
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 w-full">
                            <p className="text-xs text-amber-300/80">
                              You do not have jurisdiction to process this request. 
                              {req.scope === "Society-wide" 
                                ? " Society-wide requests are managed by the Executive Secretary." 
                                : ` House-level requests for ${req.requester_house} are managed by their respective Chancellor.`}
                            </p>
                          </div>
                        )}

                        {/* Delete Button - Strictly Exec Sec / President */}
                        {canDelete && (
                          <button
                            onClick={() => deleteRequest(req.id)}
                            className="rounded-full bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700 sm:ml-auto"
                          >
                            Delete
                          </button>
                        )}
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