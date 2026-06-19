// src/app/admin/point-claims/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import RBACGuard, { type Officer } from "@/components/RBACGuard";
import { RBAC, Role } from "@/lib/rbac";

interface PointClaim {
  id: number;
  created_at: string;
  member_name: string;
  house: string;
  membership_status: string;
  activity_date: string;
  activity_name: string;
  organizing_body: string;
  point_category: string;
  points_claimed: number;
  evidence_link: string;
  additional_notes: string | null;
  status: string;
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
  rejected: "bg-red-900/60 text-red-300",
};

const CATEGORY_LABELS: Record<string, string> = {
  society_wide_debate: "Society-Wide Debate",
  house_wide_debate: "House-Wide Debate",
  external_competition: "External Competition",
  speaker_award: "Speaker / Individual Award",
};

export default function AdminPointClaimsPage() {
  const [claims, setClaims] = useState<PointClaim[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // RBAC State
  const [officer, setOfficer] = useState<Officer | null>(null);

  // 1. Fetch current officer profile for RBAC
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  // 2. Determine if user can manage the claims
  const canManage = officer ? RBAC.canManageIndividualPoints(officer.role as Role) : false;

  async function fetchClaims() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/point-claims");
      if (!res.ok) throw new Error("Failed to fetch claims.");
      const data = await res.json();
      setClaims(data);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to load point claims.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: "approved" | "rejected") {
    // Optimistic update
    const previousClaims = [...claims];
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );

    try {
      const res = await fetch("/api/admin/point-claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update.");
      const data = await res.json();
      setClaims((prev) => prev.map((c) => (c.id === id ? data : c)));
      
      if (status === "approved") {
        toast.success("Claim approved and points added to the Individual Ledger.");
      } else {
        toast.success("Claim rejected.");
      }
    } catch (err) {
      setClaims(previousClaims);
      toast.error("Failed to update claim status.");
    }
  }

  async function deleteClaim(id: number) {
    const previousClaims = [...claims];
    setClaims((prev) => prev.filter((c) => c.id !== id));

    try {
      const res = await fetch("/api/admin/point-claims", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Claim deleted.");
    } catch (err) {
      setClaims(previousClaims);
      toast.error("Failed to delete claim.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Point Claims Inbox</h1>
        <p className="text-sm text-neutral-400">
          Review, verify, and process Individual Debate Point claims submitted by members.
          Approving a claim automatically inserts the points into the official Individual Ledger.
        </p>
      </div>

      {/* RBAC Notice for View-Only Users */}
      {!canManage && officer && (
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-300/80">
            <strong className="text-amber-200">View Only:</strong> Per Article III, Section 6 of the Rules &amp; Procedures, 
            only the <strong className="text-white">Secretary of Internal Affairs (Point Keeper)</strong> or the 
            <strong className="text-white"> President</strong> can approve or reject point claims. 
            You may view the inbox for oversight and transparency purposes.
          </p>
        </div>
      )}

      {/* Load Button */}
      {!fetched && (
        <button
          onClick={fetchClaims}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Claims"}
        </button>
      )}

      {/* Empty State */}
      {fetched && claims.length === 0 && (
        <p className="text-sm text-neutral-500">No point claims submitted yet.</p>
      )}

      {/* Claims List */}
      {fetched && claims.length > 0 && (
        <div className="space-y-4">
          {claims.map((claim) => {
            const color = HOUSE_COLORS[claim.house] ?? "#666";
            const isExpanded = expandedId === claim.id;
            const isPending = claim.status === "pending";

            return (
              <article
                key={claim.id}
                className={`rounded-3xl border bg-neutral-950/95 p-6 shadow-lg transition-all ${
                  isPending
                    ? "border-amber-800/60 ring-1 ring-amber-800/30"
                    : "border-neutral-800"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {claim.house[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">
                      {claim.member_name}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {claim.house} • {claim.membership_status.replace(/_/g, " ")} • Filed {new Date(claim.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      STATUS_BADGE[claim.status] ?? "bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                {/* Core Details */}
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-neutral-500">Activity</p>
                    <p className="text-neutral-200">{claim.activity_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-500">Category</p>
                    <p className="text-neutral-200">
                      {CATEGORY_LABELS[claim.point_category] ?? claim.point_category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-500">Points Claimed</p>
                    <p className="text-lg font-bold tabular-nums text-emerald-400">
                      +{claim.points_claimed}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-500">Evidence</p>
                    <a
                      href={claim.evidence_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline underline-offset-2 transition hover:text-blue-300 truncate block max-w-xs"
                      title={claim.evidence_link}
                    >
                      View Documentation →
                    </a>
                  </div>
                </div>

                {/* Expandable Details */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                  className="mt-3 text-sm font-medium text-neutral-400 transition hover:text-white"
                >
                  {isExpanded ? "Hide details" : "View full details"}
                </button>
                
                {isExpanded && (
                  <div className="mt-4 space-y-3 border-t border-neutral-800 pt-4">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-neutral-500">Activity Date</p>
                        <p className="text-neutral-300">
                          {new Date(claim.activity_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-500">Organizing Body</p>
                        <p className="text-neutral-300">{claim.organizing_body}</p>
                      </div>
                    </div>
                    {claim.additional_notes && (
                      <div>
                        <p className="text-xs font-medium text-neutral-500">Additional Notes</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                          {claim.additional_notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions (Strictly Protected by RBAC) */}
                {isPending && canManage && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-800 pt-4">
                    <button
                      onClick={() => updateStatus(claim.id, "approved")}
                      className="rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                    >
                      Approve & Add to Ledger
                    </button>
                    <button
                      onClick={() => updateStatus(claim.id, "rejected")}
                      className="rounded-full bg-red-800 px-4 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                    >
                      Reject Claim
                    </button>
                    <button
                      onClick={() => deleteClaim(claim.id)}
                      className="rounded-full bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
                    >
                      Delete
                    </button>
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