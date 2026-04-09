"use client";

import { useEffect, useState } from "react";

interface FinancialRecord {
  id: number;
  created_at: string;
  record_type: "snapshot" | "report";
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

export default function FinancePage() {
  const [snapshots, setSnapshots] = useState<FinancialRecord[]>([]);
  const [reports, setReports] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/finance?type=snapshot").then((r) => r.json()),
      fetch("/api/finance?type=report").then((r) => r.json()),
    ]).then(([s, r]) => {
      setSnapshots(Array.isArray(s) ? s : []);
      setReports(Array.isArray(r) ? r : []);
      setLoading(false);
    }).catch(() => {
      setError("Failed to load financial data.");
      setLoading(false);
    });
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString("en-PH", { style: "currency", currency: "PHP" });

  const periodLabel = (r: FinancialRecord) => {
    const s = new Date(r.period_start).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const e = new Date(r.period_end).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return s === e ? s : `${s} – ${e}`;
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Back */}
          <div>
            <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
              </svg>
              Back to Home
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Article V — Rules & Procedures
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Financial Transparency
            </h1>
          </div>

          {/* Intro */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Office of Financial and Resource Affairs (OFRA) publishes regular financial
              snapshots and semester reports to ensure transparency and accountability.
              All figures are presented in accordance with Article V, Section 7 of the Rules
              and Procedures.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article V, Section 7
            </p>
          </article>

          {/* Loading / Error */}
          {loading && <p className="text-center text-neutral-500">Loading financial data…</p>}
          {error && (
            <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Monthly Financial Snapshots */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Monthly Financial Snapshots</h2>
            {!loading && snapshots.length === 0 && (
              <p className="text-sm text-neutral-500">No financial snapshots published yet.</p>
            )}
            {snapshots.map((s) => (
              <article
                key={s.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{periodLabel(s)}</h3>
                    <p className="text-xs text-neutral-500">
                      Published {new Date(s.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="rounded-full border border-neutral-700 px-4 py-1.5 text-xs font-medium text-neutral-400 transition hover:text-white"
                  >
                    {expanded === s.id ? "Collapse" : "Details"}
                  </button>
                </div>

                {/* Summary Row */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-neutral-800/50 p-3 text-center">
                    <p className="text-xs text-neutral-500">Opening</p>
                    <p className="text-sm font-semibold text-white">{fmt(s.opening_balance)}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-900/30 p-3 text-center">
                    <p className="text-xs text-emerald-400">Income</p>
                    <p className="text-sm font-semibold text-emerald-300">{fmt(s.income_total)}</p>
                  </div>
                  <div className="rounded-xl bg-red-900/30 p-3 text-center">
                    <p className="text-xs text-red-400">Expenses</p>
                    <p className="text-sm font-semibold text-red-300">{fmt(s.expenses_total)}</p>
                  </div>
                  <div className="rounded-xl bg-neutral-800/50 p-3 text-center">
                    <p className="text-xs text-neutral-500">Closing</p>
                    <p className="text-sm font-semibold text-white">{fmt(s.closing_balance)}</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded === s.id && (
                  <div className="mt-4 space-y-3 border-t border-neutral-800 pt-4">
                    {s.income_breakdown && (
                      <div>
                        <p className="text-xs font-medium text-emerald-400">Income Breakdown</p>
                        <p className="mt-1 text-sm whitespace-pre-wrap text-neutral-300">{s.income_breakdown}</p>
                      </div>
                    )}
                    {s.expense_breakdown && (
                      <div>
                        <p className="text-xs font-medium text-red-400">Expense Breakdown</p>
                        <p className="mt-1 text-sm whitespace-pre-wrap text-neutral-300">{s.expense_breakdown}</p>
                      </div>
                    )}
                    {s.notable_transactions && (
                      <div>
                        <p className="text-xs font-medium text-neutral-400">Notable Transactions</p>
                        <p className="mt-1 text-sm whitespace-pre-wrap text-neutral-300">{s.notable_transactions}</p>
                      </div>
                    )}
                    {s.notes && (
                      <p className="text-xs italic text-neutral-500">{s.notes}</p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Semester Financial Reports */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Semester Financial Reports</h2>
            {!loading && reports.length === 0 && (
              <p className="text-sm text-neutral-500">No semester reports published yet.</p>
            )}
            {reports.map((r) => (
              <article key={r.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
                <h3 className="text-lg font-semibold text-white">{periodLabel(r)}</h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Published {new Date(r.created_at).toLocaleDateString()}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-neutral-800/50 p-3 text-center">
                    <p className="text-xs text-neutral-500">Opening</p>
                    <p className="text-sm font-semibold text-white">{fmt(r.opening_balance)}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-900/30 p-3 text-center">
                    <p className="text-xs text-emerald-400">Income</p>
                    <p className="text-sm font-semibold text-emerald-300">{fmt(r.income_total)}</p>
                  </div>
                  <div className="rounded-xl bg-red-900/30 p-3 text-center">
                    <p className="text-xs text-red-400">Expenses</p>
                    <p className="text-sm font-semibold text-red-300">{fmt(r.expenses_total)}</p>
                  </div>
                  <div className="rounded-xl bg-neutral-800/50 p-3 text-center">
                    <p className="text-xs text-neutral-500">Closing</p>
                    <p className="text-sm font-semibold text-white">{fmt(r.closing_balance)}</p>
                  </div>
                </div>
                {(r.income_breakdown || r.expense_breakdown || r.notable_transactions) && (
                  <div className="mt-4 space-y-3 border-t border-neutral-800 pt-4">
                    {r.income_breakdown && (
                      <div>
                        <p className="text-xs font-medium text-emerald-400">Income Breakdown</p>
                        <p className="mt-1 text-sm whitespace-pre-wrap text-neutral-300">{r.income_breakdown}</p>
                      </div>
                    )}
                    {r.expense_breakdown && (
                      <div>
                        <p className="text-xs font-medium text-red-400">Expense Breakdown</p>
                        <p className="mt-1 text-sm whitespace-pre-wrap text-neutral-300">{r.expense_breakdown}</p>
                      </div>
                    )}
                    {r.notable_transactions && (
                      <div>
                        <p className="text-xs font-medium text-neutral-400">Notable Transactions</p>
                        <p className="mt-1 text-sm whitespace-pre-wrap text-neutral-300">{r.notable_transactions}</p>
                      </div>
                    )}
                  </div>
                )}
                {r.notes && <p className="mt-2 text-xs italic text-neutral-500">{r.notes}</p>}
              </article>
            ))}
          </div>

          {/* Transparency Notice */}
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 text-center">
            <p className="text-sm text-neutral-400">
              Financial records are published within ten (10) business days after the end of each
              month. Semester reports are presented at the Society Assembly Meeting. For detailed
              records, please contact the Office of Financial and Resource Affairs.
            </p>
            <p className="mt-2 text-xs italic text-neutral-600">
              — Rules and Procedures, Article V, Section 7(1)–(2)
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
