"use client";

import { useState, useMemo } from "react";

interface Nomination {
  id: number;
  created_at: string;
  nominator_name: string;
  nominator_house: string;
  nominator_email: string | null;
  nominee_name: string;
  nominee_house: string;
  award_category: string;
  tier: string | null;
  justification: string;
  supporting_documentation: string | null;
  semester: string;
  status: string;
  selection_notes: string | null;
}

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-900/60 text-amber-300",
  under_review: "bg-blue-900/60 text-blue-300",
  approved: "bg-emerald-900/60 text-emerald-300",
  rejected: "bg-red-900/60 text-red-300",
};

export default function AdminNominationsPage() {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // New states for search, filter, bulk actions, and export
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "under_review" | "approved" | "rejected">("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  async function fetchNominations() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/nominations");
    if (!res.ok) {
      setError("Failed to fetch nominations.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setNominations(data);
    setFetched(true);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    const note = notes[id] ?? null;
    const res = await fetch("/api/admin/nominations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, selection_notes: note }),
    });
    if (!res.ok) {
      setActionMsg("Failed to update nomination.");
      return;
    }
    setNominations((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status, selection_notes: note } : n
      )
    );
    setActionMsg(`Nomination marked as ${status.replace("_", " ")}.`);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function bulkUpdateStatus(status: "approved" | "rejected" | "under_review") {
    if (selectedIds.size === 0) return;
    
    const ids = Array.from(selectedIds);
    const promises = ids.map(id => 
      fetch("/api/admin/nominations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, selection_notes: notes[id] ?? null }),
      })
    );
    
    const results = await Promise.all(promises);
    const allOk = results.every(r => r.ok);
    
    if (!allOk) {
      setActionMsg("Some nominations failed to update.");
    } else {
      setNominations((prev) =>
        prev.map((n) => 
          selectedIds.has(n.id) ? { ...n, status, selection_notes: notes[n.id] ?? null } : n
        )
      );
      setActionMsg(`${selectedIds.size} nominations marked as ${status.replace("_", " ")}.`);
      setSelectedIds(new Set());
      setTimeout(() => setActionMsg(null), 3000);
    }
  }

  async function deleteNomination(id: number) {
    const res = await fetch("/api/admin/nominations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setActionMsg("Failed to delete nomination.");
      return;
    }
    setNominations((prev) => prev.filter((n) => n.id !== id));
    setActionMsg("Nomination deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  const exportToCSV = () => {
    const headers = ["ID", "Date", "Nominator", "Nominator House", "Nominee", "Nominee House", "Category", "Tier", "Status", "Semester"];
    const rows = filteredNominations.map(n => [
      n.id,
      new Date(n.created_at).toLocaleDateString(),
      `"${n.nominator_name.replace(/"/g, '""')}"`,
      n.nominator_house,
      `"${n.nominee_name.replace(/"/g, '""')}"`,
      n.nominee_house,
      `"${n.award_category.replace(/"/g, '""')}"`,
      n.tier || "N/A",
      n.status,
      n.semester
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(r => r.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nominations_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredNominations = useMemo(() => {
    return nominations.filter((nom) => {
      const matchesSearch = 
        nom.nominee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nom.nominator_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || nom.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [nominations, searchQuery, statusFilter]);

  const actionableNominations = filteredNominations.filter(n => n.status === "pending" || n.status === "under_review");

  const toggleSelectAll = () => {
    if (actionableNominations.length > 0 && actionableNominations.every(n => selectedIds.has(n.id))) {
      const newSet = new Set(selectedIds);
      actionableNominations.forEach(n => newSet.delete(n.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      actionableNominations.forEach(n => newSet.add(n.id));
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Individual Recognition Nominations
        </h1>
        <p className="text-sm text-neutral-400">
          Review and manage nominations for Individual Recognition awards. The
          Selection Committee evaluates nominations and assigns recipients per
          Article II of the Rules and Procedures.
        </p>
      </div>

      {!fetched && (
        <button
          onClick={fetchNominations}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Nominations"}
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

      {/* Filters, Search, and Actions Bar */}
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
                placeholder="Search by nominee or nominator name..."
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
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* CSV Export Button */}
            <button
              onClick={exportToCSV}
              className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
              Export CSV
            </button>
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
                onClick={() => bulkUpdateStatus("under_review")}
                className="rounded-lg bg-blue-800 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-700"
              >
                Mark Under Review
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
      {fetched && actionableNominations.length > 0 && (
        <div className="flex items-center gap-3 px-2">
          <input
            type="checkbox"
            checked={actionableNominations.every(n => selectedIds.has(n.id))}
            onChange={toggleSelectAll}
            className="size-4 shrink-0 rounded border-neutral-600 bg-neutral-800 accent-emerald-500"
          />
          <span className="text-sm text-neutral-400">Select all visible actionable nominations</span>
        </div>
      )}

      {fetched && filteredNominations.length === 0 && (
        <p className="text-sm text-neutral-500">
          {nominations.length === 0 ? "No nominations found." : "No nominations match your filters."}
        </p>
      )}

      {fetched && filteredNominations.length > 0 && (
        <div className="space-y-4">
          {filteredNominations.map((nom) => {
            const color = HOUSE_COLORS[nom.nominee_house] ?? "#666";
            const isExpanded = expandedId === nom.id;
            const isSelected = selectedIds.has(nom.id);
            const isActionable = nom.status === "pending" || nom.status === "under_review";

            return (
              <article
                key={nom.id}
                className={`rounded-3xl border bg-neutral-950/95 p-6 shadow-lg shadow-black/20 transition-all ${
                  isSelected ? "border-emerald-800/60 ring-1 ring-emerald-800/30" : "border-neutral-800"
                }`}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3">
                    {isActionable && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(nom.id)}
                        className="size-4 shrink-0 rounded border-neutral-600 bg-neutral-800 accent-emerald-500"
                      />
                    )}
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {nom.nominee_house[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {nom.nominee_name}
                      </h3>
                      <p className="text-sm text-neutral-400">
                        {nom.nominee_house} &middot; {nom.award_category}
                        {nom.tier && <>&middot; {nom.tier}</>}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[nom.status] ?? "bg-neutral-800 text-neutral-300"}`}
                    >
                      {nom.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-neutral-400 sm:grid-cols-3">
                    <p>
                      Nominated by:{" "}
                      <span className="text-neutral-300">
                        {nom.nominator_name} ({nom.nominator_house})
                      </span>
                    </p>
                    <p>
                      Semester:{" "}
                      <span className="text-neutral-300">{nom.semester}</span>
                    </p>
                    <p>
                      Submitted:{" "}
                      <span className="text-neutral-300">
                        {new Date(nom.created_at).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  {/* Expand / Collapse */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : nom.id)
                    }
                    className="text-sm font-medium text-neutral-400 transition hover:text-white"
                  >
                    {isExpanded ? "Hide details" : "View details"}
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="space-y-4 border-t border-neutral-800 pt-4">
                      {nom.nominator_email && (
                        <p className="text-sm text-neutral-400">
                          Nominator email:{" "}
                          <span className="text-neutral-300">
                            {nom.nominator_email}
                          </span>
                        </p>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">
                          Justification
                        </p>
                        <p className="mt-1 text-sm leading-6 text-neutral-300">
                          {nom.justification}
                        </p>
                      </div>
                      {nom.supporting_documentation && (
                        <div>
                          <p className="text-sm font-medium text-white">
                            Supporting Documentation
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                            {nom.supporting_documentation}
                          </p>
                        </div>
                      )}
                      {nom.selection_notes && (
                        <div>
                          <p className="text-sm font-medium text-white">
                            Selection Notes
                          </p>
                          <p className="mt-1 text-sm leading-6 text-neutral-300">
                            {nom.selection_notes}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      {isActionable && (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                          <textarea
                            placeholder="Selection notes…"
                            value={notes[nom.id] ?? ""}
                            onChange={(e) =>
                              setNotes((prev) => ({
                                ...prev,
                                [nom.id]: e.target.value,
                              }))
                            }
                            rows={2}
                            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(nom.id, "approved")}
                              className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(nom.id, "under_review")
                              }
                              className="rounded-full bg-blue-800 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-700"
                            >
                              Under Review
                            </button>
                            <button
                              onClick={() => updateStatus(nom.id, "rejected")}
                              className="rounded-full bg-red-800 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => deleteNomination(nom.id)}
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