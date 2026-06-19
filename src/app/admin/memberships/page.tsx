// src/app/admin/memberships/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import RBACGuard, { type Officer } from "@/components/RBACGuard";
import { RBAC, Role, isHouseChancellor, getHouseFromRole } from "@/lib/rbac";

interface Application {
  id: number;
  created_at: string;
  full_name: string;
  student_id: string;
  college: string;
  house_choice: string;
  email: string;
  phone: string | null;
  status: string;
  comments: string | null;
  motivation: string | null; // 👈 NEW: Added motivation field
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-900/60 text-amber-300",
  approved: "bg-emerald-900/60 text-emerald-300",
  rejected: "bg-red-900/60 text-red-300",
};

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

export default function AdminMembershipsPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [adminNote, setAdminNote] = useState<Record<number, string>>({});

  // Search, filter, and bulk actions
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  async function fetchApps(reset = false) {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    try {
      const res = await fetch(`/api/admin/memberships?page=${currentPage}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch applications.");
      
      const { data, count } = await res.json();
      
      if (reset) {
        setApps(data || []);
      } else {
        setApps((prev) => [...prev, ...(data || [])]);
      }
      
      setHasMore((currentPage * limit) < (count || 0));
      setPage(currentPage);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    const note = adminNote[id] || null;
    const previousApps = [...apps];
    
    // Optimistic update
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

    try {
      const res = await fetch("/api/admin/memberships", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, admin_note: note }),
      });

      if (!res.ok) throw new Error("Failed to update.");
      
      const data = await res.json();
      setApps((prev) => prev.map((a) => (a.id === id ? data : a)));
      toast.success(`Application ${status}.`);
    } catch (err) {
      setApps(previousApps);
      toast.error("Failed to update application.");
    }
  }

  async function deleteApp(id: number) {
    if (!confirm("Are you sure you want to permanently delete this application?")) return;

    const previousApps = [...apps];
    setApps((prev) => prev.filter((a) => a.id !== id));

    try {
      const res = await fetch("/api/admin/memberships", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Application deleted.");
    } catch (err) {
      setApps(previousApps);
      toast.error("Failed to delete application.");
    }
  }

  function exportToCSV() {
    const headers = ["Date", "Name", "Student ID", "College", "House", "Email", "Phone", "Status", "Motivation", "Comments"];
    const rows = filteredApps.map((a) => [
      new Date(a.created_at).toLocaleDateString(),
      a.full_name,
      a.student_id,
      a.college,
      a.house_choice,
      a.email,
      a.phone || "",
      a.status,
      (a.motivation || "").replace(/\n/g, " "),
      (a.comments || "").replace(/\n/g, " "),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `membership-applications-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const userHouse = officer ? (isHouseChancellor(officer.role as Role) ? getHouseFromRole(officer.role as Role) : null) : null;

  const filteredApps = apps.filter((a) => {
    if (userHouse && a.house_choice !== userHouse) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.full_name.toLowerCase().includes(q) ||
        a.student_id.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Jurisdiction Context */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Membership Applications</h1>
          <p className="text-sm text-neutral-400">
            Review and process membership applications per Article V of the Constitution.
          </p>
        </div>

        {userHouse && (
          <article className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
            <p className="text-sm leading-6 text-amber-300/80">
              <strong className="text-amber-200">House Autonomy Active:</strong> As the Chancellor of the{" "}
              <strong className="text-white">{userHouse}</strong>, you are viewing and managing only the 
              applications routed to your House.
            </p>
          </article>
        )}
      </div>

      <RBACGuard
        officer={officer}
        checkPermission={(o) => RBAC.canAccessAdminRoute(o.role as Role, "/admin/memberships")}
        fallback={
          <div className="rounded-3xl border border-red-900/40 bg-red-950/20 p-10 text-center">
            <h2 className="text-xl font-semibold text-red-200">Access Restricted</h2>
            <p className="mt-3 text-sm text-red-300/80">You do not have permission to view membership applications.</p>
          </div>
        }
      >
        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 outline-none focus:border-neutral-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={exportToCSV}
              className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Load Button */}
        {!fetched && (
          <button
            onClick={() => fetchApps(true)}
            disabled={loading}
            className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load Applications"}
          </button>
        )}

        {/* Empty State */}
        {fetched && filteredApps.length === 0 && (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 text-center text-neutral-400">
            {apps.length === 0 ? "No applications found." : "No applications match your filters."}
          </div>
        )}

        {/* Applications List */}
        {fetched && filteredApps.length > 0 && (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const color = HOUSE_COLORS[app.house_choice] ?? "#666";
              const isExpanded = expandedId === app.id;
              const isPending = app.status === "pending";

              return (
                <article
                  key={app.id}
                  className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {app.house_choice[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">{app.full_name}</h3>
                      <p className="text-xs text-neutral-400">
                        {app.house_choice} · {app.college} · ID: {app.student_id}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[app.status] ?? "bg-neutral-800 text-neutral-300"}`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-neutral-500 sm:grid-cols-2">
                    <p>Email: <span className="text-neutral-300">{app.email}</span></p>
                    <p>Applied: <span className="text-neutral-300">{new Date(app.created_at).toLocaleDateString()}</span></p>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                    className="mt-3 text-sm font-medium text-neutral-400 transition hover:text-white"
                  >
                    {isExpanded ? "Hide details" : "View full application"}
                  </button>

                  {/* Expanded Details & Actions */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                      {app.phone && (
                        <p className="text-xs text-neutral-400">Phone: <span className="text-neutral-300">{app.phone}</span></p>
                      )}

                      {app.comments && (
                        <div>
                          <p className="text-xs font-medium text-white">Additional Comments</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{app.comments}</p>
                        </div>
                      )}

                      {/* 👇 NEW: Applicant's Motivation 👇 */}
                      {app.motivation && (
                        <div className="rounded-xl border border-amber-900/30 bg-amber-950/10 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">
                            Why do they want to join?
                          </p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-200">
                            {app.motivation}
                          </p>
                        </div>
                      )}

                      {/* Admin Actions (Only for pending) */}
                      {isPending && (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                          <div className="flex-1">
                            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Admin Note (Optional)</label>
                            <textarea
                              placeholder="Add a note regarding this decision..."
                              value={adminNote[app.id] ?? ""}
                              onChange={(e) => setAdminNote((p) => ({ ...p, [app.id]: e.target.value }))}
                              rows={2}
                              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => updateStatus(app.id, "approved")}
                              className="rounded-full bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, "rejected")}
                              className="rounded-full bg-red-800 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => deleteApp(app.id)}
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
                  onClick={() => fetchApps(false)}
                  disabled={loading}
                  className="rounded-full border border-neutral-700 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white disabled:opacity-50"
                >
                  {loading ? "Loading more..." : "Load More Applications"}
                </button>
              </div>
            )}
          </div>
        )}
      </RBACGuard>
    </div>
  );
}