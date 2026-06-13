"use client";

import { useState, useMemo } from "react";

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
}

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

export default function AdminMembershipsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<Record<number, string>>({});
  
  // New states for search, filter, and bulk actions
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  async function fetchApps() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/memberships");
    if (!res.ok) {
      setError("Failed to fetch applications.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setApps(data);
    setFetched(true);
    setLoading(false);
  }

  async function updateStatus(id: number, status: "approved" | "rejected") {
    const note = adminNote[id] ?? null;
    const res = await fetch("/api/admin/memberships", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, comments: note }),
    });
    if (!res.ok) {
      setActionMsg("Failed to update application.");
      return;
    }
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, comments: note } : a))
    );
    setActionMsg(`Application ${status}.`);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function bulkUpdateStatus(status: "approved" | "rejected") {
    if (selectedIds.size === 0) return;
    
    // Process bulk updates using the existing single-item endpoint
    const ids = Array.from(selectedIds);
    const promises = ids.map(id => 
      fetch("/api/admin/memberships", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, comments: adminNote[id] ?? null }),
      })
    );
    
    const results = await Promise.all(promises);
    const allOk = results.every(r => r.ok);
    
    if (!allOk) {
      setActionMsg("Some applications failed to update.");
    } else {
      setApps((prev) =>
        prev.map((a) => 
          selectedIds.has(a.id) ? { ...a, status, comments: adminNote[a.id] ?? null } : a
        )
      );
      setActionMsg(`${selectedIds.size} applications ${status}.`);
      setSelectedIds(new Set());
      setTimeout(() => setActionMsg(null), 3000);
    }
  }

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch = 
        app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.student_id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apps, searchQuery, statusFilter]);

  const toggleSelectAll = () => {
    const pendingInFilter = filteredApps.filter(a => a.status === "pending");
    if (pendingInFilter.length > 0 && pendingInFilter.every(a => selectedIds.has(a.id))) {
      const newSet = new Set(selectedIds);
      pendingInFilter.forEach(a => newSet.delete(a.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      pendingInFilter.forEach(a => newSet.add(a.id));
      setSelectedIds(newSet);
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-900/60 text-amber-300",
      approved: "bg-emerald-900/60 text-emerald-300",
      rejected: "bg-red-900/60 text-red-300",
    };
    return (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] ?? "bg-neutral-800 text-neutral-300"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Membership Applications
        </h1>
        <p className="text-sm text-neutral-400">
          Review and manage applications per Constitution Article 5. House Councils
          approve new members by majority vote.
        </p>
      </div>

      {/* Fetch Button */}
      {!fetched && (
        <button
          onClick={fetchApps}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Applications"}
        </button>
      )}

      {/* Feedback Messages */}
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

      {/* Filters and Bulk Actions Bar */}
      {fetched && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
            </div>
            
            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 sm:w-40"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Bulk Actions Panel */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2">
              <span className="text-sm font-medium text-neutral-300">
                {selectedIds.size} selected
              </span>
              <button
                onClick={() => bulkUpdateStatus("approved")}
                className="rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
              >
                Approve Selected
              </button>
              <button
                onClick={() => bulkUpdateStatus("rejected")}
                className="rounded-lg bg-red-800 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700"
              >
                Reject Selected
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* Select All Header */}
      {fetched && filteredApps.length > 0 && filteredApps.some(a => a.status === "pending") && (
        <div className="flex items-center gap-3 px-2">
          <input
            type="checkbox"
            checked={filteredApps.filter(a => a.status === "pending").every(a => selectedIds.has(a.id))}
            onChange={toggleSelectAll}
            className="size-4 shrink-0 rounded border-neutral-600 bg-neutral-800 accent-emerald-500"
          />
          <span className="text-sm text-neutral-400">Select all visible pending applications</span>
        </div>
      )}

      {/* Applications List */}
      {fetched && filteredApps.length === 0 && (
        <p className="text-sm text-neutral-500">
          {apps.length === 0 ? "No applications found." : "No applications match your filters."}
        </p>
      )}

      {fetched && filteredApps.length > 0 && (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const color = HOUSE_COLORS[app.house_choice] ?? "#666";
            const isSelected = selectedIds.has(app.id);

            return (
              <article
                key={app.id}
                className={`rounded-3xl border bg-neutral-950/95 p-6 shadow-lg shadow-black/20 transition-all ${
                  isSelected ? "border-emerald-800/60 ring-1 ring-emerald-800/30" : "border-neutral-800"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    {/* Row Checkbox (Only for pending) */}
                    {app.status === "pending" && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(app.id)}
                        className="mt-1.5 size-4 shrink-0 rounded border-neutral-600 bg-neutral-800 accent-emerald-500"
                      />
                    )}
                    
                    <div
                      className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${
                        app.status !== "pending" ? "opacity-50" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {app.house_choice[0]}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">
                          {app.full_name}
                        </h3>
                        {statusBadge(app.status)}
                      </div>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-neutral-400 sm:grid-cols-2">
                        <p>Student ID: <span className="text-neutral-300">{app.student_id}</span></p>
                        <p>College: <span className="text-neutral-300">{app.college}</span></p>
                        <p>Email: <span className="text-neutral-300">{app.email}</span></p>
                        {app.phone && <p>Phone: <span className="text-neutral-300">{app.phone}</span></p>}
                        <p>Applied: <span className="text-neutral-300">{new Date(app.created_at).toLocaleDateString()}</span></p>
                      </div>
                      {app.comments && (
                        <p className="text-sm text-neutral-500">
                          Admin note: <span className="text-neutral-400">{app.comments}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Individual Actions (Only for pending) */}
                  {app.status === "pending" && (
                    <div className="flex flex-col gap-2 sm:items-end">
                      <input
                        type="text"
                        placeholder="Admin note…"
                        value={adminNote[app.id] ?? ""}
                        onChange={(e) =>
                          setAdminNote((prev) => ({ ...prev, [app.id]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 sm:w-48"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(app.id, "approved")}
                          className="rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, "rejected")}
                          className="rounded-full bg-red-800 px-4 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
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