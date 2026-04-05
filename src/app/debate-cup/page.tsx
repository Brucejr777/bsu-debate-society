import { supabase } from "@/lib/supabase";
import { HOUSES, HOUSE_COLORS, HOUSE_LABELS } from "@/lib/houses";

export const dynamic = "force-dynamic";

interface CupMatch {
  id: number;
  created_at: string;
  semester: string;
  round_number: number;
  match_date: string | null;
  match_time: string | null;
  venue: string | null;
  virtual_link: string | null;
  house_a: string;
  house_b: string;
  motion: string | null;
  status: string;
  winner: string | null;
  is_draw: boolean;
  best_team: string | null;
  house_a_score: number | null;
  house_b_score: number | null;
  adjudicators: string | null;
  notes: string | null;
  published: boolean;
}

const HOUSE_SHORT: Record<string, string> = {
  Bathala: "Bathala",
  Kabunian: "Kabunian",
  Laon: "Laon",
  Manama: "Manama",
};

interface Standings {
  house: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  bestTeam: number;
}

function computeStandings(matches: CupMatch[]): Standings[] {
  const map: Record<string, Standings> = {};
  HOUSES.forEach((h) => {
    map[h.value] = {
      house: h.value,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      bestTeam: 0,
    };
  });

  for (const m of matches) {
    if (m.status !== "completed") continue;

    const a = map[m.house_a];
    const b = map[m.house_b];
    if (!a || !b) continue;

    a.played++;
    b.played++;

    if (m.is_draw) {
      a.draws++;
      b.draws++;
      a.points += 7;
      b.points += 7;
    } else if (m.winner) {
      const winner = m.winner === m.house_a ? a : b;
      const loser = m.winner === m.house_a ? b : a;
      winner.wins++;
      winner.points += 15;
      loser.losses++;
      loser.points += 3;
    }

    if (m.best_team) {
      map[m.best_team].bestTeam++;
      map[m.best_team].points += 5;
    }
  }

  return Object.values(map).sort(
    (a, b) => b.points - a.points || b.wins - a.wins
  );
}

export default async function DebateCupPage() {
  const { data, error } = await supabase
    .from("debate_cup_matches")
    .select("*")
    .eq("published", true)
    .order("match_date", { ascending: true })
    .order("round_number", { ascending: true });

  const matches: CupMatch[] = data ?? [];
  const semester = matches[0]?.semester ?? "";
  const standings = computeStandings(matches);

  // Group by round
  const byRound: Record<number, CupMatch[]> = {};
  for (const m of matches) {
    if (!byRound[m.round_number]) byRound[m.round_number] = [];
    byRound[m.round_number].push(m);
  }
  const rounds = Object.entries(byRound).sort(
    (a, b) => parseInt(a[0]) - parseInt(b[0])
  );

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
              Rules &amp; Procedures — Article I, Section 10
            </p>
            <h1 className="inline-block rounded-lg bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Inter-House Debate Cup
            </h1>
          </div>

          {/* Intro */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Inter-House Debate Cup is held each semester as a distinct
              competition series with mandatory participation from all four
              Houses in a round-robin format — each House debates every other
              House once. Points are awarded per match: fifteen (+15) for a win,
              seven (+7) for a draw, three (+3) for participation, and five (+5)
              bonus for best team performance.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article I, Section 10(1)
            </p>
          </article>

          {semester && (
            <div className="flex items-center justify-center">
              <span className="rounded-full bg-neutral-800 px-4 py-1.5 text-sm font-medium text-neutral-300">
                {semester}
              </span>
            </div>
          )}

          {/* ── Round-Robin Standings ── */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Round-Robin Standings
              </h2>
            </div>

            {error && (
              <article className="rounded-3xl border border-red-800 bg-red-950/50 p-8 text-center text-red-400">
                Failed to load standings.
              </article>
            )}

            {!error && standings.length > 0 && (
              <>
                {/* Leader Card */}
                {(() => {
                  const top = standings[0];
                  const color = HOUSE_COLORS[top.house] ?? "#666";
                  return (
                    <article className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30">
                      <div
                        className="absolute left-0 top-0 h-full w-2"
                        style={{ backgroundColor: color }}
                      />
                      <div className="pl-4 text-center">
                        <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                          Cup Leader
                        </p>
                        <h3 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                          {HOUSE_LABELS[top.house]}
                        </h3>
                        <p className="mt-4 text-6xl font-bold tabular-nums text-white sm:text-7xl">
                          {top.points}
                        </p>
                        <p className="mt-2 text-sm text-neutral-500">
                          points
                        </p>
                      </div>
                    </article>
                  );
                })()}

                {/* Standings Table — Desktop */}
                <div className="hidden sm:block">
                  <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 shadow-xl shadow-black/30">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-500">
                          <th className="px-5 py-3 font-medium uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-5 py-3 font-medium uppercase tracking-wider">
                            House
                          </th>
                          <th className="px-5 py-3 text-center font-medium uppercase tracking-wider">
                            P
                          </th>
                          <th className="px-5 py-3 text-center font-medium uppercase tracking-wider">
                            W
                          </th>
                          <th className="px-5 py-3 text-center font-medium uppercase tracking-wider">
                            D
                          </th>
                          <th className="px-5 py-3 text-center font-medium uppercase tracking-wider">
                            L
                          </th>
                          <th className="px-5 py-3 text-center font-medium uppercase tracking-wider">
                            BT
                          </th>
                          <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">
                            Pts
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((s, idx) => {
                          const color = HOUSE_COLORS[s.house] ?? "#666";
                          return (
                            <tr
                              key={s.house}
                              className="border-b border-neutral-800/50 transition hover:bg-neutral-900/50"
                            >
                              <td className="px-5 py-4">
                                <span
                                  className="flex size-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                                  style={{ backgroundColor: color }}
                                >
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="px-5 py-4 font-medium text-white">
                                {HOUSE_LABELS[s.house]}
                              </td>
                              <td className="px-5 py-4 text-center tabular-nums text-neutral-300">
                                {s.played}
                              </td>
                              <td className="px-5 py-4 text-center tabular-nums text-emerald-400">
                                {s.wins}
                              </td>
                              <td className="px-5 py-4 text-center tabular-nums text-neutral-400">
                                {s.draws}
                              </td>
                              <td className="px-5 py-4 text-center tabular-nums text-red-400">
                                {s.losses}
                              </td>
                              <td className="px-5 py-4 text-center tabular-nums text-neutral-300">
                                {s.bestTeam}
                              </td>
                              <td className="px-5 py-4 text-right font-bold tabular-nums text-white">
                                {s.points}
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
                  {standings.map((s, idx) => {
                    const color = HOUSE_COLORS[s.house] ?? "#666";
                    return (
                      <article
                        key={s.house}
                        className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex size-9 items-center justify-center rounded-lg text-sm font-bold text-white"
                              style={{ backgroundColor: color }}
                            >
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {HOUSE_LABELS[s.house]}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {s.played} played · {s.wins}W {s.draws}D{" "}
                                {s.losses}L
                              </p>
                            </div>
                          </div>
                          <p className="text-2xl font-bold tabular-nums text-white">
                            {s.points}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}

            {!error && standings.length === 0 && (
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 text-center text-neutral-400">
                No Debate Cup standings available yet for this semester.
              </article>
            )}
          </div>

          {/* ── Schedule & Results ── */}
          {rounds.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-center text-3xl font-semibold text-white">
                Schedule &amp; Results
              </h2>

              {rounds.map(([roundNum, roundMatches]) => (
                <div key={roundNum} className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Round {roundNum}
                  </h3>
                  <div className="space-y-3">
                    {roundMatches.map((m) => {
                      const colorA = HOUSE_COLORS[m.house_a] ?? "#666";
                      const colorB = HOUSE_COLORS[m.house_b] ?? "#666";
                      const aWon = !m.is_draw && m.winner === m.house_a;
                      const bWon = !m.is_draw && m.winner === m.house_b;
                      return (
                        <article
                          key={m.id}
                          className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
                        >
                          {/* Match Header */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                            {m.match_date && (
                              <span>
                                {new Date(m.match_date).toLocaleDateString()}
                              </span>
                            )}
                            {m.match_time && <span>· {m.match_time}</span>}
                            {m.venue && <span>· {m.venue}</span>}
                            <span className="ml-auto capitalize">
                              {m.status}
                            </span>
                          </div>

                          {/* Matchup */}
                          <div className="mt-4 flex items-center justify-between gap-4">
                            {/* House A */}
                            <div className="flex-1 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span
                                  className={`text-lg font-semibold ${
                                    aWon
                                      ? "text-white"
                                      : m.is_draw
                                        ? "text-neutral-300"
                                        : "text-neutral-500"
                                  }`}
                                >
                                  {HOUSE_SHORT[m.house_a] ?? m.house_a}
                                </span>
                                <div
                                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                                  style={{ backgroundColor: colorA }}
                                >
                                  {m.house_a[0]}
                                </div>
                              </div>
                              {m.status === "completed" &&
                                m.house_a_score != null && (
                                  <p className="mt-1 text-sm font-bold tabular-nums text-neutral-300">
                                    {m.house_a_score}
                                  </p>
                                )}
                            </div>

                            {/* VS / Score */}
                            <div className="flex shrink-0 flex-col items-center">
                              {m.status === "completed" ? (
                                <span className="text-sm font-bold text-neutral-500">
                                  {m.is_draw ? "Draw" : ""}
                                </span>
                              ) : (
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                                  vs
                                </span>
                              )}
                              {m.best_team && (
                                <span className="mt-1 rounded-full bg-amber-900/60 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                  Best Team
                                </span>
                              )}
                            </div>

                            {/* House B */}
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <div
                                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                                  style={{ backgroundColor: colorB }}
                                >
                                  {m.house_b[0]}
                                </div>
                                <span
                                  className={`text-lg font-semibold ${
                                    bWon
                                      ? "text-white"
                                      : m.is_draw
                                        ? "text-neutral-300"
                                        : "text-neutral-500"
                                  }`}
                                >
                                  {HOUSE_SHORT[m.house_b] ?? m.house_b}
                                </span>
                              </div>
                              {m.status === "completed" &&
                                m.house_b_score != null && (
                                  <p className="mt-1 text-sm font-bold tabular-nums text-neutral-300">
                                    {m.house_b_score}
                                  </p>
                                )}
                            </div>
                          </div>

                          {/* Motion */}
                          {m.motion && (
                            <p className="mt-3 text-center text-sm italic text-neutral-500">
                              &ldquo;{m.motion}&rdquo;
                            </p>
                          )}

                          {/* Adjudicators */}
                          {m.adjudicators && (
                            <p className="mt-1 text-center text-xs text-neutral-600">
                              Adjudicators: {m.adjudicators}
                            </p>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Point Values Legend */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-xl font-semibold text-white">
                Cup Point Values
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <p className="text-2xl font-bold text-emerald-400">+15</p>
                  <p className="mt-1 text-xs text-neutral-400">Match Win</p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <p className="text-2xl font-bold text-neutral-300">+7</p>
                  <p className="mt-1 text-xs text-neutral-400">Match Draw</p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <p className="text-2xl font-bold text-neutral-400">+3</p>
                  <p className="mt-1 text-xs text-neutral-400">Participation</p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <p className="text-2xl font-bold text-amber-400">+5</p>
                  <p className="mt-1 text-xs text-neutral-400">Best Team</p>
                </div>
              </div>
              <p className="text-xs italic text-neutral-500">
                — Article I, Section 10(1)
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
