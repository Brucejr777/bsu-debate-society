import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import PointTrendChart, { TrendDataPoint } from "@/components/PointTrendChart";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "House Point Standings — BSU Debate Society",
    description:
      "View the real-time House Point Standings for the BSU Debate Society. Track the competitive, organizational, governance, and conduct metrics of the Four Houses as they compete for the annual House Cup.",
    openGraph: {
      title: "House Point Standings — BSU Debate Society",
      description:
        "View the real-time House Point Standings for the BSU Debate Society. Track the competitive, organizational, governance, and conduct metrics of the Four Houses as they compete for the annual House Cup.",
      type: "website",
      siteName: "BSU Debate Society",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "House Point Standings — BSU Debate Society",
      description:
        "View the real-time House Point Standings for the BSU Debate Society. Track the competitive, organizational, governance, and conduct metrics of the Four Houses as they compete for the annual House Cup.",
    },
  };
}

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#FF8C00",
  Kabunian: "#C0C0C0",
  Laon: "#228B22",
  Manama: "#8B008B",
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

  // Fetch trend data for the chart
  const { data: transactions } = await supabase
    .from("house_point_transactions")
    .select("created_at, house_name, running_total")
    .order("created_at", { ascending: true });

  const houses = ["Bathala", "Kabunian", "Laon", "Manama"];
  const monthlyData: Record<string, Record<string, number | null>> = {};

  if (transactions) {
    for (const tx of transactions) {
      if (!tx.created_at || !tx.house_name || !houses.includes(tx.house_name)) continue;
      const date = new Date(tx.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { Bathala: null, Kabunian: null, Laon: null, Manama: null };
      }
      if (tx.running_total !== null) {
        monthlyData[monthKey][tx.house_name] = tx.running_total;
      }
    }
  }

  const sortedMonths = Object.keys(monthlyData).sort();
  const trendResult: TrendDataPoint[] = [];
  
  let currentTotals = {
    Bathala: 0,
    Kabunian: 0,
    Laon: 0,
    Manama: 0
  };

  for (const month of sortedMonths) {
    for (const house of houses) {
      const val = monthlyData[month][house];
      if (val !== null && val !== undefined) {
        currentTotals[house as keyof typeof currentTotals] = val;
      }
    }
    const [year, monthNum] = month.split("-");
    const dateObj = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const displayDate = dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    trendResult.push({
      date: displayDate,
      ...currentTotals,
    });
  }

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

          {/* ── Point Trend Chart ── */}
          <PointTrendChart data={trendResult} />

          {/* ── How the Point System Works ── */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                How the Point System Works
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Rules and Procedures, Article I, Sections 3–7 & 10–11
              </p>
            </div>

            {/* Point Categories Explanation */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-4xl space-y-6">
                <h3 className="text-2xl font-semibold text-white text-center">
                  Four Point Categories
                </h3>

                {/* 1. Competitive Excellence */}
                <div className="rounded-2xl border border-emerald-900/40 bg-neutral-950/95 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-emerald-400">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8.5V5.5a3 3 0 0 0-6 0V9.5h6Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-emerald-200">Competitive Excellence</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">Inter-House Tournaments</p>
                      <ul className="space-y-1.5 text-sm text-neutral-400">
                        <li className="flex justify-between"><span>1st Place</span><span className="font-semibold text-emerald-400">+100 pts</span></li>
                        <li className="flex justify-between"><span>2nd Place</span><span className="font-semibold text-emerald-400">+75 pts</span></li>
                        <li className="flex justify-between"><span>3rd Place</span><span className="font-semibold text-emerald-400">+50 pts</span></li>
                        <li className="flex justify-between"><span>Best Speaker</span><span className="font-semibold text-emerald-400">+25 pts</span></li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">External Competitions</p>
                      <ul className="space-y-1.5 text-sm text-neutral-400">
                        <li className="flex justify-between"><span>Championship Win</span><span className="font-semibold text-emerald-400">+50 pts</span></li>
                        <li className="flex justify-between"><span>Finalist / Semi-Finalist</span><span className="font-semibold text-emerald-400">+30 pts</span></li>
                        <li className="flex justify-between"><span>Participation</span><span className="font-semibold text-emerald-400">+10 pts</span></li>
                      </ul>
                      <p className="mt-2 text-xs italic text-neutral-500">Placement and participation points are mutually exclusive.</p>
                    </div>
                  </div>
                </div>

                {/* 2. Organizational Contribution */}
                <div className="rounded-2xl border border-blue-900/40 bg-neutral-950/95 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-blue-400">
                        <path d="M10.362 1.093a.75.75 0 0 0-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925ZM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0 0 18 14.25V6.443ZM9.25 18.693v-8.25l-7.25-4v7.807a.75.75 0 0 0 .388.657l6.862 3.786Z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-blue-200">Organizational Contribution</h4>
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">Each House earns points by leading initiatives that demonstrate its core embodied value:</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-neutral-900 p-3" style={{ borderLeft: "4px solid #FF8C00" }}>
                      <p className="text-sm font-semibold text-white">House of Bathala</p>
                      <p className="text-xs text-neutral-400">Leadership initiative</p>
                      <p className="text-lg font-semibold text-emerald-400">+100</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-3" style={{ borderLeft: "4px solid #C0C0C0" }}>
                      <p className="text-sm font-semibold text-white">House of Kabunian</p>
                      <p className="text-xs text-neutral-400">Journalism initiative</p>
                      <p className="text-lg font-semibold text-emerald-400">+100</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-3" style={{ borderLeft: "4px solid #228B22" }}>
                      <p className="text-sm font-semibold text-white">House of Laon</p>
                      <p className="text-xs text-neutral-400">Academic initiative</p>
                      <p className="text-lg font-semibold text-emerald-400">+100</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-3" style={{ borderLeft: "4px solid #8B008B" }}>
                      <p className="text-sm font-semibold text-white">House of Manama</p>
                      <p className="text-xs text-neutral-400">Arts initiative</p>
                      <p className="text-lg font-semibold text-emerald-400">+100</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-neutral-900 p-3">
                      <p className="text-sm text-neutral-400">Co-hosted event (2 Houses)</p>
                      <p className="text-lg font-semibold text-emerald-400">+20 each</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-3">
                      <p className="text-sm text-neutral-400">New member (active 1+ semester)</p>
                      <p className="text-lg font-semibold text-emerald-400">+5 each</p>
                    </div>
                  </div>
                </div>

                {/* 3. Governance & Compliance */}
                <div className="rounded-2xl border border-amber-900/40 bg-neutral-950/95 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-amber-400">
                        <path fillRule="evenodd" d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.382l2.447.895A.75.75 0 0 0 6 9.232V9h8v.232a.75.75 0 0 0 .553.71l2.447-.895V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3Zm3 4V5a1.5 1.5 0 0 0-3 0v1h3Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-amber-200">Governance & Compliance</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">Additions</p>
                      <ul className="space-y-1.5 text-sm text-neutral-400">
                        <li className="flex justify-between"><span>On-time report submission</span><span className="font-semibold text-emerald-400">+5</span></li>
                        <li className="flex justify-between"><span>Full Council meeting attendance</span><span className="font-semibold text-emerald-400">+3</span></li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">Deductions</p>
                      <ul className="space-y-1.5 text-sm text-neutral-400">
                        <li className="flex justify-between"><span>Late submission (per day)</span><span className="font-semibold text-red-400">-3 (max -15)</span></li>
                        <li className="flex justify-between"><span>No financial report submitted</span><span className="font-semibold text-red-400">-20</span></li>
                        <li className="flex justify-between"><span>Unauthorized use of House Resources</span><span className="font-semibold text-red-400">-75% of total points</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 4. Conduct & Ethics */}
                <div className="rounded-2xl border border-red-900/40 bg-neutral-950/95 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-red-400">
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-red-200">Conduct & Ethics</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-neutral-900 p-3">
                      <p className="text-sm font-semibold text-amber-300">Minor Violation</p>
                      <p className="mt-1 text-xs text-neutral-400">First-time failure to complete tasks, minor disrespect</p>
                      <p className="mt-2 text-2xl font-bold text-red-400">-5</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-3">
                      <p className="text-sm font-semibold text-red-300">Major Violation</p>
                      <p className="mt-1 text-xs text-neutral-400">Dishonesty, harassment, intentional disruption</p>
                      <p className="mt-2 text-2xl font-bold text-red-400">-15</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-3">
                      <p className="text-sm font-semibold text-red-300">Severe Violation</p>
                      <p className="mt-1 text-xs text-neutral-400">Discrimination, intentional misrepresentation</p>
                      <p className="mt-2 text-2xl font-bold text-red-400">-30</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs italic text-neutral-500">Point deductions are applied by the OIA based on the Society Disciplinary Ledger. Concealment of a violation results in an additional -30 penalty.</p>
                </div>

                {/* Special Competitions & Bonuses */}
                <div className="rounded-2xl border border-purple-900/40 bg-neutral-950/95 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-purple-400">
                        <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633l-.683-2.051Z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-purple-200">Special Competitions & Bonuses</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">Annual Excellence Awards</p>
                      <ul className="space-y-1.5 text-sm text-neutral-400">
                        <li className="flex justify-between"><span>Historical Integrity</span><span className="font-semibold text-emerald-400">+25</span></li>
                        <li className="flex justify-between"><span>Commitment to Inclusive Dialogue</span><span className="font-semibold text-emerald-400">+25</span></li>
                        <li className="flex justify-between"><span>Innovation in Debate</span><span className="font-semibold text-emerald-400">+25</span></li>
                        <li className="flex justify-between"><span>Community Impact</span><span className="font-semibold text-emerald-400">+25</span></li>
                        <li className="flex justify-between"><span>Member Development</span><span className="font-semibold text-emerald-400">+25</span></li>
                        <li className="flex justify-between"><span>Rising House Award</span><span className="font-semibold text-emerald-400">+25</span></li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">Bonus Opportunities</p>
                      <ul className="space-y-1.5 text-sm text-neutral-400">
                        <li className="flex justify-between"><span>Perfect attendance (all meetings)</span><span className="font-semibold text-emerald-400">+15</span></li>
                        <li className="flex justify-between"><span>≥90% attendance (all meetings)</span><span className="font-semibold text-emerald-400">+10</span></li>
                        <li className="flex justify-between"><span>Zero conduct violations (semester)</span><span className="font-semibold text-emerald-400">+10</span></li>
                        <li className="flex justify-between"><span>Cross-House collaboration (3+ Houses)</span><span className="font-semibold text-emerald-400">+30</span></li>
                        <li className="flex justify-between"><span>External individual award</span><span className="font-semibold text-emerald-400">+15</span></li>
                        <li className="flex justify-between"><span>Host external organization visit</span><span className="font-semibold text-emerald-400">+10</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Transaction Process */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <h3 className="text-2xl font-semibold text-white">
                  Point Transaction Process
                </h3>
                <p className="text-base leading-7 text-neutral-300">
                  Houses submit an Accomplishment Report within <strong className="text-white">seven (7) calendar days</strong> of
                  an eligible activity. The Secretary of Internal Affairs posts claimed points provisionally within{" "}
                  <strong className="text-white">three (3) business days</strong>. Other Houses have{" "}
                  <strong className="text-white">seven (7) calendar days</strong> to file a petition challenging the
                  posting. If no petition is filed, points become final and executory.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Article I, Section 5
                </p>
              </div>
            </article>

            {/* Point Keeper */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <h3 className="text-2xl font-semibold text-white">
                  Point Keeper & Ledger Management
                </h3>
                <p className="text-base leading-7 text-neutral-300">
                  The <strong className="text-white">Secretary of Internal Affairs</strong> serves as the Point Keeper,
                  maintaining the Master House Point Ledger in digital format. All Society members have view access
                  to the Ledger through the Society's official online platform. A summary report with category
                  breakdowns is presented monthly at the Society Assembly Meeting.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Article I, Sections 7 & 11
                </p>
              </div>
            </article>

            {/* Dispute Resolution */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <h3 className="text-2xl font-semibold text-white">
                  Dispute Resolution
                </h3>
                <p className="text-base leading-7 text-neutral-300">
                  If a petition is filed within the 7-day provisional period, the{" "}
                  <strong className="text-white">High Tribunal</strong> is convened with the President as Presiding
                  Judge and the three uninvolved House Chancellors voting on the point transaction. A decision
                  is rendered within <strong className="text-white">fourteen (14) calendar days</strong>. The House
                  that submitted the report may appeal on constitutional grounds to the{" "}
                  <strong className="text-white">Society Adviser</strong>, whose decision is final.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Article I, Sections 5(4) & 8
                </p>
              </div>
            </article>
          </div>

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
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                <a
                  href="/standings/transactions"
                  className="inline-flex items-center font-medium text-neutral-400 transition hover:text-white"
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
                  className="inline-flex items-center font-medium text-neutral-400 transition hover:text-white"
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
              </div>
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