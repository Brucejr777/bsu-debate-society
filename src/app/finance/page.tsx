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

          {/* ═══════════════════════════════════════ */}
          {/* FINANCIAL MANAGEMENT GUIDE              */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Financial Management Guide
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Rules and Procedures, Article V
              </p>
            </div>

            {/* Resource Classification */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-neutral-300">
                      <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Resource Classification</h3>
                    <p className="text-sm italic text-neutral-500">— Article V, Section 2</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <h4 className="text-base font-semibold text-blue-200">Society-Wide Resources</h4>
                    <p className="mt-2 text-xs text-neutral-400">Managed by the High Council via OFRA for the benefit of the entire Society.</p>
                    <ul className="mt-3 space-y-1 text-xs text-neutral-500">
                      <li>• General Fund (membership dues, tournament revenues, grants, donations)</li>
                      <li>• Society Assets (equipment, digital platforms, intellectual property)</li>
                      <li>• Central Logistics (venue bookings, transportation, Society-wide events)</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <h4 className="text-base font-semibold text-emerald-200">House Resources</h4>
                    <p className="mt-2 text-xs text-neutral-400">Managed by the respective House Council for its members.</p>
                    <ul className="mt-3 space-y-1 text-xs text-neutral-500">
                      <li>• House Treasury (House-specific initiatives, allocated bonuses, contributions)</li>
                      <li>• House Assets (equipment, materials, creative works)</li>
                      <li>• House Logistics (House Assemblies, House-led initiatives)</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs italic text-neutral-500 mt-2">No commingling of funds without prior written approval from the President and COC.</p>
              </div>
            </article>

            {/* Budget Preparation */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-amber-400">
                      <path d="M10.464 2.432a3.75 3.75 0 0 1 3.072 0l1.965.982A4.125 4.125 0 0 1 18 7.327V9a2.625 2.625 0 0 1-1.893 2.517c-.28.077-.57.133-.866.167a2.625 2.625 0 0 1-1.279 1.998l-.567.378a2.625 2.625 0 0 1-2.922 0l-.567-.378a2.625 2.625 0 0 1-1.279-1.998 3.75 3.75 0 0 1-.866-.167A2.625 2.625 0 0 1 6 9V7.327a4.125 4.125 0 0 1 2.501-3.913l1.965-.982Z" />
                      <path d="M3.75 12.75a.75.75 0 0 1 .75.75v5.25c0 1.035.84 1.875 1.875 1.875h11.25A1.875 1.875 0 0 0 19.5 18.75V13.5a.75.75 0 0 1 1.5 0v5.25A3.375 3.375 0 0 1 17.625 22.125H6.375A3.375 3.375 0 0 1 3 18.75V13.5a.75.75 0 0 1 .75-.75Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-200">Budget Preparation & Approval</h3>
                    <p className="text-sm italic text-neutral-500">— Article V, Section 3</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <h4 className="text-base font-semibold text-blue-200">Society-Wide Budget</h4>
                    <ul className="mt-3 space-y-1.5 text-left text-xs text-neutral-400">
                      <li className="flex gap-2"><span className="font-semibold text-white">Timeline:</span> Drafted 30 days before the academic year.</li>
                      <li className="flex gap-2"><span className="font-semibold text-white">Consultation:</span> Circulated to all Houses and offices 21 days before submission.</li>
                      <li className="flex gap-2"><span className="font-semibold text-white">Approval:</span> Majority vote of COC + concurrence of the President.</li>
                      <li className="flex gap-2"><span className="font-semibold text-white">Publication:</span> Posted within 5 business days of adoption.</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <h4 className="text-base font-semibold text-emerald-200">House Budget</h4>
                    <ul className="mt-3 space-y-1.5 text-left text-xs text-neutral-400">
                      <li className="flex gap-2"><span className="font-semibold text-white">Timeline:</span> Drafted 14 days before each semester.</li>
                      <li className="flex gap-2"><span className="font-semibold text-white">Approval:</span> Majority vote of House Council + House Chancellor approval.</li>
                      <li className="flex gap-2"><span className="font-semibold text-white">Reporting:</span> Copy submitted to OFRA within 3 business days.</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Supplemental Budget Requests may be submitted for unforeseen needs, requiring endorsement and approval based on scope.</p>
              </div>
            </article>

            {/* Mandatory Sustainability Levy */}
            <article className="rounded-3xl border border-purple-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-purple-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-purple-400">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-200">20% Sustainability Levy</h3>
                    <p className="text-sm italic text-neutral-500">— Constitution Art 7, §2(10) & Article V, §3(4)</p>
                  </div>
                </div>
                <p className="text-base leading-7 text-neutral-300">
                  Each House Council shall remit <strong className="text-white">twenty percent (20%)</strong> of its
                  unrestricted semester-end surplus funds to the Society General Fund as a mandatory
                  Society Sustainability Levy. The remaining <strong className="text-white">eighty percent (80%)</strong> remains
                  under the exclusive management of the respective House Council.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                  <div className="rounded-2xl bg-neutral-900 p-4">
                    <p className="text-lg font-bold text-purple-400">14 days</p>
                    <p className="text-xs text-neutral-400">after semester-end to submit Financial Reconciliation Report to OFRA</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-4">
                    <p className="text-lg font-bold text-purple-400">7 business days</p>
                    <p className="text-xs text-neutral-400">after OFRA verification to remit the levy</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-4">
                    <p className="text-lg font-bold text-purple-400">Semi-annual</p>
                    <p className="text-xs text-neutral-400">utilization report published to Society Assembly</p>
                  </div>
                </div>
                <p className="text-xs italic text-neutral-500">Funds subject to external donor restrictions, university grants, or legally encumbered obligations are exempt.</p>
              </div>
            </article>

            {/* Disbursement Thresholds */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-emerald-400">
                      <path d="M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-1.5 8.26a.75.75 0 0 0-1.5 0 5 5 0 0 0 2.25 4.12v.87a.75.75 0 0 0 1.5 0v-.87a5 5 0 0 0 2.25-4.12.75.75 0 0 0-1.5 0 3.5 3.5 0 0 1-7 0Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-emerald-200">Disbursement Authorization Thresholds</h3>
                    <p className="text-sm italic text-neutral-500">— Article V, Section 4(1)</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                  <div className="rounded-2xl border border-emerald-900/30 bg-neutral-900/80 p-5">
                    <div className="flex items-center gap-2 mb-2 justify-center">
                      <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-xs font-semibold text-emerald-300">Minor</span>
                    </div>
                    <p className="text-2xl font-bold text-white">≤ ₱500</p>
                    <p className="mt-2 text-xs text-neutral-400">May be authorized by the House Chancellor or High Council Secretary with prior budget allocation.</p>
                  </div>
                  <div className="rounded-2xl border border-amber-900/30 bg-neutral-900/80 p-5">
                    <div className="flex items-center gap-2 mb-2 justify-center">
                      <span className="rounded-full bg-amber-900/60 px-2 py-0.5 text-xs font-semibold text-amber-300">Standard</span>
                    </div>
                    <p className="text-2xl font-bold text-white">₱501 – ₱2,000</p>
                    <p className="mt-2 text-xs text-neutral-400">Requires written approval from the President (Society-wide) or House Chancellor (House-level) with supporting documentation.</p>
                  </div>
                  <div className="rounded-2xl border border-red-900/30 bg-neutral-900/80 p-5">
                    <div className="flex items-center gap-2 mb-2 justify-center">
                      <span className="rounded-full bg-red-900/60 px-2 py-0.5 text-xs font-semibold text-red-300">Major</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{">"} ₱2,000</p>
                    <p className="mt-2 text-xs text-neutral-400">Requires majority vote of COC (Society-wide) or House Council (House-level) with prior budget allocation and justification.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Reimbursement Process */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4">
                <h3 className="text-xl font-semibold text-white text-center">Reimbursement Process</h3>
                <p className="text-sm italic text-neutral-500 text-center">— Article V, Section 4(2)</p>
                <div className="space-y-4 mt-4">
                  {[
                    { step: "1", title: "Submit Request", desc: "Submit a Reimbursement Request Form within 7 calendar days of incurring the expense. Include official receipts, purpose, budget line reference, and authorizing officer's signature." },
                    { step: "2", title: "Verification", desc: "OFRA (Society-wide) or House Financial Director (House-level) verifies receipts and budget alignment within 3 business days." },
                    { step: "3", title: "Processing", desc: "Approved reimbursements are processed within 5 business days. Payment is made via cash, bank transfer, or other documented method." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-sm font-bold text-white">{item.step}</div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-neutral-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Procurement Guidelines */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-blue-400">
                      <path d="M3.375 3C2.339 3 1.5 3.839 1.5 4.875v.75c0 1.036.839 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                      <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-200">Procurement Guidelines</h3>
                    <p className="text-sm italic text-neutral-500">— Article V, Section 5</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <h4 className="text-sm font-semibold text-white">Quotation Requirement</h4>
                    <p className="mt-2 text-xs text-neutral-400">Purchases above <strong className="text-white">₱1,000</strong> require at least two (2) price quotations from different suppliers, documented and attached to the purchase request.</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <h4 className="text-sm font-semibold text-white">Sustainable Procurement</h4>
                    <p className="mt-2 text-xs text-neutral-400">Purchases exceeding <strong className="text-white">₱2,000</strong> require a Sustainability Impact Statement considering local suppliers, environmental impact, reusability, and alignment with the Society's sustainability goals.</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5 mt-4">
                  <h4 className="text-sm font-semibold text-white">Exemptions</h4>
                  <p className="mt-2 text-xs text-neutral-400">Sustainability Impact Statement requirement does not apply to emergency procurements, purchases with no sustainable alternative, University-mandated vendors, or expenditures below the Minor threshold (≤₱500).</p>
                </div>
              </div>
            </article>

            {/* Asset Inventory */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <h3 className="text-xl font-semibold text-white">Asset Inventory & Check-Out</h3>
                <p className="text-sm italic text-neutral-500">— Article V, Section 5(2)</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                  <div className="rounded-2xl bg-neutral-900 p-4">
                    <p className="text-sm font-semibold text-white">Digital Ledger</p>
                    <p className="mt-1 text-xs text-neutral-400">OFRA (Society) and House Financial Directors (House) maintain a digital Asset Inventory Ledger with item description, serial number, cost, custodian, and location.</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-4">
                    <p className="text-sm font-semibold text-white">Check-Out System</p>
                    <p className="mt-1 text-xs text-neutral-400">Members borrowing assets sign a Check-Out Form acknowledging responsibility. Damaged or lost items reported immediately; replacement costs may be assessed.</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-4">
                    <p className="text-sm font-semibold text-white">Annual Audit</p>
                    <p className="mt-1 text-xs text-neutral-400">A physical inventory audit is conducted at the end of every semester. Discrepancies are reported to the High Council for resolution.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Income-Generating Projects */}
            <article className="rounded-3xl border border-emerald-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-emerald-400">
                      <path d="M10.464 2.432a3.75 3.75 0 0 1 3.072 0l1.965.982A4.125 4.125 0 0 1 18 7.327V9a2.625 2.625 0 0 1-1.893 2.517c-.28.077-.57.133-.866.167a2.625 2.625 0 0 1-1.279 1.998l-.567.378a2.625 2.625 0 0 1-2.922 0l-.567-.378a2.625 2.625 0 0 1-1.279-1.998 3.75 3.75 0 0 1-.866-.167A2.625 2.625 0 0 1 6 9V7.327a4.125 4.125 0 0 1 2.501-3.913l1.965-.982Z" />
                      <path d="M3.75 12.75a.75.75 0 0 1 .75.75v5.25c0 1.035.84 1.875 1.875 1.875h11.25A1.875 1.875 0 0 0 19.5 18.75V13.5a.75.75 0 0 1 1.5 0v5.25A3.375 3.375 0 0 1 17.625 22.125H6.375A3.375 3.375 0 0 1 3 18.75V13.5a.75.75 0 0 1 .75-.75Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-emerald-200">Income-Generating Projects (IGPs)</h3>
                    <p className="text-sm italic text-neutral-500">— Article V, Section 6</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <h4 className="text-sm font-semibold text-blue-200">Society-Wide IGPs</h4>
                    <p className="mt-2 text-xs text-neutral-400">Proposed by any High Council office or House Council. Must include project description, target revenue, budget, timeline, and risk assessment.</p>
                    <p className="mt-2 text-xs text-neutral-500">Approval: Majority vote of COC + concurrence of the President. Net proceeds go to the General Fund.</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <h4 className="text-sm font-semibold text-emerald-200">House-Level IGPs</h4>
                    <p className="mt-2 text-xs text-neutral-400">Approved by majority vote of the House Council and the House Chancellor. A copy of the proposal and post-project financial report is submitted to OFRA.</p>
                    <p className="mt-2 text-xs text-neutral-500">Net proceeds stay with the House unless Society-Wide Resources were used.</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 text-center mt-2">External grants and sponsorships must be coordinated through the Office of External Affairs.</p>
              </div>
            </article>

            {/* Loan Services */}
            <article className="rounded-3xl border border-amber-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-amber-400">
                      <path d="M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-1.5 8.26a.75.75 0 0 0-1.5 0 5 5 0 0 0 2.25 4.12v.87a.75.75 0 0 0 1.5 0v-.87a5 5 0 0 0 2.25-4.12.75.75 0 0 0-1.5 0 3.5 3.5 0 0 1-7 0Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-200">Loan Services</h3>
                    <p className="text-sm italic text-neutral-500">— Article V, Section 9</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                  <div className="rounded-2xl border border-emerald-900/30 bg-neutral-900/80 p-5">
                    <h4 className="text-sm font-semibold text-emerald-200">Authority to Lend</h4>
                    <p className="mt-2 text-xs text-neutral-400">The Society may offer loan services to Houses or active members for approved Society-related activities.</p>
                  </div>
                  <div className="rounded-2xl border border-red-900/30 bg-neutral-900/80 p-5">
                    <h4 className="text-sm font-semibold text-red-200">Prohibition on Borrowing</h4>
                    <p className="mt-2 text-xs text-neutral-400">The Society is prohibited from securing external loans or indebtedness that exceeds its current assets.</p>
                  </div>
                  <div className="rounded-2xl border border-amber-900/30 bg-neutral-900/80 p-5">
                    <h4 className="text-sm font-semibold text-amber-200">Repayment Terms</h4>
                    <p className="mt-2 text-xs text-neutral-400">All loans must be paid within the academic year they were incurred. Installment payments may be available subject to OFRA approval.</p>
                  </div>
                </div>
                <p className="text-xs italic text-neutral-500 mt-2">Default → suspension of financial privileges and potential Major Violation classification under Article VI.</p>
              </div>
            </article>

            {/* Prohibited Acts & Sanctions */}
            <article className="rounded-3xl border border-red-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-400">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-200">Prohibited Acts & Sanctions</h3>
                    <p className="text-sm italic text-neutral-500">— Article V, Section 8</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="rounded-2xl border border-red-900/30 bg-neutral-900/80 p-5">
                    <h4 className="text-sm font-semibold text-red-200">Prohibited Acts</h4>
                    <ul className="mt-3 space-y-1 text-left text-xs text-neutral-400">
                      <li className="flex gap-2">• <span>Commingling funds without written approval</span></li>
                      <li className="flex gap-2">• <span>Unauthorized disbursement outside approved budget</span></li>
                      <li className="flex gap-2">• <span>Falsification of receipts or financial data</span></li>
                      <li className="flex gap-2">• <span>Personal gain from Society/House position or resources</span></li>
                      <li className="flex gap-2">• <span>Negligent custody resulting in loss or damage</span></li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-red-900/30 bg-neutral-900/80 p-5">
                    <h4 className="text-sm font-semibold text-red-200">Sanctions</h4>
                    <ul className="mt-3 space-y-1 text-left text-xs text-neutral-400">
                      <li className="flex gap-2">• <span>Restitution of misused funds</span></li>
                      <li className="flex gap-2">• <span>Suspension of financial privileges</span></li>
                      <li className="flex gap-2">• <span>Mandatory financial management training</span></li>
                      <li className="flex gap-2">• <span>Referral to University authorities for criminal conduct</span></li>
                      <li className="flex gap-2">• <span>Expulsion from the Society</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>
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
