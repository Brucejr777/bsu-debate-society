// src/app/admin/nominations/page.tsx
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

interface Nomination {
  id: number;
  created_at: string;
  nominator_name: string;
  nominee_name: string;
  nominee_house: string;
  award_category: string;
  tier: string;
  semester: string;
  justification: string;
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
  debate_excellence: "Debate Excellence",
  leadership: "Leadership & Service",
  organizational_contribution: "Organizational Contribution",
  community_impact: "Community Impact",
};

export default function AdminNominationsPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // 1. Fetch current officer profile for RBAC
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  // 2. Determine if user can manage nominations (Selection Committee)
  const canManage = officer
    ? RBAC.canAccessAdminRoute(officer.role as Role, "/admin/nominations")
    : false;

  async function fetchNominations() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/nominations");
      if (!res.ok) throw new Error("Failed to fetch nominations.");
      const data = await res.json();
      setNominations(data);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to load nominations.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: "approved" | "rejected") {
    // Optimistic update
    const previousNominations = [...nominations];
    setNominations((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status } : n))
    );

    try {
      const res = await fetch("/api/admin/nominations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update.");
      }
      
      const data = await res.json();
      // Confirm with actual server response
      setNominations((prev) => prev.map((n) => (n.id === id ? data : n)));
      
      if (status === "approved") {
        toast.success("Nomination approved. Award automatically conferred to the official ledger.");
      } else {
        toast.success("Nomination rejected.");
      }
    } catch (err: any) {
      // Revert on failure
      setNominations(previousNominations);
      toast.error(err.message || "Failed to update nomination.");
    }
  }

  async function deleteNomination(id: number) {
    if (!confirm("Are you sure you want to permanently delete this nomination?")) return;

    const previousNominations = [...nominations];
    setNominations((prev) => prev.filter((n) => n.id !== id));

    try {
      const res = await fetch("/api/admin/nominations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Nomination deleted.");
    } catch (err) {
      setNominations(previousNominations);
      toast.error("Failed to delete nomination.");
    }
  }

  const btnPrimary = "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnEdit = "rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";
  const btnDanger = "rounded-full bg-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Individual Recognition Nominations</h1>
        <p className="text-sm text-neutral-400">
          Review and process member nominations for individual awards per Article II, Section 3. 
          Approving a nomination automatically confers the award in the official ledger.
        </p>
      </div>

      {/* View Only Notice for Unauthorized Roles */}
      {!canManage && officer && (
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-300/80">
            <strong className="text-amber-200">View Only:</strong> Per the Society Constitution and Rules, 
            only the <strong className="text-white">Selection Committee (High Council and House Chancellors)</strong> can 
            approve or reject nominations. You may view the submissions for transparency purposes.
          </p>
        </div>
      )}

      {/* Load Button */}
      {!fetched && (
        <button
          onClick={fetchNominations}
          disabled={loading}
          className={btnPrimary}
        >
          {loading ? "Loading…" : "Load Nominations"}
        </button>
      )}

      {/* Empty State */}
      {fetched && nominations.length === 0 && (
        <p className="text-sm text-neutral-500">No nominations submitted yet.</p>
      )}

      {/* Nominations List */}
      {fetched && nominations.length > 0 && (
        <div className="space-y-4">
          {nominations.map((nom) => {
            const color = HOUSE_COLORS[nom.nominee_house] ?? "#666";
            const isExpanded = expandedId === nom.id;
            const isPending = nom.status === "pending";

            return (
              <article
                key={nom.id}
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
                    {nom.nominee_house[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">
                      {nom.nominee_name}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Nominated by {nom.nominator_name} • {nom.semester}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-300">
                      {CATEGORY_LABELS[nom.award_category] ?? nom.award_category}
                    </span>
                    <span className="rounded-full bg-blue-900/40 px-2.5 py-1 text-[11px] font-semibold text-blue-300">
                      {nom.tier}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        STATUS_BADGE[nom.status] ?? "bg-neutral-800 text-neutral-300"
                      }`}
                    >
                      {nom.status}
                    </span>
                  </div>
                </div>

                {/* Expand / Collapse */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : nom.id)}
                  className="mt-4 text-sm font-medium text-neutral-400 transition hover:text-white"
                >
                  {isExpanded ? "Hide justification" : "View justification"}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                    <div>
                      <p className="text-xs font-medium text-white">Nomination Justification</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                        {nom.justification}
                      </p>
                    </div>

                    {/* Actions (Strictly Protected by RBAC) */}
                    {isPending && canManage && (
                      <div className="flex flex-wrap gap-2 border-t border-neutral-800 pt-4">
                        <button
                          onClick={() => updateStatus(nom.id, "approved")}
                          className="rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                        >
                          Approve & Confer Award
                        </button>
                        <button
                          onClick={() => updateStatus(nom.id, "rejected")}
                          className="rounded-full bg-red-800 px-4 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => deleteNomination(nom.id)}
                          className="rounded-full bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
                        >
                          Delete
                        </button>
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