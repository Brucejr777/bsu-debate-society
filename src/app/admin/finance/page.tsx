"use client";

import { useState, type FormEvent } from "react";

const RECORD_TYPES = [
  { value: "snapshot", label: "Monthly Snapshot" },
  { value: "report", label: "Semester Report" },
];

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
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FinancialRecord | null>(null);

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/finance");
    if (!res.ok) { setError("Failed to fetch records."); setLoading(false); return; }
    setRecords(await res.json());
    setLoaded(true);
    setLoading(false);
  }

  function flash(msg: string) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const body = {
      record_type: fd.get("record_type") as string,
      period_start: fd.get("period_start") as string,
      period_end: fd.get("period_end") as string,
      opening_balance: parseFloat(fd.get("opening_balance") as string) || 0,
      income_total: parseFloat(fd.get("income_total") as string) || 0,
      expenses_total: parseFloat(fd.get("expenses_total") as string) || 0,
      closing_balance: parseFloat(fd.get("closing_balance") as string) || 0,
      income_breakdown: (fd.get("income_breakdown") as string) || null,
      expense_breakdown: (fd.get("expense_breakdown") as string) || null,
      notable_transactions: (fd.get("notable_transactions") as string) || null,
      notes: (fd.get("notes") as string) || null,
      published: fd.get("published") === "on",
    };

    const res = editing
      ? await fetch("/api/finance", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...body }),
        })
      : await fetch("/api/finance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (!res.ok) { const err = await res.json(); setError(err.error ?? "Failed."); return; }

    flash(editing ? "Record updated." : "Record published.");
    setShowForm(false);
    setEditing(null);
    await fetchRecords();
  }

  async function deleteRecord(id: number) {
    const res = await fetch("/api/finance", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) { const err = await res.json(); setError(err.error ?? "Failed."); return; }
    flash("Record deleted.");
    await fetchRecords();
  }

  const inputCls = "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const btnPrimary = "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnDanger = "rounded-full bg-red-800/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-700";
  const btnEdit = "rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";

  const fmt = (n: number) => n.toLocaleString("en-PH", { style: "currency", currency: "PHP" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Financial Records</h1>
        <p className="text-sm text-neutral-400">
          Publish Monthly Financial Snapshots and Semester Financial Reports per
          Article V, Section 7.
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
      {actionMsg && (
        <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">{actionMsg}</div>
      )}

      {/* Load Button */}
      {!loaded && (
        <button onClick={fetchRecords} disabled={loading} className={btnPrimary}>
          {loading ? "Loading…" : "Load Records"}
        </button>
      )}

      {/* Add Button */}
      {loaded && (
        <button onClick={() => { setShowForm(true); setEditing(null); }} className={btnPrimary}>
          + Add Record
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-950/95 p-6">
          <h3 className="text-lg font-medium text-white">{editing ? "Edit Record" : "New Financial Record"}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Record Type</label>
              <select name="record_type" defaultValue={editing?.record_type ?? "snapshot"} className={inputCls}>
                {RECORD_TYPES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Published</label>
              <div className="mt-2 flex items-center gap-2">
                <input type="checkbox" name="published" defaultChecked={editing?.published ?? true} className="size-4 rounded border-neutral-600 bg-neutral-800" />
                <span className="text-sm text-neutral-400">Visible on public page</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>Period Start</label>
              <input name="period_start" type="date" required defaultValue={editing?.period_start} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Period End</label>
              <input name="period_end" type="date" required defaultValue={editing?.period_end} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Opening Balance (₱)</label>
              <input name="opening_balance" type="number" step="0.01" required defaultValue={editing?.opening_balance ?? 0} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Income Total (₱)</label>
              <input name="income_total" type="number" step="0.01" required defaultValue={editing?.income_total ?? 0} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Expenses Total (₱)</label>
              <input name="expenses_total" type="number" step="0.01" required defaultValue={editing?.expenses_total ?? 0} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Closing Balance (₱)</label>
              <input name="closing_balance" type="number" step="0.01" required defaultValue={editing?.closing_balance ?? 0} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Income Breakdown</label>
              <textarea name="income_breakdown" rows={3} placeholder={"Membership dues: ₱5,000\nTournament fees: ₱3,000"} defaultValue={editing?.income_breakdown ?? ""} className={inputCls + " resize-none"} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Expense Breakdown</label>
              <textarea name="expense_breakdown" rows={3} placeholder={"Venue rental: ₱2,000\nPrinting: ₱500"} defaultValue={editing?.expense_breakdown ?? ""} className={inputCls + " resize-none"} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Notable Transactions</label>
              <textarea name="notable_transactions" rows={2} defaultValue={editing?.notable_transactions ?? ""} className={inputCls + " resize-none"} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Notes</label>
              <input name="notes" defaultValue={editing?.notes ?? ""} placeholder="Optional notes" className={inputCls} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className={btnPrimary}>{editing ? "Update" : "Publish"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white">Cancel</button>
          </div>
        </form>
      )}

      {/* Records List */}
      {loaded && records.length === 0 && <p className="text-sm text-neutral-500">No financial records yet.</p>}
      {loaded && records.length > 0 && (
        <div className="space-y-3">
          {records.map((r) => (
            <article key={r.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">
                      {r.record_type === "report" ? "Semester Report" : "Monthly Snapshot"}
                    </h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.published ? "bg-emerald-900/60 text-emerald-300" : "bg-neutral-800 text-neutral-500"}`}>
                      {r.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">
                    {new Date(r.period_start).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    {" → "}
                    {new Date(r.period_end).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-xs sm:grid-cols-4">
                    <p>Opening: <span className="text-neutral-300">{fmt(r.opening_balance)}</span></p>
                    <p>Income: <span className="text-emerald-400">{fmt(r.income_total)}</span></p>
                    <p>Expenses: <span className="text-red-400">{fmt(r.expenses_total)}</span></p>
                    <p>Closing: <span className="text-neutral-300 font-semibold">{fmt(r.closing_balance)}</span></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(r); setShowForm(true); }} className={btnEdit}>Edit</button>
                  <button onClick={() => deleteRecord(r.id)} className={btnDanger}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
