export default function GovernancePage() {
  const highCouncilOffices = [
    {
      title: "Office of the President",
      role: "Chief Executive",
      description:
        "Serves as the primary head of the Society, presides over all High Council sessions, exercises veto power over Council resolutions, appoints Secretaries, and represents the Society in all external and university-level engagements.",
    },
    {
      title: "Office of the Vice President",
      role: "Chief Coordinator",
      description:
        "The second-highest executive officer who presides over the Council of House Chancellors, monitors House affairs for constitutional compliance, and spearheads Society-wide projects requiring joint participation of all Four Houses.",
    },
    {
      title: "Office of the Executive Secretary",
      role: "Central Administrative Hub",
      description:
        "Serves as the guardian of the Constitution and the Great Seal, drafts minutes of all High Council and Supreme Council sessions, maintains the Book of Policies, and certifies official documents and membership statuses.",
    },
    {
      title: "Office of Internal Affairs",
      role: "Welfare & Ethics",
      description:
        "Maintains the Society membership registry, investigates misconduct, designs holistic well-being programs, and coordinates the assignment and tracking of Executive Interns across all Offices.",
    },
    {
      title: "Office of External Affairs",
      role: "Diplomatic Liaison",
      description:
        "Serves as the bridge between the Society and external entities, negotiates partnerships and MOAs, solicits grants and sponsorships, and manages the Society's presence on national and international debating circuits.",
    },
    {
      title: "Office of Financial and Resource Affairs",
      role: "Fiscal Integrity",
      description:
        "Oversees the fiscal integrity and resource management of the Society, prepares budgets, manages the General Fund, and ensures transparent financial reporting across all Houses.",
    },
    {
      title: "Office of Business Affairs",
      role: "Revenue Generation",
      description:
        "Drives income-generating projects, manages Society-wide merchandise operations, and develops entrepreneurial initiatives to ensure the financial sustainability of the organization.",
    },
    {
      title: "Office of Public Affairs",
      role: "Media & Information",
      description:
        "Manages official Society communications, social media presence, branding standards, and ensures all members and the public are well-informed of Society activities and official positions.",
    },
  ];

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
                Articles 8–10 — Society Governance
              </p>
              <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffec3a] via-[#ffd700] to-[#ffa100] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                Society Governance
              </h1>
            </div>

            {/* Introduction */}
            <article className="mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-base leading-7 text-neutral-300">
                The governance of the Debate Society is structured across three branches —
                executive, legislative, and judicial — ensuring a system of checks and balances
                that protects the rights of all members and the integrity of the Four Houses.
              </p>
            </article>

            {/* ── High Council ── */}
            <div className="space-y-6">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-semibold text-white">The High Council</h2>
                <p className="text-sm italic text-neutral-500">
                  — Constitution, Article 8 — The High Council
                </p>
              </div>
              <p className="mx-auto max-w-3xl text-center text-base leading-7 text-neutral-300">
                The High Council is the highest governing body of the BSU Debate Society. It
                has jurisdiction over the Society Houses, including the House Councils, ensuring
                they adhere to the Society's policies. Composed of elected and appointed officers,
                it serves as the executive branch of the organization.
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {highCouncilOffices.map((office) => (
                  <article
                    key={office.title}
                    className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-sm shadow-black/20"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {office.title}
                    </h3>
                    <span className="mt-2 inline-block rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      {office.role}
                    </span>
                    <p className="mt-3 text-sm leading-6 text-neutral-300">
                      {office.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* ── Council of House Chancellors ── */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white">
                    Council of House Chancellors
                  </h2>
                  <p className="text-sm italic text-neutral-500">
                    — Constitution, Article 9 — The Council of House Chancellors
                  </p>
                </div>
                <p className="text-base leading-7 text-neutral-300">
                  The Council of House Chancellors is the supreme legislative and representative
                  body of the Society. It is composed of the four House Chancellors — one from
                  each of the Four Houses — who serve as the primary custodians of their
                  respective House legacies and the voices of their constituents within the High
                  Council.
                </p>
                <p className="text-base leading-7 text-neutral-300">
                  The Vice President of the Society serves as the ex-officio Presiding Officer,
                  responsible for convening sessions, managing deliberations, and casting the
                  deciding vote in the event of a tie. The Council exercises unified powers
                  including enacting the Blue Book of operations, the Red Book of ethical
                  standards, drafting official Society positions on public issues, and lobbying
                  policy propositions to the University Administration.
                </p>
              </div>
            </article>

            {/* ── High Tribunal ── */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white">
                    The High Tribunal
                  </h2>
                  <p className="text-sm italic text-neutral-500">
                    — Constitution, Article 10 — The High Tribunal
                  </p>
                </div>
                <p className="text-base leading-7 text-neutral-300">
                  The judicial power of the Society is vested in the High Tribunal. It serves as
                  the court of original and final jurisdiction for all cases involving the
                  interpretation of the Constitution, grievances between Houses, and serious
                  breaches of the Red Book.
                </p>
                <p className="text-base leading-7 text-neutral-300">
                  The High Tribunal is composed of the President, who serves as the Presiding
                  Judge, and the four House Chancellors, who collectively serve as the Jury of
                  the Pillars. The President rules on procedural matters and ensures due process,
                  while the Chancellors deliberate and vote by majority to render verdicts.
                </p>
              </div>
            </article>

            {/* ── Presidential Conclave ── */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-sm shadow-black/20">
              <div className="mx-auto max-w-3xl space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold text-white">
                    The Presidential Conclave
                  </h2>
                  <p className="text-sm italic text-neutral-500">
                    — Rules and Procedures, Article VII
                  </p>
                </div>
                <p className="text-base leading-7 text-neutral-300">
                  The Society President is elected through a unique deliberative process known
                  as the Presidential Conclave. Composed exclusively of the four sitting House
                  Chancellors — each of whom is simultaneously a candidate — the Conclave
                  ensures that the President possesses the confidence and respect of House
                  leadership.
                </p>
                <p className="text-base leading-7 text-neutral-300">
                  The process includes platform presentations, structured interrogation rounds,
                  and a supermajority threshold before proceeding to election by secret ballot.
                  The outgoing President serves as Presiding Officer, while the Vice President
                  acts as Secretary — neither holds voting power. This system upholds the
                  Society's principles of reasoned dialogue, intellectual rigor, and constructive
                  competition.
                </p>
              </div>
            </article>
          </div>
        </section>
      </div>
  );
}
