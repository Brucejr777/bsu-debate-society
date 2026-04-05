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

interface LeagueMember {
  id: number;
  created_at: string;
  member_name: string;
  house: string;
  individual_points: number;
  semester: string;
  rank: number;
}

interface IndividualAward {
  id: number;
  created_at: string;
  member_name: string;
  house: string;
  award_category: string;
  tier: string;
  semester: string;
}

const TIER_BADGE_STYLE: Record<string, string> = {
  "Society Fellow":
    "bg-amber-900/60 text-amber-300 ring-amber-700",
  "Distinguished Member":
    "bg-purple-900/60 text-purple-300 ring-purple-700",
  "Emerging Contributor":
    "bg-neutral-800 text-neutral-300 ring-neutral-600",
};

export default async function LeaguePage() {
  const [{ data: membersData, error: membersError }, { data: awardsData, error: awardsError }] =
    await Promise.all([
      supabase
        .from("debate_league_members")
        .select("*")
        .order("rank", { ascending: true }),
      supabase
        .from("individual_awards")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

  const members: LeagueMember[] = membersData ?? [];
  const awards: IndividualAward[] = awardsData ?? [];
  const semester = members[0]?.semester ?? "";

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
              Rules &amp; Procedures — Articles II &amp; III
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#ffb800] to-[#ff4d00] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Debate League &amp; Individual Recognition
            </h1>
          </div>

          {semester && (
            <div className="flex items-center justify-center">
              <span className="rounded-full bg-neutral-800 px-4 py-1.5 text-sm font-medium text-neutral-300">
                {semester}
              </span>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* DEBATE LEAGUE SECTION                   */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Debate League
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Rules and Procedures, Article III
              </p>
            </div>

            <article className="mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-base leading-7 text-neutral-300">
                The Debate League identifies and selects the top 8 members of the
                Society based on individual performance points accumulated across
                all debate tournaments and Society events. These top-ranked members
                are designated as the Society's official external representatives
                for national and international competitions.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Article III, Section 1 &amp; Section 3
              </p>
            </article>

            {/* Top 8 Table */}
            {membersError && (
              <article className="rounded-3xl border border-red-800 bg-red-950/50 p-6 text-center text-sm text-red-400">
                Failed to load league data. Please try again later.
              </article>
            )}

            {!membersError && members.length === 0 && (
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 text-center text-sm text-neutral-400">
                No league data available yet for this semester.
              </article>
            )}

            {!membersError && members.length > 0 && (
              <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 shadow-xl shadow-black/30">
                {/* Desktop Table */}
                <div className="hidden sm:block">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500">
                        <th className="px-6 py-4 font-medium uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-4 font-medium uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-6 py-4 font-medium uppercase tracking-wider">
                          House
                        </th>
                        <th className="px-6 py-4 text-right font-medium uppercase tracking-wider">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => {
                        const color = HOUSE_COLORS[m.house] ?? "#666";
                        return (
                          <tr
                            key={m.id}
                            className="border-b border-neutral-800/50 transition hover:bg-neutral-900/50"
                          >
                            <td className="px-6 py-4">
                              <span className="inline-flex size-8 items-center justify-center rounded-lg font-bold tabular-nums text-white"
                                style={{ backgroundColor: color }}
                              >
                                {m.rank}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-white">
                              {m.member_name}
                            </td>
                            <td className="px-6 py-4 text-neutral-400">
                              {HOUSE_LABELS[m.house] ?? m.house}
                            </td>
                            <td className="px-6 py-4 text-right font-semibold tabular-nums text-white">
                              {m.individual_points.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 p-4 sm:hidden">
                  {members.map((m) => {
                    const color = HOUSE_COLORS[m.house] ?? "#666";
                    return (
                      <article
                        key={m.id}
                        className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex size-9 items-center justify-center rounded-lg text-sm font-bold text-white"
                              style={{ backgroundColor: color }}
                            >
                              {m.rank}
                              {rankSuffix(m.rank)}
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {m.member_name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {HOUSE_LABELS[m.house] ?? m.house}
                              </p>
                            </div>
                          </div>
                          <p className="text-lg font-bold tabular-nums text-white">
                            {m.individual_points.toLocaleString()}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Support Benefits */}
            {!membersError && members.length > 0 && (
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-sm shadow-black/20">
                <div className="mx-auto max-w-3xl space-y-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6 text-neutral-300"
                      >
                        <path d="M12 2.25c-1.742 0-3.408.052-5.016.152a26.109 26.109 0 0 0-4.132.479 9.47 9.47 0 0 0-.564.129c-.18.05-.4.137-.595.31a4.659 4.659 0 0 0-.795 5.067 25.841 25.841 0 0 1-.44 10.823 4.642 4.642 0 0 0 .654 1.187c.13.172.34.312.527.386.087.033.278.093.56.157a25.782 25.782 0 0 0 9.804 0c.282-.064.474-.124.56-.157a.881.881 0 0 0 .528-.386 4.639 4.639 0 0 0 .653-1.187 25.841 25.841 0 0 0-.44-10.823 4.659 4.659 0 0 0-.795-5.067 1.123 1.123 0 0 0-.595-.31 9.457 9.457 0 0 0-.564-.129 26.115 26.115 0 0 0-4.132-.479A80.555 80.555 0 0 0 12 2.25Zm-2.889 14.4a.75.75 0 0 0 1.278-.614l-2.12-5.065a.75.75 0 0 0-1.278.614l2.12 5.065Zm4.016-5.065a.75.75 0 0 1 1.278.614L12.285 17.26a.75.75 0 0 1-1.278-.614l2.12-5.065Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Representative Benefits
                      </h3>
                    </div>
                  </div>
                  <p className="text-base leading-7 text-neutral-300">
                    Members ranked in the top 8 receive institutional support for
                    external competition participation, including travel fund
                    allocations, dedicated mentorship from senior debaters, and
                    official recognition as Society representatives on the national
                    and international debating circuit.
                  </p>
                  <p className="text-sm italic text-neutral-500">
                    — Article III, Section 4
                  </p>
                  <a
                    href="/league/support"
                    className="inline-flex items-center justify-center rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                  >
                    Request Support
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
            )}
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* INDIVIDUAL RECOGNITION SECTION          */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Individual Recognition
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Rules and Procedures, Article II
              </p>
            </div>

            <article className="mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-base leading-7 text-neutral-300">
                The Individual Recognition Framework honors the contributions,
                growth, and excellence of individual Society members across four
                categories — Leadership, Communication, Academic, and Creative
                Excellence — each aligned with the embodied value of a House. Awards
                are tiered by contribution level and serve as ceremonial recognition
                of outstanding commitment to the Society's mission.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Article II, Section 1 &amp; Section 2
              </p>
            </article>

            {/* Awards Grid */}
            {awardsError && (
              <article className="rounded-3xl border border-red-800 bg-red-950/50 p-6 text-center text-sm text-red-400">
                Failed to load awards data. Please try again later.
              </article>
            )}

            {!awardsError && awards.length === 0 && (
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 text-center text-sm text-neutral-400">
                No individual awards data available yet for this semester.
              </article>
            )}

            {!awardsError && awards.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {awards.map((award) => {
                  const color = HOUSE_COLORS[award.house] ?? "#666";
                  const badgeStyle =
                    TIER_BADGE_STYLE[award.tier] ??
                    "bg-neutral-800 text-neutral-300 ring-neutral-600";

                  return (
                    <article
                      key={award.id}
                      className="group relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-1.5"
                        style={{ backgroundColor: color }}
                      />
                      <div className="pl-3 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {award.member_name}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            {HOUSE_LABELS[award.house] ?? award.house}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="size-4 text-neutral-400"
                            >
                              <path d="M10.75 3.175a.75.75 0 0 1 .5 0c2.189.764 3.604 1.957 4.448 3.228.844 1.272 1.202 2.827 1.202 4.597 0 1.078-.275 2.124-.721 3.054a7.386 7.386 0 0 1-1.352 1.979 1.205 1.205 0 0 1-.537.398c-1.695.59-3.497.92-5.29.92s-3.595-.33-5.29-.92a1.205 1.205 0 0 1-.538-.398 7.38 7.38 0 0 1-1.351-1.98 7.135 7.135 0 0 1-.721-3.053c0-1.77.358-3.325 1.202-4.597.844-1.27 2.259-2.464 4.448-3.228a.75.75 0 0 1 .5 0ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                            </svg>
                            <span className="text-sm font-medium text-neutral-300">
                              {award.award_category}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeStyle}`}
                          >
                            {award.tier}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Note on House Points */}
            {!awardsError && awards.length > 0 && (
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-sm shadow-black/20">
                <div className="mx-auto max-w-3xl space-y-2 text-center">
                  <p className="text-sm leading-6 text-neutral-400">
                    Individual recognition awards are categorized according to the
                    four Houses' embodied values — Leadership (Bathala), Journalism
                    (Kabunian), Academic (Laon), and Arts (Manama) — but points are
                    credited to the member's actual House affiliation, regardless of
                    which category the award falls under.
                  </p>
                  <p className="text-xs italic text-neutral-500">
                    — Article II, Section 2, Subsection 5
                  </p>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
