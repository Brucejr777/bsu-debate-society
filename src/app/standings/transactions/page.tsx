import { supabase } from "@/lib/supabase";
import { HOUSES, HOUSE_COLORS, HOUSE_LABELS } from "@/lib/houses";

export const dynamic = "force-dynamic";

interface Transaction {
  id: number;
  created_at: string;
  house_name: string;
  category: string;
  points: number;
  reason: string;
  evidence: string | null;
  proposing_house: string | null;
  semester: string;
  status: string;
  running_total: number | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  "Competitive Excellence": "Competitive",
  "Organizational Contribution": "Organizational",
  "Governance & Compliance": "Governance",
  "Conduct & Ethics": "Conduct",
};

const CATEGORY_BADGE: Record<string, string> = {
  "Competitive Excellence": "bg-emerald-900/60 text-emerald-300",
  "Organizational Contribution": "bg-blue-900/60 text-blue-300",
  "Governance & Compliance": "bg-amber-900/60 text-amber-300",
  "Conduct & Ethics": "bg-red-900/60 text-red-300",
};

export default async function TransactionsPage() {
  const { data, error } = await supabase
    .from("house_point_transactions")
    .select("*")
    .order("created_at", { ascending: false });

  const transactions: Transaction[] = data ?? [];

  // Get unique semesters for filter info
  const semesters = [...new Set(transactions.map((t) => t.semester))];
  const currentSemester = semesters[0] ?? "";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back Navigation */}
          <div>
            <a
              href="/standings"
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
              Back to Standings
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Rules &amp; Procedures — Article I, Section 7
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Point Transaction History
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Master House Point Ledger records every point addition and
              deduction, including the date, House, points amount, category,
              specific activity or reason, proposing House, and running total.
              All postings are marked as Provisional for seven (7) calendar
              days before becoming final and executory.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article I, Section 7
            </p>
          </article>

          {currentSemester && (
            <div className="flex items-center justify-center">
              <span className="rounded-full bg-neutral-800 px-4 py-1.5 text-sm font-medium text-neutral-300">
                {currentSemester}
              </span>
            </div>
          )}

          {/* Transactions */}
          {error && (
            <article className="rounded-3xl border border-red-800 bg-red-950/50 p-8 text-center text-red-400">
              Failed to load transaction history. Please try again later.
            </article>
          )}

          {!error && transactions.length === 0 && (
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 text-center text-neutral-400">
              No point transactions recorded yet for this semester.
            </article>
          )}

          {!error && transactions.length > 0 && (
            <div className="space-y-4">
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
                          House
                        </th>
                        <th className="px-4 py-3 font-medium uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-right font-medium uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-4 py-3 text-right font-medium uppercase tracking-wider">
                          Running Total
                        </th>
                        <th className="px-4 py-3 font-medium uppercase tracking-wider">
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => {
                        const color = HOUSE_COLORS[tx.house_name] ?? "#666";
                        const badgeStyle =
                          CATEGORY_BADGE[tx.category] ??
                          "bg-neutral-800 text-neutral-300";
                        return (
                          <tr
                            key={tx.id}
                            className="border-b border-neutral-800/50 transition hover:bg-neutral-900/50"
                          >
                            <td className="px-4 py-3 text-neutral-400">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                                  style={{ backgroundColor: color }}
                                >
                                  {tx.house_name[0]}
                                </div>
                                <span className="text-white">
                                  {HOUSE_LABELS[tx.house_name]?.replace(
                                    "House of ",
                                    ""
                                  ) ?? tx.house_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeStyle}`}
                              >
                                {CATEGORY_LABELS[tx.category] ?? tx.category}
                              </span>
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
                              <span className="text-neutral-400" title={tx.reason}>
                                {tx.reason.length > 50
                                  ? `${tx.reason.slice(0, 50)}…`
                                  : tx.reason}
                              </span>
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
                  const color = HOUSE_COLORS[tx.house_name] ?? "#666";
                  const badgeStyle =
                    CATEGORY_BADGE[tx.category] ??
                    "bg-neutral-800 text-neutral-300";
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
                            {tx.house_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {HOUSE_LABELS[tx.house_name]?.replace(
                                "House of ",
                                ""
                              ) ?? tx.house_name}
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
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeStyle}`}
                        >
                          {CATEGORY_LABELS[tx.category] ?? tx.category}
                        </span>
                        {tx.status === "provisional" && (
                          <span className="rounded-full bg-amber-900/60 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                            provisional
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-neutral-400">
                        {tx.reason}
                      </p>
                      {tx.evidence && (
                        <p className="mt-1 text-[11px] text-neutral-500">
                          Evidence: {tx.evidence}
                        </p>
                      )}
                      {tx.proposing_house && (
                        <p className="mt-1 text-[11px] text-neutral-500">
                          Proposed by:{" "}
                          {HOUSE_LABELS[tx.proposing_house] ??
                            tx.proposing_house}
                        </p>
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
                  Provisional Period &amp; Disputes
                </h2>
                <p className="text-base leading-7 text-neutral-300">
                  All point postings are marked as Provisional for seven (7)
                  calendar days from the date of posting. During this period,
                  any House Chancellor may file a petition to dispute the
                  points awarded. After the Provisional Period expires without
                  dispute, the posting becomes Final and is incorporated into
                  the official standings.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Article I, Section 5 &amp; Section 7
                </p>
                <a
                  href="/appeals"
                  className="inline-flex items-center text-sm font-medium text-neutral-400 transition hover:text-white"
                >
                  File a Point Dispute Appeal
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-1.5 size-4">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </article>
          )}

          {/* Point Categories Legend */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-xl font-semibold text-white">
                Point Categories
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <div
                    key={key}
                    className="rounded-2xl bg-neutral-900 p-4"
                  >
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_BADGE[key] ?? "bg-neutral-800 text-neutral-300"}`}
                    >
                      {label}
                    </span>
                    <p className="mt-2 text-xs text-neutral-500">
                      {key === "Competitive Excellence" &&
                        "Debate tournament results, Best Speaker awards, external competition placements"}
                      {key === "Organizational Contribution" &&
                        "House-led initiatives, recruitment, co-hosted events"}
                      {key === "Governance & Compliance" &&
                        "Timely reports, Council attendance, financial compliance"}
                      {key === "Conduct & Ethics" &&
                        "Code of Conduct adherence; deductions for violations"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
