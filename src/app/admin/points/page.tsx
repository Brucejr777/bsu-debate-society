// src/app/admin/points/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { Tooltip } from "@/components/Tooltip";
import RBACGuard, { type Officer } from "@/components/RBACGuard";
import { RBAC, Role } from "@/lib/rbac";

const HOUSES = ["Bathala", "Kabunian", "Laon", "Manama"];
const CATEGORIES = [
  "Competitive Excellence",
  "Organizational Contribution",
  "Governance & Compliance",
  "Conduct & Ethics",
];

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

const HOUSE_LABELS: Record<string, string> = {
  Bathala: "House of Bathala",
  Kabunian: "House of Kabunian",
  Laon: "House of Laon",
  Manama: "House of Manama",
};

const CATEGORY_KEYS: Record<string, keyof HousePoint> = {
  "Competitive Excellence": "competitive_excellence",
  "Organizational Contribution": "organizational_contribution",
  "Governance & Compliance": "governance_compliance",
  "Conduct & Ethics": "conduct_ethics",
};

interface HousePoint {
  id: number;
  created_at: string;
  house_name: string;
  total_points: number;
  competitive_excellence: number;
  organizational_contribution: number;
  governance_compliance: number;
  conduct_ethics: number;
  semester: string;
}

interface HousePointTransaction {
  id: number;
  created_at: string;
  house_name: string;
  category: string;
  points: number;
  reason: string;
  status: string;
  running_total: number | null;
}

export default function AdminPointsPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  
  const [points, setPoints] = useState<HousePoint[]>([]);
  const [transactions, setTransactions] = useState<HousePointTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // Pagination for transactions
  const [txPage, setTxPage] = useState(1);
  const [txHasMore, setTxHasMore] = useState(false);
  const [txLoading, setTxLoading] = useState(false);

  // Add points form
  const [houseName, setHouseName] = useState("Bathala");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [pointAmount, setPointAmount] = useState("");
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch current officer profile for RBAC
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [pointsRes, txRes] = await Promise.all([
        fetch("/api/admin/points"),
        fetch("/api/transactions?page=1&limit=10"),
      ]);
      if (!pointsRes.ok || !txRes.ok) throw new Error("Failed to fetch data");
      
      const pointsData = await pointsRes.json();
      const { data: txData, count: txCount } = await txRes.json();
      
      setPoints(pointsData);
      setTransactions(txData || []);
      setTxPage(1);
      setTxHasMore((txData || []).length < (txCount || 0));
      setFetched(true);
    } catch (err) {
      toast.error("Failed to fetch ledger data.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMoreTransactions() {
    setTxLoading(true);
    const nextPage = txPage + 1;
    try {
      const res = await fetch(`/api/transactions?page=${nextPage}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch");
      const { data, count } = await res.json();
      setTransactions((prev) => [...prev, ...(data || [])]);
      setTxPage(nextPage);
      setTxHasMore(transactions.length + (data || []).length < (count || 0));
    } catch (err) {
      toast.error("Failed to load more transactions.");
    } finally {
      setTxLoading(false);
    }
  }

  // 2. Handle Point Modification (Strictly guarded by RBACGuard in UI, and API)
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    
    const amount = parseInt(pointAmount, 10);
    if (isNaN(amount) || amount === 0) {
      toast.error("Point amount must be a non-zero number.");
      setSubmitting(false);
      return;
    }

    // Optimistic update for points
    const previousPoints = [...points];
    const categoryKey = CATEGORY_KEYS[category];
    setPoints((prev) =>
      prev.map((p) =>
        p.house_name === houseName
          ? {
              ...p,
              total_points: p.total_points + amount,
              [categoryKey]: (p[categoryKey] as number) + amount,
            }
          : p
      )
    );

    try {
      const res = await fetch("/api/admin/points", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ house_name: houseName, category, amount, reason, evidence }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update points.");
      }
      const data = await res.json();
      
      // Confirm points update with server response
      setPoints((prev) => prev.map((p) => (p.house_name === houseName ? data : p)));
      
      // Refresh the first page of transactions to show the new transaction
      const txRes = await fetch("/api/transactions?page=1&limit=10");
      if (txRes.ok) {
        const { data: txData, count: txCount } = await txRes.json();
        setTransactions(txData || []);
        setTxPage(1);
        setTxHasMore((txData || []).length < (txCount || 0));
      }
      
      toast.success(
        `${amount > 0 ? "Added" : "Deducted"} ${Math.abs(amount)} points ${
          amount > 0 ? "to" : "from"
        } ${HOUSE_LABELS[houseName]}. (Status: Provisional)`
      );
      setPointAmount("");
      setReason("");
      setEvidence("");
    } catch (err: any) {
      // Revert on failure
      setPoints(previousPoints);
      toast.error(err.message || "Failed to update points.");
    } finally {
      setSubmitting(false);
    }
  }

  const exportToCSV = () => {
    const headers = [
      "House Name", "Semester", "Total Points", "Competitive Excellence",
      "Organizational Contribution", "Governance & Compliance", "Conduct & Ethics", "Last Updated",
    ];
    const rows = filteredPoints.map((p) => [
      `"${HOUSE_LABELS[p.house_name] ?? p.house_name}"`, p.semester, p.total_points,
      p.competitive_excellence, p.organizational_contribution, p.governance_compliance,
      p.conduct_ethics, new Date(p.created_at).toLocaleDateString(),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `house_points_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPoints = points.filter((p) =>
    p.house_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">House Points Ledger</h1>
          <p className="text-sm text-neutral-400">
            Manage house point standings per Rules &amp; Procedures Article I. The
            Secretary of Internal Affairs is the designated Point Keeper (Section 11).
          </p>
        </div>
        <a
          href="/standings/transactions"
          className="shrink-0 text-sm font-medium text-neutral-400 transition hover:text-white"
        >
          View Full Transaction History →
        </a>
      </div>

      {/* Load Button */}
      {!fetched && (
        <button
          onClick={fetchData}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Ledger"}
        </button>
      )}

      {/* Filters and Actions Bar */}
      {fetched && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search by house name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            />
          </div>
          <div className="flex gap-2">
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
        </div>
      )}

      {/* Current Standings */}
      {fetched && filteredPoints.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Current Standings</h2>
          <div className="space-y-3">
            {filteredPoints.map((hp, idx) => {
              const color = HOUSE_COLORS[hp.house_name] ?? "#666";
              return (
                <article
                  key={hp.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className="flex size-9 items-center justify-center rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {HOUSE_LABELS[hp.house_name] ?? hp.house_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {hp.semester} · Updated {new Date(hp.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold tabular-nums text-white">
                      {hp.total_points}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-neutral-800 px-2 py-1.5">
                      <p className="text-neutral-500">Competitive</p>
                      <p className="font-semibold text-neutral-300">{hp.competitive_excellence}</p>
                    </div>
                    <div className="rounded-lg bg-neutral-800 px-2 py-1.5">
                      <p className="text-neutral-500">Organizational</p>
                      <p className="font-semibold text-neutral-300">{hp.organizational_contribution}</p>
                    </div>
                    <div className="rounded-lg bg-neutral-800 px-2 py-1.5">
                      <p className="text-neutral-500">Governance</p>
                      <p className="font-semibold text-neutral-300">{hp.governance_compliance}</p>
                    </div>
                    <div className="rounded-lg bg-neutral-800 px-2 py-1.5">
                      <p className="text-neutral-500">Conduct</p>
                      <p className="font-semibold text-neutral-300">{hp.conduct_ethics}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {fetched && filteredPoints.length === 0 && (
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 text-center text-neutral-400">
          {points.length === 0 ? "No house points recorded yet." : "No houses match your search."}
        </div>
      )}

      {/* Recent Transactions */}
      {fetched && transactions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500">
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">House</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Points</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">Reason</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const color = HOUSE_COLORS[tx.house_name] ?? "#666";
                  return (
                    <tr key={tx.id} className="border-b border-neutral-800/50 transition hover:bg-neutral-800/50">
                      <td className="px-5 py-3 text-neutral-400">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                            style={{ backgroundColor: color }}
                          >
                            {tx.house_name[0]}
                          </div>
                          <span className="text-white">
                            {HOUSE_LABELS[tx.house_name]?.replace("House of ", "") ?? tx.house_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-neutral-300">{tx.category}</td>
                      <td className={`px-5 py-3 text-right font-semibold tabular-nums ${tx.points > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {tx.points > 0 ? "+" : ""}{tx.points}
                      </td>
                      <td className="px-5 py-3 text-neutral-400 max-w-xs truncate" title={tx.reason}>
                        {tx.reason}
                      </td>
                      <td className="px-5 py-3">
                        {tx.status === "provisional" ? (
                          <Tooltip content="Provisional for 7 days. Subject to petition per R&P Art. I, Sec. 5.">
                            <span className="cursor-help rounded-full bg-amber-900/60 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                              provisional
                            </span>
                          </Tooltip>
                        ) : (
                          <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                            final
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Load More Transactions */}
          {txHasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMoreTransactions}
                disabled={txLoading}
                className="rounded-full border border-neutral-700 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white disabled:opacity-50"
              >
                {txLoading ? "Loading more..." : "Load More Transactions"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* Add / Deduct Points Form (STRICTLY PROTECTED BY RBAC)        */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <RBACGuard
        officer={officer}
        checkPermission={(o) => RBAC.canManageHousePoints(o.role as Role)}
        fallback={
          <article className="rounded-3xl border border-amber-900/40 bg-amber-950/20 p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-amber-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-7 text-amber-400">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8.5V5.5a3 3 0 0 0-6 0V9.5h6Z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-amber-200">Ledger Modification Restricted</h2>
            <p className="mt-3 text-sm leading-6 text-amber-300/80">
              Per <strong className="text-white">Article I, Section 11</strong> of the Rules & Procedures, 
              only the <strong className="text-white">Secretary of Internal Affairs (Point Keeper)</strong> or the 
              <strong className="text-white"> President</strong> possesses the constitutional authority to post, 
              modify, or deduct points on the Master House Point Ledger.
            </p>
            <p className="mt-2 text-xs italic text-amber-500/60">
              Houses must submit an Accomplishment Report to the SIA to claim points.
            </p>
          </article>
        }
      >
        <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold text-white">Add or Deduct Points</h2>
            <p className="text-sm text-neutral-500">
              Provide reason and evidence for transparency. Negative values deduct points. 
              <span className="text-amber-400 font-medium"> All postings start as Provisional.</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-lg space-y-4">
            {/* House */}
            <div className="space-y-2">
              <label htmlFor="house" className="block text-sm font-medium text-neutral-300">House</label>
              <select
                id="house"
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              >
                {HOUSES.map((h) => (
                  <option key={h} value={h}>{HOUSE_LABELS[h]}</option>
                ))}
              </select>
            </div>
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-neutral-300">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {/* Points */}
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-neutral-300">Points (+/-)</label>
              <input
                type="number"
                id="amount"
                value={pointAmount}
                onChange={(e) => setPointAmount(e.target.value)}
                placeholder="e.g. 100 or -15"
                required
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
            </div>
            {/* Reason */}
            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-medium text-neutral-300">Reason</label>
              <input
                type="text"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Won inter-house debate tournament"
                required
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
            </div>
            {/* Evidence */}
            <div className="space-y-2">
              <label htmlFor="evidence" className="block text-sm font-medium text-neutral-300">Evidence / Reference</label>
              <input
                type="text"
                id="evidence"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="e.g. Accomplishment Report #12"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Processing…" : "Submit Point Transaction"}
            </button>
          </form>
        </article>
      </RBACGuard>
    </div>
  );
}