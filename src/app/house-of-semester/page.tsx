import { supabase } from "@/lib/supabase";
import { HOUSES, HOUSE_COLORS, HOUSE_LABELS } from "@/lib/houses";

export const dynamic = "force-dynamic";

interface SemWinner {
  id: number;
  created_at: string;
  semester: string;
  academic_year: string;
  winning_house: string;
  final_points: number;
  bonus_points_awarded: number;
  certificate_issued: boolean;
  notes: string | null;
}

export default async function HouseOfSemesterPage() {
  const { data, error } = await supabase
    .from("house_of_semester")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const winners: SemWinner[] = data ?? [];
  const latest = winners[0] ?? null;

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
              Rules &amp; Procedures — Article I, Section 9(4)
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              House of the Semester
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The House of the Semester recognition is awarded to the top House
              at the end of each semester based on cumulative point standings.
              The winning House receives a certificate, public recognition, and
              carries over ten (+10) bonus points to the next semester. This
              recognition is separate from and does not affect the annual House
              Cup competition.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article I, Section 9(4)
            </p>
          </article>

          {/* ═══════════════════════════════════════ */}
          {/* CURRENT HOLDER                          */}
          {/* ═══════════════════════════════════════ */}
          {latest && (
            <article className="relative overflow-hidden rounded-3xl border border-amber-900/40 bg-neutral-950/95 p-10 shadow-xl shadow-black/30">
              <div
                className="absolute left-0 top-0 h-full w-2"
                style={{
                  backgroundColor:
                    HOUSE_COLORS[latest.winning_house] ?? "#666",
                }}
              />
              <div className="pl-4">
                <p className="text-center text-sm uppercase tracking-[0.35em] text-neutral-500">
                  Current Holder
                </p>
                <div className="mt-4 text-center">
                  <div
                    className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor:
                        HOUSE_COLORS[latest.winning_house] ?? "#666",
                    }}
                  >
                    <span className="text-3xl font-bold text-white">
                      {latest.winning_house[0]}
                    </span>
                  </div>
                  <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    {HOUSE_LABELS[latest.winning_house]?.replace(
                      "House of ",
                      ""
                    ) ?? latest.winning_house}
                  </h2>
                  <p className="mt-2 text-sm text-neutral-400">
                    {latest.semester} &middot; {latest.academic_year}
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-8">
                    <div className="text-center">
                      <p className="text-3xl font-bold tabular-nums text-white">
                        {latest.final_points}
                      </p>
                      <p className="text-xs text-neutral-500">
                        semester points
                      </p>
                    </div>
                    <div className="h-8 w-px bg-neutral-700" />
                    <div className="text-center">
                      <p className="text-3xl font-bold tabular-nums text-amber-400">
                        +{latest.bonus_points_awarded}
                      </p>
                      <p className="text-xs text-neutral-500">
                        bonus carryover
                      </p>
                    </div>
                    {latest.certificate_issued && (
                      <>
                        <div className="h-8 w-px bg-neutral-700" />
                        <div className="text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="mx-auto mb-1 size-6 text-emerald-400"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474L16.79 18H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.04 12.28a.75.75 0 0 0 1.06-1.06l-1.72-1.72h4.12a.75.75 0 0 0 0-1.5H7.63l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3a.75.75 0 0 0 0 1.06l3 3Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-xs text-neutral-500">
                            certificate issued
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {latest.notes && (
                  <p className="mt-6 text-center text-sm italic text-neutral-500">
                    {latest.notes}
                  </p>
                )}
              </div>
            </article>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* WHAT THE WINNER RECEIVES                */}
          {/* ═══════════════════════════════════════ */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <article className="rounded-3xl border border-emerald-900/40 bg-neutral-950/95 p-6 shadow-lg text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 text-emerald-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-emerald-200">
                Certificate
              </h3>
              <p className="mt-2 text-xs leading-5 text-neutral-400">
                Official certificate of recognition signed by the High Council.
              </p>
            </article>

            <article className="rounded-3xl border border-amber-900/40 bg-neutral-950/95 p-6 shadow-lg text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-amber-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 text-amber-400"
                >
                  <path d="M12 2.25c-1.742 0-3.408.052-5.016.152a26.109 26.109 0 0 0-4.132.479 9.47 9.47 0 0 0-.564.129c-.18.05-.4.137-.595.31a4.659 4.659 0 0 0-.795 5.067 25.841 25.841 0 0 1-.44 10.823 4.642 4.642 0 0 0 .654 1.187c.13.172.34.312.527.386.087.033.278.093.56.157a25.782 25.782 0 0 0 9.804 0c.282-.064.474-.124.56-.157a.881.881 0 0 0 .528-.386 4.639 4.639 0 0 0 .653-1.187 25.841 25.841 0 0 0-.44-10.823 4.659 4.659 0 0 0-.795-5.067 1.123 1.123 0 0 0-.595-.31 9.457 9.457 0 0 0-.564-.129 26.115 26.115 0 0 0-4.132-.479A80.555 80.555 0 0 0 12 2.25Zm-2.889 14.4a.75.75 0 0 0 1.278-.614l-2.12-5.065a.75.75 0 0 0-1.278.614l2.12 5.065Zm4.016-5.065a.75.75 0 0 1 1.278.614L12.285 17.26a.75.75 0 0 1-1.278-.614l2.12-5.065Z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-amber-200">
                Public Recognition
              </h3>
              <p className="mt-2 text-xs leading-5 text-neutral-400">
                Official announcement and recognition across Society channels.
              </p>
            </article>

            <article className="rounded-3xl border border-blue-900/40 bg-neutral-950/95 p-6 shadow-lg text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-blue-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 text-blue-400"
                >
                  <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM9 4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 9 4.5Zm6 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 15 4.5ZM6.75 15.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0Zm4.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0Zm4.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-blue-200">
                +10 Bonus Points
              </h3>
              <p className="mt-2 text-xs leading-5 text-neutral-400">
                Ten bonus points carried over to the next semester&apos;s standings.
              </p>
            </article>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* PAST WINNERS                            */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Past Recognition
              </h2>
            </div>

            {error && (
              <article className="rounded-3xl border border-red-800 bg-red-950/50 p-8 text-center text-red-400">
                Failed to load records.
              </article>
            )}

            {!error && winners.length === 0 && (
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 text-center text-neutral-400">
                No House of the Semester records yet.
              </article>
            )}

            {!error && winners.length > 0 && (
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
                <div className="space-y-3">
                  {winners.map((w, idx) => {
                    const color = HOUSE_COLORS[w.winning_house] ?? "#666";
                    return (
                      <article
                        key={w.id}
                        className="group relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg transition-all duration-300 hover:scale-[1.01]"
                      >
                        <div
                          className="absolute left-0 top-0 h-full w-1.5"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex flex-wrap items-center gap-3 pl-4">
                          <div
                            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                            style={{ backgroundColor: color }}
                          >
                            {w.winning_house[0]}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-white">
                              {HOUSE_LABELS[w.winning_house]?.replace(
                                "House of ",
                                ""
                              ) ?? w.winning_house}
                            </h3>
                            <p className="text-xs text-neutral-400">
                              {w.semester} &middot; {w.academic_year} &middot;{" "}
                              {w.final_points} pts
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="rounded-full bg-blue-900/60 px-3 py-1 text-xs font-semibold text-blue-300">
                              +{w.bonus_points_awarded} bonus
                            </span>
                          </div>
                          {w.certificate_issued && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="size-5 text-emerald-400"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        {w.notes && (
                          <p className="mt-2 pl-14 text-xs italic text-neutral-500">
                            {w.notes}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Rules Reference */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-xl font-semibold text-white">
                Separate from House Cup
              </h2>
              <p className="text-base leading-7 text-neutral-300">
                The House of the Semester recognition is awarded each semester
                and is entirely separate from the annual House Cup competition.
                Bonus points earned from this recognition carry over to the next
                semester&apos;s standings, giving the winning House a head start.
                The House Cup competition period spans the full academic year
                and points reset at the start of each new year.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Article I, Section 9(4)
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
