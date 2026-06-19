// src/app/admin/finance/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import RBACGuard, { type Officer } from "@/components/RBACGuard";
import { RBAC, Role } from "@/lib/rbac";
import { downloadFinancialReportPDF } from "@/components/FinancialReportPDF";

const RECORD_TYPES = [
  { value: "all", label: "All Records" },
  { value: "snapshot", label: "Monthly Snapshot" },
  { value: "report", label: "Semester Report" },
];

const emptyForm = {
  record_type: "snapshot",
  period_start: "",
  period_end: "",
  opening_balance: "0",
  income_total: "0",
  expenses_total: "0",
  closing_balance: "0",
  income_breakdown: "",
  expense_breakdown: "",
  notable_transactions: "",
  notes: "",
  published: true,
};

interface FinancialRecord {
  id: number;
  created_at: string;
  record_type: string;
  period_start: string;
  period_end: string;
  opening_balance: number;
  income_total: number;
  expenses_total: number;
  closing_balance: number;
  income_breakdown: string | null;
  expense_breakdown: string | null;
  notable_transactions: string | null;
  notes: string | null;
  published: boolean;
}

export default function AdminFinancePage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FinancialRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // 1. Fetch current officer profile for RBAC
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  // 2. Determine if user can manage finances
  const canManage = officer ? RBAC.canManageFinance(officer.role as Role) : false;

  async function fetchRecords() {
    setLoading(true);
    try {
      const [snapRes, repRes] = await Promise.all([
        fetch("/api/finance?type=snapshot"),
        fetch("/api/finance?type=report"),
      ]);
      if (!snapRes.ok || !repRes.ok) throw new Error("Failed to fetch records.");
      const [snapData, repData] = await Promise.all([snapRes.json(), repRes.json()]);
      const allRecords = [...(snapData || []), ...(repData || [])].sort(
        (a, b) => new Date(b.period_start).getTime() - new Date(a.period_start).getTime()
      );
      setRecords(allRecords);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to load financial records.");
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const url = editing ? "/api/finance" : "/api/finance";
    const method = editing ? "PUT" : "POST";
    
    const payload = {
      ...(editing ? { id: editing.id } : {}),
      record_type: form.record_type,
      period_start: form.period_start,
      period_end: form.period_end,
      opening_balance: parseFloat(form.opening_balance) || 0,
      income_total: parseFloat(form.income_total) || 0,
      expenses_total: parseFloat(form.expenses_total) || 0,
      closing_balance: parseFloat(form.closing_balance) || 0,
      income_breakdown: form.income_breakdown || null,
      expense_breakdown: form.expense_breakdown || null,
      notable_transactions: form.notable_transactions || null,
      notes: form.notes || null,
      published: form.published,
    };

    // Optimistic update
    const tempId = editing ? editing.id : Date.now();
    const optimisticRecord = { ...payload, id: tempId, created_at: new Date().toISOString() };
    setRecords((prev) => 
      editing ? prev.map((r) => (r.id === tempId ? optimisticRecord : r)) : [optimisticRecord, ...prev]
    );

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save record.");
      }
      const data = await res.json();
      setRecords((prev) => 
        editing ? prev.map((r) => (r.id === tempId ? data : r)) : [data, ...prev]
      );
      toast.success(editing ? "Record updated successfully." : "Financial record created.");
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (err: any) {
      setRecords((prev) => prev.filter((r) => r.id !== tempId));
      toast.error(err.message || "Failed to save record.");
    }
  }

  async function deleteRecord(id: number) {
    if (!confirm("Are you sure you want to permanently delete this financial record?")) return;
    
    const previousRecords = [...records];
    setRecords((prev) => prev.filter((r) => r.id !== id));

    try {
      const res = await fetch("/api/finance", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Record deleted.");
    } catch (err) {
      setRecords(previousRecords);
      toast.error("Failed to delete record.");
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Period Start", "Period End", "Type", "Opening", "Income", "Expenses", "Closing", "Notes"
    ];
    const rows = filteredRecords.map((r) => [
      r.period_start, r.period_end, r.record_type, r.opening_balance,
      r.income_total, r.expenses_total, r.closing_balance, `"${r.notes?.replace(/"/g, '""') || ""}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `finance_records_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter((r) => {
    const matchesType = typeFilter === "all" || r.record_type === typeFilter;
    const matchesSearch =
      r.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.record_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.notable_transactions?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const inputCls = "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const selectCls = inputCls;
  const textareaCls = inputCls + " resize-none";
  const btnPrimary = "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnEdit = "rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";
  const btnDanger = "rounded-lg bg-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900";
  const btnExport = "rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white flex items-center gap-2";

  const fmt = (n: number) => `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Financial Records</h1>
        <p className="text-sm text-neutral-400">
          Manage monthly snapshots and semester reports per Constitution Article 8, Section 8.
          All records are subject to public transparency once published.
        </p>
      </div>

      {/* RBAC Notice for View-Only Users */}
      {!canManage && officer && (
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-300/80">
            <strong className="text-amber-200">View Only:</strong> Per the Society Constitution and Rules, 
            only the <strong className="text-white">Office of Financial and Resource Affairs (OFRA)</strong> or the 
            <strong className="text-white"> President</strong> can create, edit, or delete financial records. 
            You may view the ledger for transparency and oversight purposes.
          </p>
        </div>
      )}

      {/* Load Button */}
      {!fetched && (
        <button
          onClick={fetchRecords}
          disabled={loading}
          className={btnPrimary}
        >
          {loading ? "Loading…" : "Load Financial Records"}
        </button>
      )}

      {/* Filters & Actions Bar */}
      {fetched && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search by notes or notable transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
            </div>
            
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 sm:w-44"
            >
              {RECORD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={exportToCSV} className={btnExport}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
              Export CSV
            </button>
            {/* Add Record Button (RBAC Protected) */}
            {canManage && (
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditing(null);
                  setForm(emptyForm);
                }}
                className={btnPrimary}
              >
                + Add Record
              </button>
            )}
          </div>
        </div>
      )}

      {/* Form (RBAC Protected) */}
      {showForm && canManage && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl"
        >
          <h2 className="mb-6 text-lg font-semibold text-white">
            {editing ? "Edit Financial Record" : "New Financial Record"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelCls}>Record Type</label>
              <select name="record_type" value={form.record_type} onChange={handleFormChange} className={selectCls}>
                <option value="snapshot">Monthly Snapshot</option>
                <option value="report">Semester Report</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Period Start</label>
              <input type="date" name="period_start" value={form.period_start} onChange={handleFormChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Period End</label>
              <input type="date" name="period_end" value={form.period_end} onChange={handleFormChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Opening Balance</label>
              <input type="number" step="0.01" name="opening_balance" value={form.opening_balance} onChange={handleFormChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Income Total</label>
              <input type="number" step="0.01" name="income_total" value={form.income_total} onChange={handleFormChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Expenses Total</label>
              <input type="number" step="0.01" name="expenses_total" value={form.expenses_total} onChange={handleFormChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Closing Balance</label>
              <input type="number" step="0.01" name="closing_balance" value={form.closing_balance} onChange={handleFormChange} required className={inputCls} />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className={labelCls}>Notable Transactions</label>
              <input type="text" name="notable_transactions" value={form.notable_transactions} onChange={handleFormChange} className={inputCls} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelCls}>Income Breakdown</label>
              <textarea name="income_breakdown" value={form.income_breakdown} onChange={handleFormChange} rows={2} className={textareaCls} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelCls}>Expense Breakdown</label>
              <textarea name="expense_breakdown" value={form.expense_breakdown} onChange={handleFormChange} rows={2} className={textareaCls} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelCls}>Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={2} className={textareaCls} />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={form.published}
                onChange={handleFormChange}
                className="size-4 rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="published" className="text-sm font-medium text-neutral-300">Publish immediately (visible to public)</label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button type="submit" className={btnPrimary}>
              {editing ? "Update Record" : "Create Record"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }}
              className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Records List */}
      {fetched && filteredRecords.length === 0 && (
        <p className="text-sm text-neutral-500">
          {records.length === 0 ? "No financial records found." : "No records match your filters."}
        </p>
      )}

      {fetched && filteredRecords.length > 0 && (
        <div className="space-y-4">
          {filteredRecords.map((r) => (
            <article
              key={r.id}
              className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white capitalize">{r.record_type.replace(/_/g, " ")}</h3>
                    {r.published ? (
                      <span className="rounded-full bg-emerald-900/60 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">Published</span>
                    ) : (
                      <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Draft</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">
                    {new Date(r.period_start).toLocaleDateString()} → {new Date(r.period_end).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* Edit/Delete Buttons (RBAC Protected) */}
                  {canManage && (
                    <>
                      <button
                        onClick={() => {
                          setEditing(r);
                          setForm({
                            record_type: r.record_type,
                            period_start: r.period_start.split("T")[0],
                            period_end: r.period_end.split("T")[0],
                            opening_balance: r.opening_balance.toString(),
                            income_total: r.income_total.toString(),
                            expenses_total: r.expenses_total.toString(),
                            closing_balance: r.closing_balance.toString(),
                            income_breakdown: r.income_breakdown ?? "",
                            expense_breakdown: r.expense_breakdown ?? "",
                            notable_transactions: r.notable_transactions ?? "",
                            notes: r.notes ?? "",
                            published: r.published,
                          });
                          setShowForm(true);
                        }}
                        className={btnEdit}
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteRecord(r.id)} className={btnDanger}>
                        Delete
                      </button>
                    </>
                  )}
                  {!canManage && (
                    <button
                      onClick={() => downloadFinancialReportPDF([r])}
                      className="rounded-lg bg-blue-900/60 px-3 py-1.5 text-xs font-semibold text-blue-300 transition hover:bg-blue-900"
                    >
                      Download PDF
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
                <div className="rounded-lg bg-neutral-900 px-3 py-2">
                  <p className="text-xs text-neutral-500">Opening</p>
                  <p className="font-semibold tabular-nums text-neutral-300">{fmt(r.opening_balance)}</p>
                </div>
                <div className="rounded-lg bg-neutral-900 px-3 py-2">
                  <p className="text-xs text-neutral-500">Income</p>
                  <p className="font-semibold tabular-nums text-emerald-400">{fmt(r.income_total)}</p>
                </div>
                <div className="rounded-lg bg-neutral-900 px-3 py-2">
                  <p className="text-xs text-neutral-500">Expenses</p>
                  <p className="font-semibold tabular-nums text-red-400">{fmt(r.expenses_total)}</p>
                </div>
                <div className="rounded-lg bg-neutral-900 px-3 py-2">
                  <p className="text-xs text-neutral-500">Closing</p>
                  <p className="font-semibold tabular-nums text-white">{fmt(r.closing_balance)}</p>
                </div>
              </div>

              {(r.notable_transactions || r.notes) && (
                <div className="mt-3 space-y-1 text-xs">
                  {r.notable_transactions && (
                    <p className="text-neutral-400">
                      <span className="font-medium text-neutral-300">Notable:</span> {r.notable_transactions}
                    </p>
                  )}
                  {r.notes && (
                    <p className="text-neutral-400">
                      <span className="font-medium text-neutral-300">Notes:</span> {r.notes}
                    </p>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}