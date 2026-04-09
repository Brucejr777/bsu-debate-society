import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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

interface HouseRow {
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

export default async function StandingsPage() {
  const { data, error } = await supabase
    .from("house_points")
    .select("*")
    .order("total_points", { ascending: false });

  const rows: HouseRow[] = data ?? [];
  const semester = rows[0]?.semester ?? "";
  const lastUpdated = rows[0]?.created_at ?? null;

  const rankSuffix = (n: number) => {
    if (n === 1) return "st";
    if (n === 2) return "nd";
    if (n === 3) return "rd";
    return "th";
  };

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
              Rules &amp; Procedures — Article I
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              House Point Standings
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The House Point System tracks constructive and healthy competition
              among Society Houses, recognizing excellence in debate and organizational
              contribution, and strengthening House identity and camaraderie. The Master
              House Point Ledger is maintained by the Secretary of Internal Affairs and
              published transparently for all members.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article I, Sections 1 &amp; 7
            </p>
          </article>

          {/* Semester Badge & Last Updated */}
          {semester && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-500">
              <span className="rounded-full bg-neutral-800 px-4 py-1.5 font-medium text-neutral-300">
                {semester}
              </span>
              {lastUpdated && (
                <span>
                  Last updated:{" "}
                  {new Date(lastUpdated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          )}

          {/* ── Standings ── */}
          {error && (
            <article className="rounded-3xl border border-red-800 bg-red-950/50 p-8 text-center text-red-400">
              Failed to load standings. Please try again later.
            </article>
          )}

          {!error && rows.length === 0 && (
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 text-center text-neutral-400">
              No standings data available yet for this semester.
            </article>
          )}

          {!error && rows.length > 0 && (
            <div className="space-y-6">
              {/* Top House Highlight */}
              {(() => {
                const top = rows[0];
                const color = HOUSE_COLORS[top.house_name] ?? "#666";
                return (
                  <article className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30">
                    <div
                      className="absolute left-0 top-0 h-full w-2"
                      style={{ backgroundColor: color }}
                    />
                    <div className="pl-4 text-center">
                      <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                        Current Leader
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                        {HOUSE_LABELS[top.house_name] ?? top.house_name}
                      </h2>
                      <p className="mt-4 text-6xl font-bold tabular-nums text-white sm:text-7xl">
                        {top.total_points.toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm text-neutral-500">points</p>
                    </div>
                  </article>
                );
              })()}

              {/* Full Rankings */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Full Rankings
                </h2>

                <div className="space-y-4">
                  {rows.map((row, idx) => {
                    const rank = idx + 1;
                    const color = HOUSE_COLORS[row.house_name] ?? "#666";

                    return (
                      <article
                        key={row.id}
                        className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          {/* Rank + House */}
                          <div className="flex items-center gap-4">
                            <div
                              className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white"
                              style={{ backgroundColor: color }}
                            >
                              #{rank}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {HOUSE_LABELS[row.house_name] ?? row.house_name}
                              </h3>
                              <p className="text-sm text-neutral-500">
                                Rank {rank}
                                {rankSuffix(rank)}
                              </p>
                            </div>
                          </div>

                          {/* Total Points */}
                          <div className="text-right">
                            <p className="text-3xl font-bold tabular-nums text-white">
                              {row.total_points.toLocaleString()}
                            </p>
                            <p className="text-xs text-neutral-500">
                              total points
                            </p>
                          </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div className="rounded-2xl bg-neutral-900 p-3">
                            <p className="text-xs font-medium text-neutral-500">
                              Competitive
                            </p>
                            <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                              {row.competitive_excellence}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-neutral-900 p-3">
                            <p className="text-xs font-medium text-neutral-500">
                              Organizational
                            </p>
                            <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                              {row.organizational_contribution}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-neutral-900 p-3">
                            <p className="text-xs font-medium text-neutral-500">
                              Governance
                            </p>
                            <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                              {row.governance_compliance}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-neutral-900 p-3">
                            <p className="text-xs font-medium text-neutral-500">
                              Conduct
                            </p>
                            <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                              {row.conduct_ethics}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── House Cup Info ── */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-neutral-300"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.166 2.621v.818c0 .379.193.732.512.936a3.75 3.75 0 0 0 6.644 0A1.125 1.125 0 0 1 12.834 3.44v-.819a.75.75 0 0 1 1.5 0v.818a4.125 4.125 0 0 1-1.5 3.306 5.25 5.25 0 0 1-.307 5.873A6.75 6.75 0 0 1 5.027 19.5a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 .75-.75 5.25 5.25 0 0 0 5.25-5.25v-.819a5.25 5.25 0 0 0-1.5-3.306 4.125 4.125 0 0 1-1.5-3.306v-.818a.75.75 0 0 1 1.5 0Zm8.334 0v.818c0 .379-.193.732-.512.936a3.75 3.75 0 0 1-6.644 0A1.125 1.125 0 0 0 12.666 3.44v-.819a.75.75 0 0 0-1.5 0v.818a4.125 4.125 0 0 0 1.5 3.306 5.25 5.25 0 0 0 .307 5.873 6.75 6.75 0 0 0 7.501 6.873.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75 5.25 5.25 0 0 1-5.25-5.25v-.819a5.25 5.25 0 0 1 1.5-3.306 4.125 4.125 0 0 0 1.5-3.306v-.818a.75.75 0 0 0-1.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    The House Cup
                  </h2>
                </div>
              </div>
              <p className="text-base leading-7 text-neutral-300">
                The House Cup is awarded at the end of each academic year to the House
                with the highest cumulative point total. Points reset to zero at the
                start of each new academic year. In the event of a tie, tiebreakers
                are applied in sequence: highest debate competition points, highest
                member participation rate, fewest conduct violations, head-to-head
                record, and finally drawing of lots.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Rules and Procedures, Article I, Section 9
              </p>
            </div>
          </article>

          {/* ── Transparency Notice ── */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-sm shadow-black/20">
            <div className="mx-auto max-w-3xl space-y-2 text-center">
              <p className="text-sm leading-6 text-neutral-400">
                All standings are maintained in the Master House Point Ledger by the
                Secretary of Internal Affairs and are updated following each processed
                point transaction. Point postings are marked as Provisional for seven
                (7) calendar days before becoming final and executory.
              </p>
              <a
                href="/standings/transactions"
                className="inline-flex items-center text-sm font-medium text-neutral-400 transition hover:text-white"
              >
                View Full Transaction History
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="ml-1.5 size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <span className="text-neutral-700">&middot;</span>
              <a
                href="/house-cup"
                className="inline-flex items-center text-sm font-medium text-neutral-400 transition hover:text-white"
              >
                View House Cup
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="ml-1.5 size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <p className="text-xs italic text-neutral-500">
                — Rules and Procedures, Article I, Section 7
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
