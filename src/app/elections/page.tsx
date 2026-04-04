export default function ElectionsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 py-12">
      {/* Header */}
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
          Article VII — Rules & Procedures
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Presidential Conclave & Elections
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-400">
          The Society President is elected through a specialized deliberative body
          called the <span className="font-semibold text-neutral-200">Presidential Conclave</span> —
          not a general membership vote. This process ensures the President possesses
          the confidence, respect, and collaborative support of the House leadership.
        </p>
      </header>

      {/* Electors Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          The Electors
        </h2>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
          <p className="text-neutral-300">
            The Conclave is composed exclusively of the{" "}
            <span className="font-semibold text-white">four (4) sitting House Chancellors</span>.
            Each Chancellor holds <span className="font-semibold text-white">one (1) vote</span> and
            simultaneously serves as a{" "}
            <span className="font-semibold text-white">candidate for the Presidency</span>.
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            Article VII, Section 1(2) — Composition of Electors and Candidates
          </p>
        </div>
      </section>

      {/* Eligibility */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Eligibility Requirements
        </h2>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
          <p className="mb-6 text-neutral-300">
            Per <span className="font-medium text-neutral-200">Constitution Article 8, Section 2(3)</span>,
            a candidate for Society President must meet all of the following qualifications:
          </p>
          <ul className="space-y-3">
            {[
              {
                letter: "a",
                text: "Served at least one (1) full term as a Secretary or Vice President within the High Council, or as a House Chancellor, House Vice Chancellor, or Director within a House Council.",
              },
              {
                letter: "b",
                text: "Demonstrates mastery of the Society's Four Pillars: Manama, Bathala, Laon, and Kabunian.",
              },
              {
                letter: "c",
                text: "Has not been found guilty of any major disciplinary violations within the University or the Society.",
              },
              {
                letter: "d",
                text: "Has been a member of the Society for at least two (2) academic years, including the mandatory year served as a Provisional Member.",
              },
              {
                letter: "e",
                text: "Has not previously served as the President of the Society.",
              },
            ].map((item) => (
              <li key={item.letter} className="flex gap-3">
                <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-xs font-bold text-neutral-200">
                  {item.letter}
                </span>
                <span className="text-neutral-300">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          The Conclave Process
        </h2>
        <div className="space-y-0">
          {[
            {
              step: "1",
              title: "Platform Presentation",
              duration: "15 minutes per candidate",
              description:
                "Each Chancellor-candidate presents their platform, vision, and qualifications before the Conclave. Presentations are delivered in an order determined by drawing of lots. No interruptions or questions are permitted during this period.",
              citation: "Article VII, Section 3(1)",
            },
            {
              step: "2",
              title: "Interrogation Rounds",
              duration: "2 minutes per round",
              description:
                "One Chancellor serves as the Respondent while another serves as the Interrogator. The Interrogator has two (2) minutes to question the Respondent regarding their platform, judgment, or fitness for office. The cycle rotates through all four Chancellors to ensure equitable questioning.",
              citation: "Article VII, Section 3(2)",
            },
            {
              step: "3",
              title: "Proceed Vote",
              duration: "Supermajority required: 3 of 4",
              description:
                "Following interrogation and deliberation, the Conclave votes on whether to proceed to the Election by Secret Ballot. At least three (3) of the four (4) House Chancellors must vote affirmatively. If the motion fails, another round of interrogation is conducted.",
              citation: "Article VII, Section 4(2)",
            },
            {
              step: "4",
              title: "Secret Ballot Election",
              duration: "Simple majority: 2 of 4",
              description:
                "Upon a successful Proceed Vote, blank ballots are distributed. Each Chancellor writes their preferred candidate. A candidate must secure at least two (2) affirmative votes to be elected Society President. If no candidate meets the threshold, the Conclave returns to interrogation for another cycle.",
              citation: "Article VII, Section 5(3)",
            },
          ].map((item, i) => (
            <div key={item.step} className="flex gap-6">
              {/* Timeline line and dot */}
              <div className="relative flex flex-col items-center">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-neutral-600 bg-neutral-800 text-sm font-bold text-white">
                  {item.step}
                </div>
                {i < 3 && (
                  <div className="w-px flex-1 bg-neutral-700" />
                )}
              </div>
              {/* Content */}
              <div className="space-y-2 pb-10">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
                    {item.duration}
                  </span>
                </div>
                <p className="text-neutral-400">{item.description}</p>
                <p className="text-xs text-neutral-600">{item.citation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Oversight & Roles */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Oversight & Key Roles
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              role: "Presiding Officer",
              holder: "Outgoing Society President",
              duties: [
                "Oversees the flow of proceedings and enforces time limits",
                "Ensures adherence to interrogation and voting protocols",
                "Maintains order and decorum during deliberations",
                "Certifies the final vote count and proclamation",
              ],
              note: "Shall not vote, interrogate, participate in deliberations, or intervene in deadlocks.",
            },
            {
              role: "Secretary of the Conclave",
              holder: "Society Vice President",
              duties: [
                "Distributes and collects ballots",
                "Records vote tallies and procedural milestones",
                "Serves as the official timekeeper",
                "Certifies results and issues the formal Proclamation of Election",
              ],
              note: "Shall not possess voting rights or tie-breaking authority.",
            },
          ].map((card) => (
            <div
              key={card.role}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6"
            >
              <h3 className="text-lg font-semibold text-white">{card.role}</h3>
              <p className="mt-1 text-sm text-neutral-500">{card.holder}</p>
              <ul className="mt-4 space-y-2">
                {card.duties.map((duty) => (
                  <li key={duty} className="flex gap-2 text-sm text-neutral-400">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                    {duty}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs italic text-neutral-600">{card.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Schedule
        </h2>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
          <p className="text-neutral-300">
            The Presidential Conclave is held{" "}
            <span className="font-semibold text-white">annually during the finals period of the Second Semester</span>,
            as determined by the Benguet State University academic calendar. The High Council
            issues a formal Notice of Conclave at least{" "}
            <span className="font-semibold text-white">fourteen (14) days</span> prior to the
            scheduled date, specifying the venue, start time, and procedural reminders.
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            Article VII, Section 1(5) — Schedule of the Conclave
          </p>
          <div className="mt-6 rounded-xl border border-neutral-700 bg-neutral-800/50 p-4">
            <p className="text-sm text-neutral-400">
              <span className="font-medium text-neutral-200">Maximum Duration:</span>{" "}
              The Conclave shall not exceed <span className="font-semibold text-white">four (4) hours</span>,
              including all platform presentations, interrogation rounds, deliberation periods,
              voting procedures, and formal announcements.
            </p>
          </div>
        </div>
      </section>

      {/* Proclamation */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Proclamation
        </h2>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
          <p className="mb-4 text-neutral-300">
            Upon a successful election, the Presiding Officer strikes the gavel three (3) times.
            The Vice President then steps forward to announce the result using the formal protocol:
          </p>
          <blockquote className="rounded-xl border border-neutral-700 bg-neutral-800/50 px-6 py-4 italic text-neutral-300">
            <p className="mb-2">
              &ldquo;Members of the Debate Society, the Presidential Conclave has concluded.&rdquo;
            </p>
            <p className="mb-2 text-lg font-semibold text-white">
              &ldquo;Habemus Praesidem.&rdquo;
            </p>
            <p>
              &ldquo;By the authority vested in the Council of House Chancellors and under the
              Constitution and the Rules and Procedures of the Benguet State University — Debate
              Society, I proclaim the election of [Name] of the House of [House] as the next
              President of the Society.&rdquo;
            </p>
          </blockquote>
          <p className="mt-4 text-sm text-neutral-500">
            Article VII, Section 7 — Proclamation and Announcement
          </p>
        </div>
      </section>

      {/* Historical Note */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Historical Note: The Founding President
        </h2>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
          <p className="text-neutral-300">
            The term <span className="font-semibold text-white">&ldquo;Founding President&rdquo;</span> refers
            to the first individual to hold the office of Society President upon the ratification
            of the Constitution and Rules and Procedures that established the Four-House
            structure, the Presidential Conclave election system, and the High Council framework.
          </p>
          <p className="mt-4 text-neutral-300">
            Under the transitory provisions of{" "}
            <span className="font-medium text-neutral-200">Article VII, Section 11</span>, the High
            Council may, by Resolution, authorize:
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2 text-neutral-400">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
              Extension of the Founding President&apos;s term for one (1) additional academic year
            </li>
            <li className="flex gap-2 text-neutral-400">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
              Deferral of the Presidential Conclave for the academic year immediately following
              the Founding President&apos;s first term
            </li>
          </ul>
          <p className="mt-4 text-sm text-neutral-500">
            This designation is unique to the individual who first assumes office under this
            framework and shall not be transferable, inheritable, or applicable to any subsequent
            Society President.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 text-center">
        <p className="text-lg text-neutral-400">
          For the complete text of Article VII, refer to the{" "}
          <a
            href="/documents"
            className="font-medium text-white underline underline-offset-4 transition hover:text-neutral-200"
          >
            Rules and Procedures
          </a>{" "}
          or visit the{" "}
          <a
            href="/governance"
            className="font-medium text-white underline underline-offset-4 transition hover:text-neutral-200"
          >
            Governance
          </a>{" "}
          page for an overview of the Society&apos;s structure.
        </p>
      </div>
    </div>
  );
}
