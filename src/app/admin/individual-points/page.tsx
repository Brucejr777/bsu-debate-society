"use client";

import { useState } from "react";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  async function fetchTransactions() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/individual-points");
    if (!res.ok) {
      setError("Failed to fetch transactions.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setTransactions(data);
    setFetched(true);
    setLoading(false);
  }

  async function submitTransaction(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const points = parseInt(form.points, 10);
    if (isNaN(points) || points === 0) {
      setError("Points must be a non-zero number.");
      return;
    }

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
      setError(err.error ?? "Failed to submit.");
      return;
    }

    setActionMsg(
      `${points > 0 ? "Added" : "Deducted"} ${Math.abs(points)} points ${points > 0 ? "to" : "from"} ${form.member_name}.`
    );
    setForm(emptyForm);
    setShowForm(false);
    await fetchTransactions();
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function updateStatus(id: number, status: string) {
    const note = notes[id] ?? null;
    const res = await fetch("/api/admin/individual-points", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status,
        notes: note,
        reviewed_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      setActionMsg("Failed to update.");
      return;
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, notes: note } : t))
    );
    setActionMsg(`Marked as ${status}.`);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteTransaction(id: number) {
    const res = await fetch("/api/admin/individual-points", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      setActionMsg("Failed to delete.");
      return;
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setActionMsg("Transaction deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  const inputCls =
    "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const btnPrimary =
    "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnSecondary =
    "rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Individual Debate Point Ledger
        </h1>
        <p className="text-sm text-neutral-400">
          Record and manage individual member debate points per Article III,
          Section 6. All transactions are recorded with date, member, House,
          points, reason, and running total.
        </p>
      </div>

      {/* Feedback */}
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

      {/* Load / Add buttons */}
      <div className="flex gap-2">
        {!fetched && (
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className={btnPrimary}
          >
            {loading ? "Loading…" : "Load Transactions"}
          </button>
        )}
        {fetched && !showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setForm(emptyForm);
            }}
            className={btnPrimary}
          >
            + Add Points
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={submitTransaction}
          className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-lg"
        >
          <h2 className="mb-6 text-lg font-semibold text-white">
            Add / Deduct Individual Points
          </h2>
          <div className="mx-auto max-w-xl space-y-4">
            <div>
              <label htmlFor="ind-name" className={labelCls}>
                Member Name
              </label>
              <input
                id="ind-name"
                value={form.member_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, member_name: e.target.value }))
                }
                required
                placeholder="Juan dela Cruz"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ind-house" className={labelCls}>
                House
              </label>
              <select
                id="ind-house"
                value={form.house}
                onChange={(e) =>
                  setForm((p) => ({ ...p, house: e.target.value }))
                }
                className={inputCls}
              >
                {HOUSES.map((h) => (
                  <option key={h} value={h}>
                    {HOUSE_LABELS[h]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ind-points" className={labelCls}>
                Points (+/-)
              </label>
              <input
                id="ind-points"
                type="number"
                value={form.points}
                onChange={(e) =>
                  setForm((p) => ({ ...p, points: e.target.value }))
                }
                required
                placeholder="e.g. 25 or -10"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ind-reason" className={labelCls}>
                Reason
              </label>
              <input
                id="ind-reason"
                value={form.reason}
                onChange={(e) =>
                  setForm((p) => ({ ...p, reason: e.target.value }))
                }
                required
                placeholder="e.g. Best Speaker at Inter-House Debate"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ind-evidence" className={labelCls}>
                Evidence / Reference{" "}
                <span className="text-neutral-500">(optional)</span>
              </label>
              <input
                id="ind-evidence"
                value={form.evidence}
                onChange={(e) =>
                  setForm((p) => ({ ...p, evidence: e.target.value }))
                }
                placeholder="e.g. Tournament Results Report"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ind-semester" className={labelCls}>
                Semester
              </label>
              <input
                id="ind-semester"
                value={form.semester}
                onChange={(e) =>
                  setForm((p) => ({ ...p, semester: e.target.value }))
                }
                required
                className={inputCls}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className={btnPrimary}>
                Submit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(emptyForm);
                }}
                className={btnSecondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Transactions List */}
      {fetched && transactions.length === 0 && (
        <p className="text-sm text-neutral-500">No transactions recorded yet.</p>
      )}

      {fetched && transactions.length > 0 && (
        <div className="space-y-4">
          {transactions.map((tx) => {
            const color = HOUSE_COLORS[tx.house] ?? "#666";
            const isExpanded = expandedId === tx.id;
            return (
              <article
                key={tx.id}
                className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {tx.house[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">
                      {tx.member_name}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {tx.house} · {tx.semester} ·{" "}
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold tabular-nums ${
                        tx.points > 0
                          ? "text-emerald-400"
                          : tx.points < 0
                            ? "text-red-400"
                            : "text-neutral-400"
                      }`}
                    >
                      {tx.points > 0 ? "+" : ""}
                      {tx.points}
                    </p>
                    <p className="text-xs text-neutral-500">
                      → {tx.running_total?.toLocaleString() ?? "—"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[tx.status] ?? "bg-neutral-800 text-neutral-300"}`}
                  >
                    {tx.status}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-neutral-300">{tx.reason}</p>
                  {tx.evidence && (
                    <p className="mt-1 text-xs text-neutral-500">
                      Evidence: {tx.evidence}
                    </p>
                  )}
                </div>

                {/* Expand for review */}
                {tx.status === "provisional" && (
                  <div className="mt-4">
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : tx.id)
                      }
                      className="text-sm font-medium text-neutral-400 transition hover:text-white"
                    >
                      {isExpanded ? "Hide review" : "Review"}
                    </button>
                    {isExpanded && (
                      <div className="mt-3 space-y-3 border-t border-neutral-800 pt-4">
                        <textarea
                          placeholder="Review notes…"
                          value={notes[tx.id] ?? ""}
                          onChange={(e) =>
                            setNotes((p) => ({
                              ...p,
                              [tx.id]: e.target.value,
                            }))
                          }
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
                            onClick={() =>
                              updateStatus(tx.id, "disputed")
                            }
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
        </div>
      )}
    </div>
  );
}
