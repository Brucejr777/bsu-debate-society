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
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Governing Documents
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Debate Society is governed by two foundational documents that together
              define its identity, structure, operations, and the rights of every member.
              These documents are the supreme authority of the organization and bind all
              Houses, Councils, and individual members.
            </p>
          </article>

          {/* Document Cards */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* The Constitution */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-neutral-300"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.502 3.422a4.164 4.164 0 0 1 2.943-1.219h4.11a4.164 4.164 0 0 1 2.943 1.219l4.282 4.283a4.164 4.164 0 0 1 1.219 2.942v4.11a4.164 4.164 0 0 1-1.219 2.943l-4.282 4.282a4.164 4.164 0 0 1-2.943 1.219h-4.11a4.164 4.164 0 0 1-2.943-1.219L3.22 17.7a4.164 4.164 0 0 1-1.219-2.943v-4.11c0-1.104.439-2.163 1.219-2.943l4.282-4.282Zm4.055 1.369a.664.664 0 0 0-.469.195L6.97 9.104a.664.664 0 0 0-.195.469v4.854c0 .176.07.346.195.47l4.118 4.118c.124.124.293.194.47.194h4.854c.176 0 .345-.07.47-.194l4.117-4.118c.125-.124.195-.293.195-.47V9.573a.664.664 0 0 0-.195-.47L16.887 4.986a.664.664 0 0 0-.47-.195h-4.854ZM9 11.5a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1Zm-1-5a1 1 0 0 1 1-1h6a1 1 0 0 1 0 2H9a1 1 0 0 1-1-1Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      The Constitution
                    </h2>
                    <p className="text-sm text-neutral-500">
                      11 Articles &bull; Supreme Law
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-neutral-300">
                  The Constitution is the supreme governing document of the BSU Debate
                  Society. It establishes the organization's name, vision, mission, and
                  core principles; enshrines the rights of all members; defines the
                  structure and authority of the four Society Houses (Bathala, Kabunian,
                  Laon, Manama); and creates the three branches of governance — the High
                  Council (executive), the Council of House Chancellors (legislative), and
                  the High Tribunal (judicial). It also governs membership, disciplinary
                  processes, and amendment procedures.
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
                  href="#"
                  className="inline-flex w-full items-center justify-center rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                >
                  Read Full Text
                </a>
              </div>
            </article>

            {/* Rules and Procedures */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-neutral-300"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-1.742 0-3.408.052-5.016.152a26.109 26.109 0 0 0-4.132.479 9.47 9.47 0 0 0-.564.129c-.18.05-.4.137-.595.31a4.659 4.659 0 0 0-.795 5.067 25.841 25.841 0 0 1-.44 10.823 4.642 4.642 0 0 0 .654 1.187c.13.172.34.312.527.386.087.033.278.093.56.157a25.782 25.782 0 0 0 9.804 0c.282-.064.474-.124.56-.157a.881.881 0 0 0 .528-.386 4.639 4.639 0 0 0 .653-1.187 25.841 25.841 0 0 0-.44-10.823 4.659 4.659 0 0 0-.795-5.067 1.123 1.123 0 0 0-.595-.31 9.457 9.457 0 0 0-.564-.129 26.115 26.115 0 0 0-4.132-.479A80.555 80.555 0 0 0 12 2.25Zm-2.889 14.4a.75.75 0 0 0 1.278-.614l-2.12-5.065a.75.75 0 0 0-1.278.614l2.12 5.065Zm4.016-5.065a.75.75 0 0 1 1.278.614L12.285 17.26a.75.75 0 0 1-1.278-.614l2.12-5.065Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      Rules and Procedures
                    </h2>
                    <p className="text-sm text-neutral-500">
                      9 Articles &amp; Annexes &bull; Operational Framework
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-neutral-300">
                  The Rules and Procedures document provides the detailed operational
                  mechanisms that bring the Constitution to life. It establishes the House
                  Point System for constructive competition, the Individual Recognition
                  Framework, the Inter-House Debate Cup and League, financial and resource
                  protocols, disciplinary and appeals procedures, the Presidential Conclave
                  election process, records management policies, and the framework for
                  amending the Rules themselves. It contains 9 Articles plus Annexes.
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
                  href="#"
                  className="inline-flex w-full items-center justify-center rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                >
                  Read Full Text
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
                The Rules and Procedures reference several Annexes that provide detailed
                criteria, templates, and forms used in Society operations, including
                Debate Performance Criteria, Point Transaction Forms, Accomplishment
                Report templates, and Appeal Forms. These Annexes are maintained by the
                Office of the Executive Secretary and are available upon request.
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
