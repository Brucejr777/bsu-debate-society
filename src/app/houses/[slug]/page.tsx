import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { HOUSES, HOUSE_BY_SLUG, VALID_HOUSE_SLUGS, type HouseInfo } from "@/lib/houses";

export const dynamic = "force-dynamic";

interface LeagueMember {
  id: number;
  member_name: string;
  house: string;
  individual_points: number;
  semester: string;
  rank: number;
}

interface IndividualAward {
  id: number;
  member_name: string;
  house: string;
  award_category: string;
  tier: string;
  semester: string;
}

interface HousePointRow {
  id: number;
  house_name: string;
  total_points: number;
  competitive_excellence: number;
  organizational_contribution: number;
  governance_compliance: number;
  conduct_ethics: number;
  semester: string;
  created_at: string;
}

interface MembershipApplication {
  id: number;
  full_name: string;
  student_id: string;
  college: string;
  email: string;
  status: string;
  created_at: string;
}

export function generateStaticParams() {
  return VALID_HOUSE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const house = HOUSE_BY_SLUG[slug];
  if (!house) return { title: "House Not Found" };
  return {
    title: `${house.name} — BSU Debate Society`,
    description: house.description,
  };
}

const HOUSE_SHORT_NAME: Record<string, string> = {
  bathala: "Bathala",
  kabunian: "Kabunian",
  laon: "Laon",
  manama: "Manama",
};

const rankSuffix = (n: number) => {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
};

export default async function HousePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const house = HOUSE_BY_SLUG[slug];
  if (!house) notFound();

  const shortName = HOUSE_SHORT_NAME[slug] ?? slug;

  // Fetch all data in parallel
  const [
    { data: pointsData, error: pointsError },
    { data: membersData, error: membersError },
    { data: awardsData, error: awardsError },
  ] = await Promise.all([
    supabase
      .from("house_points")
      .select("*")
      .eq("house_name", house.name)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("debate_league_members")
      .select("*")
      .eq("house", shortName)
      .order("rank", { ascending: true }),
    supabase
      .from("individual_awards")
      .select("*")
      .eq("house", shortName)
      .order("created_at", { ascending: false }),
  ]);

  const latestPoints: HousePointRow | null = pointsData?.[0] ?? null;
  const members: LeagueMember[] = membersData ?? [];
  const awards: IndividualAward[] = awardsData ?? [];

  // Council structure per Constitution Article 7
  const councilPositions = [
    {
      office: "Office of the House Chancellor",
      title: "House Chancellor",
      selection: "Elected by House members",
      rank: "Head of the House Council",
      duties: [
        "Presides over all House Council meetings and House Assemblies",
        "Approves House Council Resolutions",
        "Exercises executive oversight over House programs and governance",
        "Represents the House in official Society-wide assemblies and external affairs",
        "May veto any House Council Resolution, subject to override by a two-thirds vote",
        "Member of the Council of House Chancellors",
      ],
    },
    {
      office: "Office of the House Vice Chancellor",
      title: "House Vice Chancellor",
      selection: "Elected by House members",
      rank: "Second-in-rank of the House Council",
      duties: [
        "Assists and substitutes for the Chancellor in their absence",
        "Oversees coordination between officers and monitors internal execution",
        "Assists the House Chancellor in preparing reports for the Council of House Chancellors",
      ],
    },
    {
      office: "Office of the Secretariat",
      title: "Secretariat Director",
      selection: "Appointed by the House Chancellor",
      rank: "Third-in-rank of the House Council",
      duties: [
        "Primary custodian of all House records",
        "Drafts official documents and records minutes for all House meetings",
        "Maintains systematic record of all House Council Resolutions",
        "Documents the House Chronicle — achievements, events, and milestones",
      ],
    },
    {
      office: "Office of Internal Affairs",
      title: "Director of Internal Affairs",
      selection: "Appointed by the House Chancellor",
      rank: "Director-level officer",
      duties: [
        "Enforces the House's internal code of conduct and values",
        "Maintains the official House Membership Database",
        "Acts as primary mediator in internal disputes",
        "Monitors member well-being and oversees mentorship programs",
        "Manages recruitment and selection of new members",
      ],
    },
    {
      office: "Office of External Affairs",
      title: "Director of External Affairs",
      selection: "Appointed by the House Chancellor",
      rank: "Director-level officer",
      duties: [
        "Primary liaison with other Houses and external entities",
        "Represents the House before the Council of House Chancellors",
        "Leads inter-House and Society-wide event coordination",
        "Establishes partnerships with external organizations",
      ],
    },
    {
      office: "Office of Financial and Resource Affairs",
      title: "Director of Financial and Resource Affairs",
      selection: "Appointed by the House Chancellor",
      rank: "Director-level officer",
      duties: [
        "Primary custodian of the House Treasury",
        "Maintains Inventory of House Assets",
        "Develops the semesterly House Budget",
        "Prepares and publishes financial and resource audits",
      ],
    },
    {
      office: "Office of Business Affairs",
      title: "Director of Business Affairs",
      selection: "Appointed by the House Chancellor",
      rank: "Director-level officer",
      duties: [
        "Spearheads Income-Generating Projects (IGPs)",
        "Manages official House merchandise production and sales",
        "Negotiates partnerships and sponsorships",
        "Prepares business plans and project proposals",
      ],
    },
    {
      office: "Office of Public Affairs",
      title: "Director of Public Affairs",
      selection: "Appointed by the House Chancellor",
      rank: "Director-level officer",
      duties: [
        "Manages all official House social media accounts",
        "Creates visual materials — posters, infographics, promotional videos",
        "Custodian of the House's brand identity",
        "Public information office for House activities and resolutions",
      ],
    },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back Navigation */}
          <div>
            <a
              href="/houses"
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
              Back to Houses
            </a>
          </div>

          {/* ── House Header ── */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Article 6 — The Society Houses
            </p>
            <div className="flex items-center justify-center gap-3">
              <div
                className="size-4 rounded-full"
                style={{ backgroundColor: house.color }}
              />
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {house.name}
              </h1>
            </div>
          </div>

          {/* House Description */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
                style={{ backgroundColor: house.color }}
              >
                {house.value}
              </span>
              <span className="text-xs uppercase tracking-widest text-neutral-500">
                Embodied Value
              </span>
            </div>
            <p className="text-base leading-7 text-neutral-300">{house.description}</p>
          </article>

          {/* ── House Points Snapshot ── */}
          {latestPoints && (
            <article className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div
                className="absolute left-0 top-0 h-full w-2"
                style={{ backgroundColor: house.color }}
              />
              <div className="pl-4">
                <div className="space-y-2 text-center">
                  <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                    Current Standing
                  </p>
                  <p className="text-5xl font-bold tabular-nums text-white sm:text-6xl">
                    {latestPoints.total_points.toLocaleString()}
                  </p>
                  <p className="text-sm text-neutral-500">points — {latestPoints.semester}</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl bg-neutral-900 p-3 text-center">
                    <p className="text-xs font-medium text-neutral-500">Competitive</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                      {latestPoints.competitive_excellence}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-3 text-center">
                    <p className="text-xs font-medium text-neutral-500">Organizational</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                      {latestPoints.organizational_contribution}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-3 text-center">
                    <p className="text-xs font-medium text-neutral-500">Governance</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                      {latestPoints.governance_compliance}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-3 text-center">
                    <p className="text-xs font-medium text-neutral-500">Conduct</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                      {latestPoints.conduct_ethics}
                    </p>
                  </div>
                </div>
                {pointsError && (
                  <p className="mt-4 text-center text-xs text-red-400">
                    Could not load points data.
                  </p>
                )}
              </div>
            </article>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* HOUSE COUNCIL                           */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-neutral-300"
                  >
                    <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.625 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 15.756a5.625 5.625 0 0 1 5.625-5.625h.375a.375.375 0 0 1 .375.375v1.5a.375.375 0 0 1-.375.375h-.375a3.375 3.375 0 0 0-3.375 3.375v.375a.375.375 0 0 1-.375.375H2.625a.375.375 0 0 1-.375-.375v-.375ZM12 15.756a5.625 5.625 0 0 1 5.625-5.625h.375a.375.375 0 0 1 .375.375v1.5a.375.375 0 0 1-.375.375h-.375a3.375 3.375 0 0 0-3.375 3.375v.375a.375.375 0 0 1-.375.375h-1.5a.375.375 0 0 1-.375-.375v-.375ZM17.625 15.756a5.625 5.625 0 0 1 5.625-5.625h.375a.375.375 0 0 1 .375.375v1.5a.375.375 0 0 1-.375.375h-.375a3.375 3.375 0 0 0-3.375 3.375v.375a.375.375 0 0 1-.375.375h-1.5a.375.375 0 0 1-.375-.375v-.375Z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold text-white">House Council</h2>
              </div>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 7 — The House Councils
              </p>
            </div>

            <article className="mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-base leading-7 text-neutral-300">
                Each House is governed by its own House Council, which serves as the highest
                governing body within the House. The House Council has full authority over the
                internal affairs of the House — including membership, programs, finances, and
                discipline — subject to the overarching Constitution and policies of the Society.
              </p>
            </article>

            {/* Council Positions */}
            <div className="space-y-4">
              {councilPositions.map((pos) => (
                <article
                  key={pos.office}
                  className="group relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20 transition-all duration-300"
                >
                  <div
                    className="absolute left-0 top-0 h-full w-1.5"
                    style={{ backgroundColor: house.color }}
                  />
                  <div className="pl-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{pos.office}</h3>
                      <p className="text-sm text-neutral-400">
                        {pos.title} · {pos.rank}
                      </p>
                    </div>
                    <span className="inline-block rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300">
                      {pos.selection}
                    </span>
                    <ul className="space-y-1 text-sm text-neutral-400">
                      {pos.duties.map((duty, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                          <span>{duty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* MEMBERSHIP POLICY                       */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
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
                <h2 className="text-3xl font-semibold text-white">Membership</h2>
              </div>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 5 — Membership
              </p>
            </div>

            {/* Membership Info Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20">
                <h3 className="text-lg font-semibold text-white">Eligibility</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-300">
                  Open to all students of Benguet State University, regardless of college,
                  degree program, gender, class, race, political affiliation, religious
                  belief, or any other personal background.
                </p>
                <p className="mt-2 text-xs italic text-neutral-500">
                  — Article 5, Section 1
                </p>
              </article>

              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20">
                <h3 className="text-lg font-semibold text-white">Admission</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-300">
                  Admission into {house.name} constitutes Provisional Membership in the
                  Society. All membership applications must be approved by a majority vote
                  of the House Council.
                </p>
                <p className="mt-2 text-xs italic text-neutral-500">
                  — Article 5, Sections 2 &amp; 3
                </p>
              </article>

              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20">
                <h3 className="text-lg font-semibold text-white">Full Membership</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-300">
                  Provisional members must complete one (1) academic year of service within
                  an Office of the High Council as an Executive Intern. Upon satisfactory
                  performance, the individual is elevated to Full Member status.
                </p>
                <p className="mt-2 text-xs italic text-neutral-500">
                  — Article 5, Section 2
                </p>
              </article>

              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20">
                <h3 className="text-lg font-semibold text-white">Renewal &amp; Transfer</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-300">
                  Membership is valid for one academic year and renewed with House Council
                  approval. Transfers between Houses may only occur during official transfer
                  periods with mutual consent of both Houses.
                </p>
                <p className="mt-2 text-xs italic text-neutral-500">
                  — Article 5, Sections 5 &amp; 6
                </p>
              </article>
            </div>

            {/* Apply CTA */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <h3 className="text-2xl font-semibold text-white">
                  Want to join {house.name}?
                </h3>
                <p className="text-base leading-7 text-neutral-300">
                  Submit your membership application and the House Council will review it.
                  All students of Benguet State University are welcome to apply.
                </p>
                <a
                  href="/apply"
                  className="inline-flex items-center justify-center rounded-full bg-neutral-100 px-8 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                >
                  Apply Now
                </a>
              </div>
            </article>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* LEAGUE MEMBERS                          */}
          {/* ═══════════════════════════════════════ */}
          {members.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-semibold text-white">League Members</h2>
                <p className="text-sm italic text-neutral-500">
                  — Debate League Rankings
                </p>
              </div>

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
                        <th className="px-6 py-4 text-right font-medium uppercase tracking-wider">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr
                          key={m.id}
                          className="border-b border-neutral-800/50 transition hover:bg-neutral-900/50"
                        >
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex size-8 items-center justify-center rounded-lg font-bold tabular-nums text-white"
                              style={{ backgroundColor: house.color }}
                            >
                              {m.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-white">
                            {m.member_name}
                          </td>
                          <td className="px-6 py-4 text-right font-semibold tabular-nums text-white">
                            {m.individual_points.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 p-4 sm:hidden">
                  {members.map((m) => (
                    <article
                      key={m.id}
                      className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex size-9 items-center justify-center rounded-lg text-sm font-bold text-white"
                            style={{ backgroundColor: house.color }}
                          >
                            {m.rank}
                            {rankSuffix(m.rank)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{m.member_name}</p>
                            <p className="text-xs text-neutral-500">{m.semester}</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold tabular-nums text-white">
                          {m.individual_points.toLocaleString()}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* INDIVIDUAL AWARDS                       */}
          {/* ═══════════════════════════════════════ */}
          {awards.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-semibold text-white">Awards &amp; Recognition</h2>
                <p className="text-sm italic text-neutral-500">
                  — Individual Recognition Framework
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {awards.map((award) => {
                  const tierStyles: Record<string, string> = {
                    "Society Fellow": "bg-amber-900/60 text-amber-300 ring-amber-700",
                    "Distinguished Member": "bg-purple-900/60 text-purple-300 ring-purple-700",
                    "Emerging Contributor": "bg-neutral-800 text-neutral-300 ring-neutral-600",
                  };
                  const badgeStyle =
                    tierStyles[award.tier] ??
                    "bg-neutral-800 text-neutral-300 ring-neutral-600";

                  return (
                    <article
                      key={award.id}
                      className="group relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-1.5"
                        style={{ backgroundColor: house.color }}
                      />
                      <div className="space-y-4 pl-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {award.member_name}
                          </h3>
                          <p className="text-sm text-neutral-500">{award.semester}</p>
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
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* HOUSE CHRONICLE / HOUSE AUTHORITY       */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
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
                <h2 className="text-3xl font-semibold text-white">House Chronicle</h2>
              </div>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 7, Section 2(g)
              </p>
            </div>

            <article className="mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-base leading-7 text-neutral-300">
                The House Chronicle is the official record of {house.name}&apos;s
                achievements, programs, and historical milestones. It is maintained by the
                Office of the Secretariat and serves as the authoritative documentation of
                the House&apos;s contributions to the Society.
              </p>
              <p className="text-base leading-7 text-neutral-300">
                The House Council is responsible for maintaining the integrity of the
                House&apos;s motto, emblem, color, and cultural identity, promoting a sense
                of pride, continuity, and historical awareness among all members.
              </p>
            </article>

            {/* House Authority / Autonomy */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <h3 className="text-2xl font-semibold text-white">House Autonomy</h3>
                <p className="text-base leading-7 text-neutral-300">
                  {house.name} maintains autonomy over its membership policies, internal
                  structure, traditions, and activities — so long as they remain consistent
                  with the Constitution and Policies of the Society. All official House
                  policies are enacted through formal House Council Resolutions, requiring
                  the concurrence of a majority of sitting Council members and the approval
                  of the House Chancellor.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Constitution, Article 6, Section 2 &amp; Article 7, Section 1
                </p>
              </div>
            </article>
          </div>

          {/* ── Navigation to Other Houses ── */}
          <div className="space-y-4">
            <h2 className="text-center text-2xl font-semibold text-white">Other Houses</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {HOUSES.filter((h) => h.slug !== slug).map((h) => (
                <a
                  key={h.slug}
                  href={`/houses/${h.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:scale-[1.03]"
                >
                  <div
                    className="absolute left-0 top-0 h-full w-1.5"
                    style={{ backgroundColor: h.color }}
                  />
                  <div className="space-y-2 pl-3">
                    <h3 className="text-sm font-semibold text-white">{h.name}</h3>
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                      style={{ backgroundColor: h.color }}
                    >
                      {h.value}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
