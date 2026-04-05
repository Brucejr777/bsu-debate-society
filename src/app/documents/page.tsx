export default function DocumentsPage() {
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
              Official Governing Documents
            </p>
            <h1 className="inline-block rounded-lg bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Governing Documents
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Debate Society is governed by two foundational documents — the Red Book
              and the Blue Book — enacted under Article 9, Section 2 of the Constitution
              by the Council of House Chancellors. Together they define the ethical
              framework, operational mechanics, and the rights and duties of every member.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Constitution, Article 9, Section 2
            </p>
          </article>

          {/* Document Cards */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* The Red Book (Constitution) */}
            <article className="rounded-3xl border border-red-900/60 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-900/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-red-300"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 .75a8.25 8.25 0 0 0-4.76 15.009c.528.346.906.872 1.04 1.483l.36 1.64a.75.75 0 0 0 1.278.369l.768-.914a19.803 19.803 0 0 0 1.314 0l.769.914a.75.75 0 0 0 1.277-.369l.36-1.64c.134-.612.512-1.137 1.04-1.484A8.25 8.25 0 0 0 12 .75ZM10.643 19.513a.75.75 0 0 0-.303.138L9.28 20.917l-.223-1.017a.75.75 0 0 0-.33-.48 6.752 6.752 0 1 1 7.146 0 .75.75 0 0 0-.33.48l-.223 1.017-1.06-1.266a.75.75 0 0 0-.303-.138 18.313 18.313 0 0 1-2.378 0ZM13.125 12a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0ZM12 10.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-red-200">
                      The Red Book
                    </h2>
                    <p className="text-sm text-neutral-500">
                      The Constitution &bull; Ethical Framework — Art. 9, Sec. 2(b)
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-neutral-300">
                  The Red Book — the Constitution of the BSU Debate Society — is the
                  supreme governing document and binding ethical framework of the
                  organization. It establishes the Society&apos;s name, vision, mission,
                  and Declaration of Principles; enshrines the rights of all members;
                  translates the virtues of Leadership, Truth, Scholarship, and the Arts
                  into the foundational identity of the Four Houses; and creates the three
                  branches of governance — the High Council (executive), the Council of
                  House Chancellors (legislative), and the High Tribunal (judicial).
                </p>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Key Articles
                  </p>
                  <ul className="space-y-1.5 text-sm text-neutral-400">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Articles 1–3: Organization, Vision &amp; Mission, Declaration of Principles
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Articles 4–5: Rights and Membership
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Articles 6–7: The Society Houses and House Councils
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article 8: The High Council
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article 9: The Council of House Chancellors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article 10: The High Tribunal
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article 11: Amendments and Ratification
                    </li>
                  </ul>
                </div>

                <a
                  href="/documents/constitution"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Read Full Text
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
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

            {/* The Blue Book (Rules and Procedures) */}
            <article className="rounded-3xl border border-blue-900/60 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-900/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-blue-300"
                    >
                      <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.237 8.237 0 0 0 18 18.75c1.115 0 2.18.21 3.16.592a.75.75 0 0 0 .59-.707V4.257a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-blue-200">
                      The Blue Book
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Rules &amp; Procedures &bull; Operations Manual — Art. 9, Sec. 2(a)
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-neutral-300">
                  The Blue Book — the Rules and Procedures — is the comprehensive
                  operations manual of the Society, enacted under Article 9, Section 2(a)
                  of the Constitution. It provides the detailed operational mechanisms that
                  bring the Constitution to life: the House Point System, the Individual
                  Recognition Framework, the Debate League and Inter-House Cup, financial
                  and resource protocols, disciplinary and appeals procedures, the
                  Presidential Conclave, records management, and the framework for amending
                  the Rules themselves.
                </p>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Key Articles
                  </p>
                  <ul className="space-y-1.5 text-sm text-neutral-400">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article I: House Point System
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article II: Individual Recognition Framework
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article III: Debate League &amp; Competitions
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article IV: Financial Protocols
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article V: Disciplinary &amp; Appeals Procedures
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article VII: The Presidential Conclave
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Article VIII: Records Management
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                      Annexes: Debate Performance Criteria &amp; Templates
                    </li>
                  </ul>
                </div>

                <a
                  href="/documents/rules"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Read Full Text
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
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

          {/* Additional Resources */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="text-2xl font-semibold text-white">
                Additional Resources
              </h2>
              <p className="text-base leading-7 text-neutral-300">
                The Blue Book references several Annexes that provide detailed criteria,
                templates, and forms used in Society operations, including Debate
                Performance Criteria, Point Transaction Forms, Accomplishment Report
                templates, and Appeal Forms. These Annexes are maintained by the Office of
                the Executive Secretary and are available upon request.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-neutral-900 p-5 shadow-sm shadow-black/20">
                  <h3 className="text-sm font-semibold text-white">
                    Debate Performance Criteria
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Scoring rubrics and speaker evaluation standards for all debate formats.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5 shadow-sm shadow-black/20">
                  <h3 className="text-sm font-semibold text-white">
                    Point Transaction Forms
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Standardized forms for submitting Accomplishment Reports and claiming House Points.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5 shadow-sm shadow-black/20">
                  <h3 className="text-sm font-semibold text-white">
                    Appeal Forms
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Templates for filing constitutional appeals through the Council of House Chancellors.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
