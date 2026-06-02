export default function AmendmentsPage() {
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
              Rules &amp; Procedures — Article IX + Constitution Art. 13
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Amendment &amp; Review Procedures
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Rules and Procedures (The Blue Book) serve as the comprehensive operations manual of the Society. To ensure these operational guidelines evolve responsively while preserving constitutional supremacy, Article IX establishes unified procedures for proposing, deliberating, ratifying, and implementing amendments.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article IX, Section 1
            </p>
          </article>

          {/* Who May Propose */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-white">Who May Propose</h2>
              <p className="text-sm italic text-neutral-500">— Article IX, Section 3(1)</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-neutral-900 p-5">
                <h3 className="text-sm font-semibold text-white">The High Council President</h3>
                <p className="mt-2 text-xs text-neutral-400">May propose amendments directly to the Executive Secretary.</p>
              </div>
              <div className="rounded-2xl bg-neutral-900 p-5">
                <h3 className="text-sm font-semibold text-white">Council of House Chancellors</h3>
                <p className="mt-2 text-xs text-neutral-400">May propose amendments by majority vote of the Council.</p>
              </div>
              <div className="rounded-2xl bg-neutral-900 p-5">
                <h3 className="text-sm font-semibold text-white">Member Petition</h3>
                <p className="mt-2 text-xs text-neutral-400">A petition signed by at least 25% of active Society members.</p>
              </div>
              <div className="rounded-2xl bg-neutral-900 p-5">
                <h3 className="text-sm font-semibold text-white">House Council Resolution</h3>
                <p className="mt-2 text-xs text-neutral-400">A resolution from any House Council, endorsed by its House Chancellor.</p>
              </div>
            </div>
          </article>

          {/* Classification of Amendments */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-white">Classification of Amendments</h2>
              <p className="text-sm italic text-neutral-500">— Article IX, Section 2</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-900/40 bg-neutral-900/60 p-6">
                <h3 className="text-lg font-semibold text-blue-200">Procedural Amendments</h3>
                <p className="mt-2 text-sm text-neutral-400">Administrative and operational adjustments that do not alter binding rights or values.</p>
                <ul className="mt-3 space-y-1.5 text-xs text-neutral-400">
                  <li>• Administrative timelines &amp; deadlines</li>
                  <li>• Form templates &amp; ledger formats</li>
                  <li>• Internal workflows &amp; reporting frequencies</li>
                  <li>• Non-binding Annex updates</li>
                  <li>• Clarifications of language</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-purple-900/40 bg-neutral-900/60 p-6">
                <h3 className="text-lg font-semibold text-purple-200">Substantive Amendments</h3>
                <p className="mt-2 text-sm text-neutral-400">Changes that affect member rights, obligations, or competitive opportunities.</p>
                <ul className="mt-3 space-y-1.5 text-xs text-neutral-400">
                  <li>• Point values, penalties, or bonus structures</li>
                  <li>• Eligibility criteria &amp; selection processes</li>
                  <li>• Voting thresholds &amp; participation rights</li>
                  <li>• Financial limits &amp; prohibited acts</li>
                  <li>• Definitions of violations &amp; due process</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-neutral-500">
              The Council of House Chancellors makes an initial classification, subject to review by the General Meeting if petitioned.
            </p>
          </article>

          {/* Approval & Ratification Process */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-white">Approval &amp; Ratification Process</h2>
              <p className="text-sm italic text-neutral-500">— Article IX, Section 4</p>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-blue-900/30 bg-neutral-900/80 p-5">
                <h4 className="text-lg font-semibold text-blue-200 mb-3">Procedural Track</h4>
                <p className="text-sm text-neutral-300 mb-2">Requires a two-track approval process:</p>
                <ol className="space-y-1.5 text-sm text-neutral-400 list-decimal list-inside">
                  <li>Majority vote of the Council of House Chancellors</li>
                  <li>Concurrence of the High Council President</li>
                </ol>
                <p className="mt-3 text-xs text-neutral-500">Takes effect immediately or on a specified date upon approval.</p>
              </div>
              <div className="rounded-2xl border border-purple-900/30 bg-neutral-900/80 p-5">
                <h4 className="text-lg font-semibold text-purple-200 mb-3">Substantive Track</h4>
                <p className="text-sm text-neutral-300 mb-2">Requires full deliberative ratification:</p>
                <ol className="space-y-1.5 text-sm text-neutral-400 list-decimal list-inside">
                  <li>Majority vote of the Council of House Chancellors</li>
                  <li>Concurrence of the High Council President</li>
                  <li>Ratification by majority vote of active members in a Society Assembly Meeting via secret ballot</li>
                </ol>
                <p className="mt-3 text-xs text-neutral-500">Notice of the General Meeting must be distributed at least 72 hours in advance with the full text of the amendment.</p>
              </div>
            </div>
          </article>

          {/* Constitutional Consistency Review */}
          <article className="rounded-3xl border border-amber-900/40 bg-amber-950/30 p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-amber-400">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM10.5 7.5a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-1.5 0v-4.5Zm0 9a.75.75 0 0 1 1.5 0v.75a.75.75 0 0 1-1.5 0v-.75Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-amber-200">Constitutional Consistency Review</h3>
                <p className="mt-2 text-sm leading-6 text-amber-300/80">
                  Before any Substantive Amendment is submitted for ratification, the <strong className="text-white">High Tribunal</strong> may be requested by any House Chancellor or the President to issue an advisory opinion on whether the amendment is consistent with the Constitution.
                </p>
                <p className="mt-2 text-xs italic text-amber-500/80">
                  Such opinion shall be non-binding but shall be included in the materials presented to the General Meeting. (Article IX, Section 4(3))
                </p>
              </div>
            </div>
          </article>

          {/* Review Cycles */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-white">Review Cycles</h2>
              <p className="text-sm italic text-neutral-500">— Article IX, Section 6</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-neutral-900 p-5">
                <h4 className="text-lg font-semibold text-emerald-200 mb-2">Annual Review</h4>
                <p className="text-sm text-neutral-400">
                  Conducted at the end of the <strong className="text-white">Second Semester</strong> (following the House Cup awarding). Led by the Council of House Chancellors and High Council to assess effectiveness, fairness, constitutional alignment, and responsiveness to member feedback.
                </p>
              </div>
              <div className="rounded-2xl bg-neutral-900 p-5">
                <h4 className="text-lg font-semibold text-blue-200 mb-2">Mid-Year Check-In</h4>
                <p className="text-sm text-neutral-400">
                  An informal check-in at the end of the <strong className="text-white">First Semester</strong> to identify urgent issues requiring procedural adjustment. <span className="text-amber-300">Only Procedural Amendments</span> may be adopted during this period.
                </p>
              </div>
            </div>
          </article>

          {/* Sunset Provisions */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-white">Sunset Provisions for Pilot Measures</h2>
              <p className="text-sm italic text-neutral-500">— Article IX, Section 6(3)-(4)</p>
            </div>
            <p className="mt-4 text-center text-base leading-7 text-neutral-300">
              Any provision adopted as a pilot, experimental, or temporary measure must include a specific expiration date, which shall not exceed <strong className="text-white">two (2) academic years</strong>.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-neutral-700 bg-neutral-900/80 p-4">
                <h4 className="text-sm font-semibold text-white mb-2">Permanent Adoption</h4>
                <p className="text-xs text-neutral-400">Conversion to a permanent rule requires the full amendment process (Substantive or Procedural track).</p>
              </div>
              <div className="rounded-2xl border border-neutral-700 bg-neutral-900/80 p-4">
                <h4 className="text-sm font-semibold text-white mb-2">Extension Protocol</h4>
                <p className="text-xs text-neutral-400">May be extended for a single additional period (max 1 year) by COC majority vote and Presidential concurrence.</p>
              </div>
              <div className="rounded-2xl border border-neutral-700 bg-neutral-900/80 p-4">
                <h4 className="text-sm font-semibold text-white mb-2">Automatic Lapse</h4>
                <p className="text-xs text-neutral-400">If not extended or adopted, the provision automatically lapses and ceases to have force or effect.</p>
              </div>
            </div>
          </article>

          {/* Effectivity & Supremacy */}
          <article className="rounded-3xl border border-red-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-red-200">Effectivity, Transitory Provisions &amp; Constitutional Supremacy</h2>
              <p className="text-sm italic text-neutral-500">— Article IX, Section 7</p>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-neutral-900 p-5">
                <h4 className="text-base font-semibold text-white mb-2">Transitory Period</h4>
                <p className="text-sm text-neutral-400">Upon adoption of major amendments, a transition period of up to <strong className="text-white">thirty (30) days</strong> may be observed to allow for orientation, system setup, and training. Relaxed deadlines may be applied as specified.</p>
              </div>
              <div className="rounded-2xl border border-red-900/30 bg-red-950/20 p-5">
                <h4 className="text-base font-semibold text-red-200 mb-2">Constitutional Supremacy</h4>
                <p className="text-sm text-neutral-300">
                  In the event of any conflict between the Rules and Procedures and the Constitution of the BSU Debate Society, the <strong className="text-white">Constitution shall prevail</strong>. Any provision of these Rules found to be inconsistent with the Constitution shall be deemed null and void to the extent of the inconsistency, without affecting the validity of the remaining provisions.
                </p>
              </div>
            </div>
          </article>

          {/* Constitution Note */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-sm shadow-black/20">
            <div className="mx-auto max-w-3xl space-y-2 text-center">
              <p className="text-sm leading-6 text-neutral-400">
                Amendments to the <strong className="text-white">Constitution itself</strong> (The Red Book) require a distinct process. Any member or officer may request a revision, which is subject to deliberation among officers and carried by a majority vote in a general meeting. No amendment to the Rules and Procedures may supersede or contradict the Constitution.
              </p>
              <p className="text-xs italic text-neutral-500">
                — Constitution, Article 13
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <a
                  href="/documents"
                  className="inline-flex items-center justify-center rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                >
                  Back to Governing Documents
                </a>
                <a
                  href="/documents/constitution"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-300 transition hover:text-white hover:border-neutral-500"
                >
                  Read the Constitution
                </a>
              </div>
            </div>
          </article>

        </div>
      </section>
    </div>
  );
}