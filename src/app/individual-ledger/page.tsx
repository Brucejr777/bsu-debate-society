import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

interface LedgerEntry {
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
}

export default async function IndividualLedgerPage() {
  const { data, error } = await supabase
    .from("individual_debate_point_transactions")
    .select("*")
    .order("created_at", { ascending: false });

  const transactions: LedgerEntry[] = data ?? [];
  const semester = transactions[0]?.semester ?? "";

  // Get unique members for stats
  const members = [...new Set(transactions.map((t) => t.member_name))];
  const totalTransactions = transactions.length;
  const totalPoints = transactions.reduce((s, t) => s + t.points, 0);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back Navigation */}
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Home
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Rules &amp; Procedures — Article III, Section 6
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Individual Debate Point Ledger
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Individual Debate Point Ledger records every point addition
              and deduction for each member of the Society. Maintained by the
              Secretary of Internal Affairs, the Ledger tracks the date, member
              name, House, points added, running total, and specific activity
              or reason for each transaction.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article III, Section 6
            </p>
          </article>

          {/* Stats */}
          {totalTransactions > 0 && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-neutral-900 p-5">
                <p className="text-2xl font-bold text-white">{totalTransactions}</p>
                <p className="text-xs text-neutral-500">Transactions</p>
              </div>
              <div className="rounded-2xl bg-neutral-900 p-5">
                <p className="text-2xl font-bold text-white">{members.length}</p>
                <p className="text-xs text-neutral-500">Members</p>
              </div>
              <div className="rounded-2xl bg-neutral-900 p-5">
                <p className="text-2xl font-bold text-white">{totalPoints}</p>
                <p className="text-xs text-neutral-500">Total Points</p>
              </div>
            </div>
          )}

          {/* Transactions */}
          {error && (
            <article className="rounded-3xl border border-red-800 bg-red-950/50 p-8 text-center text-red-400">
              Failed to load ledger. Please try again later.
            </article>
          )}

          {!error && transactions.length === 0 && (
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 text-center text-neutral-400">
              No individual debate point transactions recorded yet.
            </article>
          )}

          {!error && transactions.length > 0 && (
            <div className="space-y-3">
              {/* Desktop Table */}
              <div className="hidden sm:block">
                <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 shadow-xl shadow-black/30">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500">
                        <th className="px-4 py-3 font-medium uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 font-medium uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-4 py-3 font-medium uppercase tracking-wider">
                          House
                        </th>
                        <th className="px-4 py-3 text-right font-medium uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-4 py-3 text-right font-medium uppercase tracking-wider">
                          Running Total
                        </th>
                        <th className="px-4 py-3 font-medium uppercase tracking-wider">
                          Activity / Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => {
                        const color = HOUSE_COLORS[tx.house] ?? "#666";
                        return (
                          <tr
                            key={tx.id}
                            className="border-b border-neutral-800/50 transition hover:bg-neutral-900/50"
                          >
                            <td className="px-4 py-3 text-neutral-400">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 font-medium text-white">
                              {tx.member_name}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                                  style={{ backgroundColor: color }}
                                >
                                  {tx.house[0]}
                                </div>
                                <span className="text-neutral-300">{tx.house}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span
                                className={`font-semibold tabular-nums ${
                                  tx.points > 0
                                    ? "text-emerald-400"
                                    : tx.points < 0
                                      ? "text-red-400"
                                      : "text-neutral-400"
                                }`}
                              >
                                {tx.points > 0 ? "+" : ""}
                                {tx.points}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-semibold tabular-nums text-white">
                                {tx.running_total?.toLocaleString() ?? "—"}
                              </span>
                            </td>
                            <td className="max-w-xs px-4 py-3">
                              <span
                                className="text-neutral-400"
                                title={tx.reason}
                              >
                                {tx.reason.length > 55
                                  ? `${tx.reason.slice(0, 55)}…`
                                  : tx.reason}
                              </span>
                              {tx.evidence && (
                                <p className="mt-0.5 text-[11px] text-neutral-600">
                                  {tx.evidence}
                                </p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 sm:hidden">
                {transactions.map((tx) => {
                  const color = HOUSE_COLORS[tx.house] ?? "#666";
                  return (
                    <article
                      key={tx.id}
                      className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                            style={{ backgroundColor: color }}
                          >
                            {tx.house[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {tx.member_name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold tabular-nums ${
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
                      </div>
                      <p className="mt-2 text-sm text-neutral-300">
                        {tx.reason}
                      </p>
                      {tx.evidence && (
                        <p className="mt-1 text-xs text-neutral-500">
                          {tx.evidence}
                        </p>
                      )}
                      {tx.status === "provisional" && (
                        <span className="mt-2 inline-block rounded-full bg-amber-900/60 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                          provisional
                        </span>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Provisional Period Notice */}
          {!error && transactions.length > 0 && (
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <h2 className="text-xl font-semibold text-white">
                  Provisional Period &amp; Petitions
                </h2>
                <p className="text-base leading-7 text-neutral-300">
                  All point postings are marked as Provisional for seven (7)
                  calendar days from the date of posting. During this period,
                  any member may petition on grounds of inaccurate
                  documentation, misclassification, or procedural error. If no
                  petition is filed, the points become final and executory.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Article III, Annex A, Section 6
                </p>
              </div>
            </article>
          )}

          {/* Point Categories */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-xl font-semibold text-white">
                Individual Point Values
              </h2>
              <p className="text-sm text-neutral-400">
                Points are awarded for internal debates, external
                competitions, and individual performance achievements as
                specified in Annex A of the Rules and Procedures.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <h3 className="text-sm font-semibold text-white">
                    Society Debates
                  </h3>
                  <ul className="mt-2 space-y-1 text-xs text-neutral-400">
                    <li>Match Win: +15</li>
                    <li>Match Draw: +7</li>
                    <li>Participation: +3</li>
                    <li>Best Speaker: +10</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <h3 className="text-sm font-semibold text-white">
                    External Competitions
                  </h3>
                  <ul className="mt-2 space-y-1 text-xs text-neutral-400">
                    <li>International 1st: +50</li>
                    <li>National 1st: +45</li>
                    <li>Regional 1st: +35</li>
                    <li>Local 1st: +25</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <h3 className="text-sm font-semibold text-white">
                    Speaker Awards
                  </h3>
                  <ul className="mt-2 space-y-1 text-xs text-neutral-400">
                    <li>Best Speaker (ext.): +20</li>
                    <li>Top 2/3 Speaker: +12</li>
                    <li>Best Rebuttal: +10</li>
                    <li>Best Case: +10</li>
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
