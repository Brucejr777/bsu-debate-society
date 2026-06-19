// src/app/admin/support-requests/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RBAC, Role } from "@/lib/rbac";

interface Officer {
  id: string;
  email: string;
  full_name: string;
  role: string;
  house_affiliation: string;
}

interface SupportRequest {
  id: number;
  created_at: string;
  member_name: string;
  house: string;
  tournament_name: string;
  tournament_date: string;
  tournament_prestige: string;
  request_type: string;
  amount_requested: number;
  justification: string;
  status: string;
  approval_notes: string | null;
  approved_amount: number | null;
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
};

const TYPE_LABELS: Record<string, string> = {
  financial: "Financial Support",
  logistical: "Logistical Support",
  coaching: "Coaching / Mentorship",
  equipment: "Equipment / Materials",
};

const PRESTIGE_LABELS: Record<string, string> = {
  local: "Local",
  regional: "Regional",
  national: "National",
  international: "International",
};

export default function AdminSupportRequestsPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [approvedAmt, setApprovedAmt] = useState<Record<number, string>>({});

  // 1. Fetch current officer profile for RBAC
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  // 2. Determine if user can manage support requests (High Council / Chancellors)
  const canManage = officer
    ? RBAC.canAccessAdminRoute(officer.role as Role, "/admin/support-requests")
    : false;

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/support-requests");
      if (!res.ok) throw new Error("Failed to fetch requests.");
      const data = await res.json();
      setRequests(data);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to load support requests.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    const note = notes[id] ?? null;
    const amt = approvedAmt[id] ? parseFloat(approvedAmt[id]) : null;

    // Optimistic update
    const previousRequests = [...requests];
    setRequests((prev) =>
      prev.map((r) => 
        r.id === id 
          ? { ...r, status, approval_notes: note, approved_amount: amt } 
          : r
      )
    );

    try {
      const res = await fetch("/api/admin/support-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, approval_notes: note, approved_amount: amt }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update.");
      }
      
      const data = await res.json();
      // Confirm with actual server response
      setRequests((prev) => prev.map((r) => (r.id === id ? data : r)));
      toast.success(`Request marked as ${status.replace(/_/g, " ")}.`);
    } catch (err: any) {
      // Revert on failure
      setRequests(previousRequests);
      toast.error(err.message || "Failed to update request.");
    }
  }

  async function deleteRequest(id: number) {
    if (!confirm("Are you sure you want to permanently delete this support request?")) return;

    const previousRequests = [...requests];
    setRequests((prev) => prev.filter((r) => r.id !== id));

    try {
      const res = await fetch("/api/admin/support-requests", {
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

  const fmt = (n: number) => `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const btnPrimary = "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnEdit = "rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";
  const btnDanger = "rounded-full bg-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900";
  const inputCls = "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">League Support Requests</h1>
        <p className="text-sm text-neutral-400">
          Review and prioritize tournament support requests per Article III, Section 4. 
          The High Council evaluates requests based on prestige, member standing, and resource availability.
        </p>
      </div>

      {/* View Only Notice for Unauthorized Roles */}
      {!canManage && officer && (
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-300/80">
            <strong className="text-amber-200">View Only:</strong> Per the Society Constitution and Rules, 
            only the <strong className="text-white">High Council and House Chancellors</strong> can approve 
            or reject league support requests. You may view the requests for transparency purposes.
          </p>
        </div>
      )}

      {/* Load Button */}
      {!fetched && (
        <button
          onClick={fetchRequests}
          disabled={loading}
          className={btnPrimary}
        >
          {loading ? "Loading…" : "Load Requests"}
        </button>
      )}

      {/* Empty State */}
      {fetched && requests.length === 0 && (
        <p className="text-sm text-neutral-500">No support requests submitted yet.</p>
      )}

      {/* Requests List */}
      {fetched && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((req) => {
            const color = HOUSE_COLORS[req.house] ?? "#666";
            const isExpanded = expandedId === req.id;
            const isPending = req.status === "pending";

            return (
              <article
                key={req.id}
                className={`rounded-3xl border bg-neutral-950/95 p-6 shadow-lg transition-all ${
                  isPending
                    ? "border-amber-800/60 ring-1 ring-amber-800/30"
                    : "border-neutral-800"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {req.house[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">
                      {req.member_name}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {req.house} • {req.tournament_name} • {new Date(req.tournament_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-300">
                      {PRESTIGE_LABELS[req.tournament_prestige] ?? req.tournament_prestige}
                    </span>
                    <span className="rounded-full bg-blue-900/40 px-2.5 py-1 text-[11px] font-semibold text-blue-300">
                      {TYPE_LABELS[req.request_type] ?? req.request_type}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        STATUS_BADGE[req.status] ?? "bg-neutral-800 text-neutral-300"
                      }`}
                    >
                      {req.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
                  <div className="rounded-lg bg-neutral-900 px-3 py-2">
                    <p className="text-xs text-neutral-500">Requested</p>
                    <p className="font-semibold tabular-nums text-white">{fmt(req.amount_requested)}</p>
                  </div>
                  {req.approved_amount !== null && (
                    <div className="rounded-lg bg-neutral-900 px-3 py-2">
                      <p className="text-xs text-neutral-500">Approved</p>
                      <p className="font-semibold tabular-nums text-emerald-400">{fmt(req.approved_amount)}</p>
                    </div>
                  )}
                </div>

                {/* Expand / Collapse */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : req.id)}
                  className="mt-4 text-sm font-medium text-neutral-400 transition hover:text-white"
                >
                  {isExpanded ? "Hide details" : "View justification"}
                </button>

                {/* Expanded Details & Actions */}
                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                    <div>
                      <p className="text-xs font-medium text-white">Justification</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                        {req.justification}
                      </p>
                    </div>

                    {req.approval_notes && (
                      <div>
                        <p className="text-xs font-medium text-white">Council Notes</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                          {req.approval_notes}
                        </p>
                      </div>
                    )}

                    {/* Actions (Strictly Protected by RBAC) */}
                    {isPending && canManage && (
                      <div className="space-y-3 border-t border-neutral-800 pt-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Approved Amount (if applicable)</label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="e.g. 1500.00"
                              value={approvedAmt[req.id] ?? ""}
                              onChange={(e) => setApprovedAmt((p) => ({ ...p, [req.id]: e.target.value }))}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Council Notes</label>
                            <input
                              type="text"
                              placeholder="e.g. Approved partial funding due to budget constraints"
                              value={notes[req.id] ?? ""}
                              onChange={(e) => setNotes((p) => ({ ...p, [req.id]: e.target.value }))}
                              className={inputCls}
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateStatus(req.id, "approved")}
                            className="rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(req.id, "partially_approved")}
                            className="rounded-full bg-blue-800 px-4 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-700"
                          >
                            Partially Approve
                          </button>
                          <button
                            onClick={() => updateStatus(req.id, "rejected")}
                            className="rounded-full bg-red-800 px-4 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => deleteRequest(req.id)}
                            className="ml-auto rounded-full bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
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