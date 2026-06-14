export default function AIUsagePolicyPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back Navigation */}
          <div>
            <a
              href="/documents"
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
              Back to Documents
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Constitution, Article 3, Section 11
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              AI Usage Policy
            </h1>
          </div>

          {/* Core Principle */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Society shall uphold the responsible and ethical integration of emerging technologies, including artificial intelligence, into debate preparation, research, and administrative operations. The Society recognizes that technological advancement must serve the pursuit of truth and intellectual integrity, not circumvent them.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Constitution, Article 3, Section 11
            </p>
          </article>

          {/* Key Guidelines */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white">Transparency & Attribution</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                All members and officers must ensure that technological tools are employed transparently. Any AI-generated or AI-assisted content must be properly attributed, clearly distinguishing between human-authored and machine-assisted work.
              </p>
            </article>
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white">Academic Standards</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                The use of AI must remain in strict compliance with academic standards and university policies. It is a tool to enhance, not replace, critical thinking, research, and the authentic development of debate skills.
              </p>
            </article>
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white">Intellectual Property</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                Technological practices shall not infringe upon the intellectual property rights or academic freedoms guaranteed to members under Article 4 of the Constitution. Members retain moral rights to their original creations.
              </p>
            </article>
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white">Stewardship of Knowledge</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                By honoring the Pillar of Kabunian, members are called to responsibly steward knowledge, ensuring that AI serves as a catalyst for intellectual rigor rather than a shortcut that compromises the authenticity of discourse.
              </p>
            </article>
          </div>

          {/* Disclosure Requirement */}
          <article className="rounded-3xl border border-amber-900/40 bg-amber-950/20 p-8 shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 text-amber-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-amber-200">
                  Mandatory AI Disclosure
                </h3>
                <p className="text-sm leading-6 text-amber-300/80">
                  For all competition submissions, case briefs, and research packages, members must complete the{" "}
                  <strong className="text-white">AI-Assisted Case & Research Disclosure Template</strong>. 
                  This ensures that all AI tool usage is documented, including the purpose of use and human verification of the output.
                </p>
                <p className="text-xs italic text-amber-500/80">
                  — Rules and Procedures, Annex B, Section 3
                </p>
                <a
                  href="/documents/templates"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-amber-300 underline underline-offset-4 transition hover:text-white"
                >
                  View Operational Compliance Templates
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
            </div>
          </article>

          {/* Footer Note */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 text-center">
            <p className="text-sm leading-6 text-neutral-400">
              This policy is subject to periodic review to adapt to emerging technological advancements while preserving the core values of the Society. Any questions regarding acceptable AI use should be directed to the Office of Internal Affairs or the High Council.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}