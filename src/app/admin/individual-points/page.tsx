// src/app/admin/individual-points/page.tsx
"use client";

import { useState, useEffect, useMemo, type FormEvent } from "react";
import { toast } from "sonner";
import { Tooltip } from "@/components/Tooltip";
import RBACGuard, { type Officer } from "@/components/RBACGuard";
import { RBAC, Role } from "@/lib/rbac";

const HOUSES = ["Bathala", "Kabunian", "Laon", "Manama"];
const HOUSE_LABELS: Record<string, string> = {
  Bathala: "House of Bathala",
  Kabunian: "House of Kabunian",
  Laon: "House of Laon",
  Manama: "House of Manama",
};
const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

const STATUS_BADGE: Record<string, string> = {
  provisional: "bg-amber-900/60 text-amber-300",
  final: "bg-emerald-900/60 text-emerald-300",
  disputed: "bg-red-900/60 text-red-300",
};

interface Transaction {
  id: number;
  created_at: string;
  member_name: string;
  house: string;
  points: number;
  reason: string;
  evidence: string | null;
  semester: string;
  status: string;
  running_total: number | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
}

const emptyForm = {
  member_name: "",
  house: HOUSES[0],
  points: "",
  reason: "",
  evidence: "",
  semester: "2026-2027 Second Semester",
};

export default function AdminIndividualPointsPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  // Search, filter, and bulk actions
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "provisional" | "final" | "disputed">("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  // 1. Fetch current officer profile for RBAC
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  // 2. Determine if user can manage the ledger
  const canManage = officer ? RBAC.canManageIndividualPoints(officer.role as Role) : false;

  async function fetchTransactions(reset = false) {
    setLoading(true);
    setError(null);
    const currentPage = reset ? 1 : page;
    try {
      const res = await fetch(`/api/admin/individual-points?page=${currentPage}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch transactions.");
      
      const json = (await res.json()) as { data?: Transaction[]; count?: number };
      const txData: Transaction[] = json.data ?? [];
      const count = json.count ?? 0;

      if (reset) {
        setTransactions(txData);
      } else {
        setTransactions((prev) => [...prev, ...txData]);
      }
      setHasMore((currentPage * limit) < count);
      setPage(currentPage);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  }

  async function submitTransaction(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const points = parseInt(form.points, 10);
    if (isNaN(points) || points === 0) {
      toast.error("Points must be a non-zero number.");
      return;
    }

    // Optimistic update
    const tempId = Date.now();
    const newTx: Transaction = {
      id: tempId,
      created_at: new Date().toISOString(),
      member_name: form.member_name,
      house: form.house,
      points,
      reason: form.reason,
      evidence: form.evidence || null,
      semester: form.semester,
      status: "provisional",
      running_total: null,
      reviewed_at: null,
      reviewed_by: null,
      notes: null,
    };
    setTransactions((prev) => [newTx, ...prev]);

    try {
      const res = await fetch("/api/admin/individual-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_name: form.member_name,
          house: form.house,
          points,
          reason: form.reason,
          evidence: form.evidence || null,
          semester: form.semester,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to submit.");
      }
      
      const data = (await res.json()) as unknown as Transaction;
      setTransactions((prev) => prev.map((t) => (t.id === tempId ? data : t)));
      toast.success(`${points > 0 ? "Added" : "Deducted"} ${Math.abs(points)} points ${points > 0 ? "to" : "from"} ${form.member_name}. (Status: Provisional)`);
      setForm(emptyForm);
      setShowForm(false);
    } catch (err: any) {
      setTransactions((prev) => prev.filter((t) => t.id !== tempId));
      toast.error(err.message || "Failed to submit transaction.");
    }
  }

  async function updateStatus(id: number, status: string) {
    const note = notes[id] ?? null;
    const previousTransactions = [...transactions];
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, notes: note } : t))
    );

    try {
      const res = await fetch("/api/admin/individual-points", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes: note, reviewed_at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Failed to update.");
      
      const data = (await res.json()) as unknown as Transaction;
      setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)));
      toast.success(`Marked as ${status}.`);
    } catch (err) {
      setTransactions(previousTransactions);
      toast.error("Failed to update transaction.");
    }
  }

  async function bulkUpdateStatus(status: "final" | "disputed") {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const previousTransactions = [...transactions];
    
    setTransactions((prev) =>
      prev.map((t) =>
        selectedIds.has(t.id) ? { ...t, status, notes: notes[t.id] ?? null } : t
      )
    );

    try {
      const res = await fetch("/api/admin/individual-points", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      });
      if (!res.ok) throw new Error("Failed to update.");
      
      const data = (await res.json()) as unknown as Transaction[];
      setTransactions((prev) =>
        prev.map((t) => {
          const match = data.find((d) => d.id === t.id);
          return match ?? t;
        })
      );
      toast.success(`${selectedIds.size} transactions marked as ${status}.`);
      setSelectedIds(new Set());
    } catch (err) {
      setTransactions(previousTransactions);
      toast.error("Some transactions failed to update.");
    }
  }

  async function deleteTransaction(id: number) {
    const previousTransactions = [...transactions];
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch("/api/admin/individual-points", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Transaction deleted.");
    } catch (err) {
      setTransactions(previousTransactions);
      toast.error("Failed to delete transaction.");
    }
  }

  const exportToCSV = () => {
    const headers = ["ID", "Date", "Member Name", "House", "Points", "Reason", "Semester", "Status", "Running Total"];
    const rows = filteredTransactions.map(t => [
      t.id,
      new Date(t.created_at).toLocaleDateString(),
      `"${t.member_name.replace(/"/g, '""')}"`,
      t.house,
      t.points,
      `"${t.reason.replace(/"/g, '""')}"`,
      t.semester,
      t.status,
      t.running_total ?? ""
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(r => r.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `individual_points_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.member_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reason.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  const provisionalInFilter = filteredTransactions.filter(t => t.status === "provisional");

  const toggleSelectAll = () => {
    if (provisionalInFilter.length > 0 && provisionalInFilter.every(t => selectedIds.has(t.id))) {
      const newSet = new Set(selectedIds);
      provisionalInFilter.forEach(t => newSet.delete(t.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      provisionalInFilter.forEach(t => newSet.add(t.id));
      setSelectedIds(newSet);
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const inputCls = "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const btnPrimary = "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnSecondary = "rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Individual Debate Point Ledger</h1>
        <p className="text-sm text-neutral-400">
          Record and manage individual member debate points per Article III, Section 6. 
          Review and approve member-submitted claims.
        </p>
      </div>

      {/* RBAC Notice for View-Only Users */}
      {!canManage && officer && (
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-300/80">
            <strong className="text-amber-200">View Only:</strong> Per Article III, Section 6 of the Rules & Procedures, 
            only the <strong className="text-white">Secretary of Internal Affairs (Point Keeper)</strong> or the 
            <strong className="text-white"> President</strong> can modify the Individual Debate Point Ledger. 
            You may view the ledger for oversight and transparency purposes.
          </p>
        </div>
      )}

      {/* Feedback Messages */}
      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Tabs & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search by member name or reason..."
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
            <option value="provisional">Provisional</option>
            <option value="final">Final</option>
            <option value="disputed">Disputed</option>
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

        <div className="flex gap-2">
          {!fetched && (
            <button
              onClick={() => fetchTransactions(true)}
              disabled={loading}
              className={btnPrimary}
            >
              {loading ? "Loading…" : "Load Ledger"}
            </button>
          )}
          {/* Manual Entry Button (RBAC Protected) */}
          {fetched && !showForm && canManage && (
            <button
              onClick={() => {
                setShowForm(true);
                setForm(emptyForm);
              }}
              className={btnPrimary}
            >
              + Manual Entry
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Panel (RBAC Protected) */}
      {selectedIds.size > 0 && canManage && (
        <div className="flex items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2">
          <span className="text-sm font-medium text-neutral-300">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => bulkUpdateStatus("final")}
            className="rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
          >
            Approve (Final)
          </button>
          <button
            onClick={() => bulkUpdateStatus("disputed")}
            className="rounded-lg bg-red-800 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700"
          >
            Dispute
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
          >
            Clear
          </button>
        </div>
      )}

      {/* Select All Header (RBAC Protected) */}
      {fetched && provisionalInFilter.length > 0 && canManage && (
        <div className="flex items-center gap-3 px-2">
          <input
            type="checkbox"
            checked={provisionalInFilter.every(t => selectedIds.has(t.id))}
            onChange={toggleSelectAll}
            className="size-4 shrink-0 rounded border-neutral-600 bg-neutral-800 accent-emerald-500"
          />
          <span className="text-sm text-neutral-400">Select all visible provisional claims</span>
        </div>
      )}

      {/* Manual Entry Form (RBAC Protected) */}
      {showForm && canManage && (
        <form
          onSubmit={submitTransaction}
          className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-lg"
        >
          <h2 className="mb-6 text-lg font-semibold text-white">Manual Point Entry</h2>
          <div className="mx-auto max-w-xl space-y-4">
            <div>
              <label htmlFor="ind-name" className={labelCls}>Member Name</label>
              <input id="ind-name" value={form.member_name} onChange={(e) => setForm((p) => ({ ...p, member_name: e.target.value }))} required placeholder="Juan dela Cruz" className={inputCls} />
            </div>
            <div>
              <label htmlFor="ind-house" className={labelCls}>House</label>
              <select id="ind-house" value={form.house} onChange={(e) => setForm((p) => ({ ...p, house: e.target.value }))} className={inputCls}>
                {HOUSES.map((h) => (<option key={h} value={h}>{HOUSE_LABELS[h]}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="ind-points" className={labelCls}>Points (+/-)</label>
              <input id="ind-points" type="number" value={form.points} onChange={(e) => setForm((p) => ({ ...p, points: e.target.value }))} required placeholder="e.g. 25 or -10" className={inputCls} />
            </div>
            <div>
              <label htmlFor="ind-reason" className={labelCls}>Reason</label>
              <input id="ind-reason" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} required placeholder="e.g. Best Speaker at Inter-House Debate" className={inputCls} />
            </div>
            <div>
              <label htmlFor="ind-evidence" className={labelCls}>Evidence / Reference <span className="text-neutral-500">(optional)</span></label>
              <input id="ind-evidence" value={form.evidence} onChange={(e) => setForm((p) => ({ ...p, evidence: e.target.value }))} placeholder="e.g. Tournament Results Report" className={inputCls} />
            </div>
            <div>
              <label htmlFor="ind-semester" className={labelCls}>Semester</label>
              <input id="ind-semester" value={form.semester} onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))} required className={inputCls} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className={btnPrimary}>Submit</button>
              <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }} className={btnSecondary}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* Transactions List */}
      {fetched && filteredTransactions.length === 0 && (
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 text-center text-neutral-400">
          {transactions.length === 0 ? "No transactions recorded yet." : "No transactions match your filters."}
        </div>
      )}

      {fetched && filteredTransactions.length > 0 && (
        <div className="space-y-4">
          {filteredTransactions.map((tx) => {
            const color = HOUSE_COLORS[tx.house] ?? "#666";
            const isExpanded = expandedId === tx.id;
            const isSelected = selectedIds.has(tx.id);
            const isProvisional = tx.status === "provisional";

            return (
              <article
                key={tx.id}
                className={`rounded-3xl border bg-neutral-950/95 p-6 shadow-lg transition-all ${
                  isProvisional
                    ? isSelected
                      ? "border-emerald-800/60 ring-1 ring-emerald-800/30"
                      : "border-amber-800/60 ring-1 ring-amber-800/30"
                    : "border-neutral-800"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  {/* Row Checkbox (Only for provisional & if user can manage) */}
                  {isProvisional && canManage && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(tx.id)}
                      className="mt-1 size-4 shrink-0 rounded border-neutral-600 bg-neutral-800 accent-emerald-500"
                    />
                  )}
                  
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {tx.house[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">{tx.member_name}</h3>
                    <p className="text-xs text-neutral-400">
                      {tx.house} · {tx.semester} · {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold tabular-nums ${tx.points > 0 ? "text-emerald-400" : tx.points < 0 ? "text-red-400" : "text-neutral-400"}`}>
                      {tx.points > 0 ? "+" : ""}{tx.points}
                    </p>
                    <p className="text-xs text-neutral-500">→ {tx.running_total?.toLocaleString() ?? "—"}</p>
                  </div>
                  
                  {/* Status Badge with Tooltip */}
                  {tx.status === "provisional" ? (
                    <Tooltip content="Provisional for 7 days. Subject to petition per R&P Art. III, Annex A, Sec. 5.">
                      <span className="cursor-help rounded-full bg-amber-900/60 px-2.5 py-1 text-xs font-semibold text-amber-300 capitalize">
                        {tx.status}
                      </span>
                    </Tooltip>
                  ) : (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[tx.status] ?? "bg-neutral-800 text-neutral-300"}`}>
                      {tx.status}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-sm text-neutral-300">{tx.reason}</p>
                  {tx.evidence && (
                    <p className="mt-1 text-xs text-neutral-500">Evidence: {tx.evidence}</p>
                  )}
                </div>

                {/* Expand for review (Only shown for provisional/claims & if user can manage) */}
                {isProvisional && canManage && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                      className="text-sm font-medium text-amber-400 transition hover:text-amber-300"
                    >
                      {isExpanded ? "Hide review" : "Review Claim"}
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-3 space-y-3 border-t border-neutral-800 pt-4">
                        <textarea
                          placeholder="Review notes…"
                          value={notes[tx.id] ?? ""}
                          onChange={(e) => setNotes((p) => ({ ...p, [tx.id]: e.target.value }))}
                          rows={2}
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateStatus(tx.id, "final")}
                            className="rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                          >
                            Approve (Final)
                          </button>
                          <button
                            onClick={() => updateStatus(tx.id, "disputed")}
                            className="rounded-full bg-red-800 px-4 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                          >
                            Dispute
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="rounded-full bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
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
                onClick={() => fetchTransactions(false)}
                disabled={loading}
                className="rounded-full border border-neutral-700 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white disabled:opacity-50"
              >
                {loading ? "Loading more..." : "Load More Transactions"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}