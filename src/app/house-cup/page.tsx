import { supabase } from "@/lib/supabase";
import { HOUSES, HOUSE_COLORS, HOUSE_LABELS } from "@/lib/houses";

export const dynamic = "force-dynamic";

interface CupWinner {
  id: number;
  created_at: string;
  academic_year: string;
  winning_house: string;
  final_points: number;
  runner_up_house: string | null;
  runner_up_points: number | null;
  tiebreaker_used: string | null;
  notable_achievements: string | null;
}

interface HouseRow {
  id: number;
  house_name: string;
  total_points: number;
  semester: string;
}

export default async function HouseCupPage() {
  const [{ data: winnersData, error: winnersError }, { data: pointsData }] =
    await Promise.all([
      supabase
        .from("house_cup_winners")
        .select("*")
        .eq("published", true)
        .order("academic_year", { ascending: false }),
      supabase
        .from("house_points")
        .select("*")
        .order("total_points", { ascending: false }),
    ]);

  const winners: CupWinner[] = winnersData ?? [];
  const rows: HouseRow[] = pointsData ?? [];

  // Group points by semester
  const semesters = [...new Set(rows.map((r) => r.semester))];
  const currentSemester = semesters[0] ?? "";
  const currentStandings = currentSemester
    ? rows.filter((r) => r.semester === currentSemester)
    : [];

  // Count wins per house
  const winCounts: Record<string, number> = {};
  for (const w of winners) {
    winCounts[w.winning_house] = (winCounts[w.winning_house] || 0) + 1;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back */}
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
              Rules &amp; Procedures — Article I, Section 9
            </p>
            <h1 className="inline-block rounded-lg bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              The House Cup
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The House Cup is awarded at the end of each academic year to the
              House with the highest cumulative point total. The competition
              period begins on the first day of the First Semester and ends on
              the last day of the Second Semester. Points reset to zero at the
              start of each new academic year.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article I, Section 9
            </p>
          </article>

          {/* ── Current Competition Status ── */}
          {currentStandings.length > 0 && (
            <article className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div
                className="absolute left-0 top-0 h-full w-2"
                style={{
                  backgroundColor:
                    HOUSE_COLORS[currentStandings[0]?.house_name] ?? "#666",
                }}
              />
              <div className="pl-4">
                <p className="text-center text-sm uppercase tracking-[0.35em] text-neutral-500">
                  Current Race — {currentSemester}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
                  {currentStandings.map((s) => {
                    const color = HOUSE_COLORS[s.house_name] ?? "#666";
                    return (
                      <div
                        key={s.id}
                        className="rounded-2xl bg-neutral-900 p-4 text-center"
                      >
                        <div
                          className="mx-auto mb-2 flex size-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                          style={{ backgroundColor: color }}
                        >
                          {s.house_name[0]}
                        </div>
                        <p className="text-sm font-medium text-white">
                          {HOUSE_LABELS[s.house_name]?.replace("House of ", "") ??
                            s.house_name}
                        </p>
                        <p className="mt-1 text-2xl font-bold tabular-nums text-white">
                          {s.total_points}
                        </p>
                        <p className="text-xs text-neutral-500">points</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          )}

          {/* ── Historical Winners ── */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Hall of Champions
              </h2>
              <p className="text-sm text-neutral-500">
                Past House Cup winners by academic year
              </p>
            </div>

            {winnersError && (
              <article className="rounded-3xl border border-red-800 bg-red-950/50 p-8 text-center text-red-400">
                Failed to load Hall of Champions.
              </article>
            )}

            {!winnersError && winners.length === 0 && (
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 text-center text-neutral-400">
                No House Cup winners recorded yet. The first competition is
                underway.
              </article>
            )}

            {!winnersError && winners.length > 0 && (
              <>
                {/* Win Counts */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {HOUSES.map((h) => (
                    <div
                      key={h.value}
                      className="rounded-2xl bg-neutral-900 p-5 text-center"
                    >
                      <div
                        className="mx-auto mb-2 flex size-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                        style={{ backgroundColor: h.color }}
                      >
                        {h.value[0]}
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {winCounts[h.value] ?? 0}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {h.value} win{winCounts[h.value] !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {winners.map((w) => {
                    const color = HOUSE_COLORS[w.winning_house] ?? "#666";
                    return (
                      <article
                        key={w.id}
                        className="group relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
                      >
                        <div
                          className="absolute left-0 top-0 h-full w-1.5"
                          style={{ backgroundColor: color }}
                        />
                        <div className="pl-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-800">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6 text-amber-400"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.166 2.621v.818c0 .379.193.732.512.936a3.75 3.75 0 0 0 6.644 0A1.125 1.125 0 0 1 12.834 3.44v-.819a.75.75 0 0 1 1.5 0v.818a4.125 4.125 0 0 1-1.5 3.306 5.25 5.25 0 0 1-.307 5.873A6.75 6.75 0 0 1 5.027 19.5a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 .75-.75 5.25 5.25 0 0 0 5.25-5.25v-.819a5.25 5.25 0 0 0-1.5-3.306 4.125 4.125 0 0 1-1.5-3.306v-.818a.75.75 0 0 1 1.5 0Zm8.334 0v.818c0 .379-.193.732-.512.936a3.75 3.75 0 0 1-6.644 0A1.125 1.125 0 0 0 12.666 3.44v-.819a.75.75 0 0 0-1.5 0v.818a4.125 4.125 0 0 0 1.5 3.306 5.25 5.25 0 0 0 .307 5.873 6.75 6.75 0 0 0 7.501 6.873.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75 5.25 5.25 0 0 1-5.25-5.25v-.819a5.25 5.25 0 0 1 1.5-3.306 4.125 4.125 0 0 0 1.5-3.306v-.818a.75.75 0 0 0-1.5 0Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {HOUSE_LABELS[w.winning_house]?.replace(
                                  "House of ",
                                  ""
                                ) ?? w.winning_house}
                              </h3>
                              <p className="text-sm text-neutral-400">
                                {w.academic_year}
                              </p>
                            </div>
                            <div className="ml-auto text-right">
                              <p className="text-2xl font-bold tabular-nums text-white">
                                {w.final_points}
                              </p>
                              <p className="text-xs text-neutral-500">points</p>
                            </div>
                          </div>

                          {/* Runner-up */}
                          {w.runner_up_house && (
                            <p className="mt-3 text-sm text-neutral-500">
                              Runner-up:{" "}
                              <span className="text-neutral-300">
                                {HOUSE_LABELS[w.runner_up_house]?.replace(
                                  "House of ",
                                  ""
                                ) ??
                                  w.runner_up_house}{" "}
                                ({w.runner_up_points ?? 0} pts)
                              </span>
                            </p>
                          )}

                          {/* Tiebreaker */}
                          {w.tiebreaker_used && (
                            <p className="mt-2 text-xs text-amber-500">
                              Decided by: {w.tiebreaker_used}
                            </p>
                          )}

                          {/* Notable achievements */}
                          {w.notable_achievements && (
                            <p className="mt-2 text-sm italic text-neutral-500">
                              {w.notable_achievements}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* TROPHY & MATERIAL BENEFITS              */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Trophy &amp; Benefits
              </h2>
            </div>

            {/* Trophy Details */}
            <article className="rounded-3xl border border-amber-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-amber-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.166 2.621v.818c0 .379.193.732.512.936a3.75 3.75 0 0 0 6.644 0A1.125 1.125 0 0 1 12.834 3.44v-.819a.75.75 0 0 1 1.5 0v.818a4.125 4.125 0 0 1-1.5 3.306 5.25 5.25 0 0 1-.307 5.873A6.75 6.75 0 0 1 5.027 19.5a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 .75-.75 5.25 5.25 0 0 0 5.25-5.25v-.819a5.25 5.25 0 0 0-1.5-3.306 4.125 4.125 0 0 1-1.5-3.306v-.818a.75.75 0 0 1 1.5 0Zm8.334 0v.818c0 .379-.193.732-.512.936a3.75 3.75 0 0 1-6.644 0A1.125 1.125 0 0 0 12.666 3.44v-.819a.75.75 0 0 0-1.5 0v.818a4.125 4.125 0 0 0 1.5 3.306 5.25 5.25 0 0 0 .307 5.873 6.75 6.75 0 0 0 7.501 6.873.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75 5.25 5.25 0 0 1-5.25-5.25v-.819a5.25 5.25 0 0 1 1.5-3.306 4.125 4.125 0 0 0 1.5-3.306v-.818a.75.75 0 0 0-1.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-amber-200">
                    The House Cup Trophy
                  </h3>
                </div>
                <p className="text-base leading-7 text-neutral-300">
                  The winning House receives a physical House Cup trophy bearing
                  a removable plaque with the academic year and House name
                  affixed for that year only. The trophy remains in the
                  possession of the winning House throughout their year of
                  recognition and is accompanied by a certificate of recognition
                  signed by the High Council.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Article I, Section 9(3)
                </p>
              </div>
            </article>

            {/* Material Benefits */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-emerald-900/40 bg-neutral-950/95 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 text-emerald-400"
                    >
                      <path d="M10.464 2.432a3.75 3.75 0 0 1 3.072 0l1.965.982A4.125 4.125 0 0 1 18 7.327V9a2.625 2.625 0 0 1-1.893 2.517c-.28.077-.57.133-.866.167a2.625 2.625 0 0 1-1.279 1.998l-.567.378a2.625 2.625 0 0 1-2.922 0l-.567-.378a2.625 2.625 0 0 1-1.279-1.998 3.75 3.75 0 0 1-.866-.167A2.625 2.625 0 0 1 6 9V7.327a4.125 4.125 0 0 1 2.501-3.913l1.965-.982Z" />
                      <path d="M3.75 12.75a.75.75 0 0 1 .75.75v5.25c0 1.035.84 1.875 1.875 1.875h11.25A1.875 1.875 0 0 0 19.5 18.75V13.5a.75.75 0 0 1 1.5 0v5.25A3.375 3.375 0 0 1 17.625 22.125H6.375A3.375 3.375 0 0 1 3 18.75V13.5a.75.75 0 0 1 .75-.75Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-200">
                    Budget Allocation
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-300">
                  An additional{" "}
                  <strong className="text-white">two hundred Philippine pesos
                  (₱200)</strong> budget allocation from the Society treasury,
                  subject to the availability of funds, awarded to the winning
                  House.
                </p>
              </article>

              <article className="rounded-3xl border border-blue-900/40 bg-neutral-950/95 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 text-blue-400"
                    >
                      <path d="M15.75 2.25H8.25A3.75 3.75 0 0 0 4.5 6v12a3.75 3.75 0 0 0 3.75 3.75h7.5a3.75 3.75 0 0 0 3.75-3.75V6a3.75 3.75 0 0 0-3.75-3.75ZM12 15.75a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-200">
                    Finals Qualification
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-300">
                  Automatic qualification to the{" "}
                  <strong className="text-white">finals of the next year&apos;s
                  premier inter-House tournament</strong>, bypassing preliminary
                  rounds.
                </p>
              </article>

              <article className="rounded-3xl border border-purple-900/40 bg-neutral-950/95 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 text-purple-400"
                    >
                      <path d="M4.099 3.04a.75.75 0 0 1 1.05-.04l.396.369a21.558 21.558 0 0 0 4.475-1.697l1.27-.71a.75.75 0 0 1 .912.135c1.298 1.473 2.91 2.638 4.732 3.418l1.34.573a.75.75 0 0 1 .205 1.216l-3.355 3.786 1.39 4.235a.75.75 0 0 1-.77.985l-4.422-.479a21.624 21.624 0 0 1-5.39 1.104.75.75 0 0 1-.62-.285l-2.568-3.17a.75.75 0 0 1 .067-.998l3.377-3.011-.89-4.665a.75.75 0 0 1 .374-.76Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-purple-200">
                    Topic Proposal Right
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-300">
                  The right to{" "}
                  <strong className="text-white">propose one debate topic</strong>{" "}
                  for the opening tournament of the next academic year.
                </p>
              </article>

              <article className="rounded-3xl border border-amber-900/40 bg-neutral-950/95 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 text-amber-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-amber-200">
                    Certificate &amp; Plaque
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-300">
                  A certificate of recognition and a physical trophy with a
                  removable plaque bearing the academic year and House name,
                  affixed for that year only.
                </p>
              </article>
            </div>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* TIEBREAKER SEQUENCE                     */}
          {/* ═══════════════════════════════════════ */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  Tiebreaker Sequence
                </h2>
                <p className="text-sm italic text-neutral-500">
                  — Article I, Section 9(2)
                </p>
              </div>
              <p className="text-base leading-7 text-neutral-300">
                In the event of a tie for the House Cup, the following sequence
                applies until the tie is broken:
              </p>
              <ol className="space-y-3 text-left">
                {[
                  {
                    step: "1st",
                    title: "Debate Competition Points",
                    desc: "The House with the highest points in debate competitions, including both inter-House tournaments and external events.",
                  },
                  {
                    step: "2nd",
                    title: "Member Participation Rate",
                    desc: "The House with the highest member participation rate, measured as the percentage of House members active in Society activities.",
                  },
                  {
                    step: "3rd",
                    title: "Fewest Violations",
                    desc: "The House with the lowest point deductions — meaning the fewest conduct or compliance violations.",
                  },
                  {
                    step: "4th",
                    title: "Head-to-Head Record",
                    desc: "The head-to-head record between the tied Houses in direct competitions.",
                  },
                  {
                    step: "5th",
                    title: "Drawing of Lots",
                    desc: "If a tie persists after all preceding criteria, the winner is determined by drawing of lots.",
                  },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-xs font-bold text-white">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.title}
                      </p>
                      <p className="text-sm text-neutral-400">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </article>

          {/* House of the Semester */}
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
                    <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.632 8.632a.75.75 0 0 1-1.061 1.06l-.351-.35-6.22 6.22a3.125 3.125 0 0 1-4.42 0l-6.22-6.22-.352.35a.75.75 0 0 1-1.06-1.06L11.47 3.84Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  House of the Semester
                </h2>
              </div>
              <p className="text-base leading-7 text-neutral-300">
                In addition to the annual House Cup, a House of the Semester
                recognition is awarded to the top House at the end of each
                semester. This House receives a certificate, public recognition,
                and carries over{" "}
                <strong className="text-white">ten (+10) bonus points</strong>{" "}
                to the next semester. This recognition is separate from and does
                not affect the House Cup competition.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Article I, Section 9(4)
              </p>
              <a
                href="/house-of-semester"
                className="inline-flex items-center justify-center rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
              >
                View All Recognition Records
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
          </article>
        </div>
      </section>
    </div>
  );
}
