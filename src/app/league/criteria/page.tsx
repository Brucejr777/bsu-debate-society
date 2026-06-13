// src/app/league/criteria/page.tsx
export default function LeagueCriteriaPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-12">
          {/* Back Navigation */}
          <div>
            <a
              href="/league"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
              </svg>
              Back to Debate League
            </a>
          </div>
          
          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Rules &amp; Procedures — Annex A
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Debate Performance Criteria
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-neutral-300">
              This Annex establishes the specific criteria and point values for earning Individual Debate Points under Article III (The Debate League). These points determine eligibility for Debate League membership and are tracked separately from House Points and Individual Recognition Awards.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article III, Section 2(2) & Annex A
            </p>
          </div>

          {/* 1. SOCIETY & HOUSE-WIDE DEBATES */}
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-white">Society &amp; House-Wide Debates</h2>
              <p className="text-sm italic text-neutral-500">— Annex A, Section 3(A)</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div className="rounded-2xl bg-neutral-900 p-5 text-center shadow-sm shadow-black/20">
                <p className="text-2xl font-bold text-emerald-400">+15</p>
                <p className="mt-1 text-xs text-neutral-400">Match Win</p>
              </div>
              <div className="rounded-2xl bg-neutral-900 p-5 text-center shadow-sm shadow-black/20">
                <p className="text-2xl font-bold text-neutral-300">+7</p>
                <p className="mt-1 text-xs text-neutral-400">Match Draw</p>
              </div>
              <div className="rounded-2xl bg-neutral-900 p-5 text-center shadow-sm shadow-black/20">
                <p className="text-2xl font-bold text-neutral-400">+3</p>
                <p className="mt-1 text-xs text-neutral-400">Participation</p>
              </div>
              <div className="rounded-2xl bg-neutral-900 p-5 text-center shadow-sm shadow-black/20">
                <p className="text-2xl font-bold text-amber-400">+10</p>
                <p className="mt-1 text-xs text-neutral-400">Best Speaker</p>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-2xl bg-neutral-900 p-5 text-center shadow-sm shadow-black/20">
                <p className="text-2xl font-bold text-purple-400">+5</p>
                <p className="mt-1 text-xs text-neutral-400">Top 3 Speaker</p>
              </div>
            </div>
          </div>

          {/* 2. EXTERNAL COMPETITIONS */}
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-white">External Competitions</h2>
              <p className="text-sm italic text-neutral-500">— Annex A, Section 3(B)</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 shadow-sm shadow-black/20">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900 text-neutral-400">
                    <th className="px-4 py-3 font-medium uppercase tracking-wider">Level</th>
                    <th className="px-4 py-3 text-center font-medium uppercase tracking-wider">Champion / 1st</th>
                    <th className="px-4 py-3 text-center font-medium uppercase tracking-wider">Finalist / Semi</th>
                    <th className="px-4 py-3 text-center font-medium uppercase tracking-wider">Participation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  <tr className="transition hover:bg-neutral-900/50">
                    <td className="px-4 py-4 font-medium text-white">International</td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-400">+50</td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-400">+40</td>
                    <td className="px-4 py-4 text-center font-bold text-neutral-300">+15</td>
                  </tr>
                  <tr className="transition hover:bg-neutral-900/50">
                    <td className="px-4 py-4 font-medium text-white">National</td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-400">+45</td>
                    <td className="px-4 py-4 text-center font-bold text-neutral-600">—</td>
                    <td className="px-4 py-4 text-center font-bold text-neutral-300">+12</td>
                  </tr>
                  <tr className="transition hover:bg-neutral-900/50">
                    <td className="px-4 py-4 font-medium text-white">Regional</td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-400">+35</td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-400">+25</td>
                    <td className="px-4 py-4 text-center font-bold text-neutral-300">+10</td>
                  </tr>
                  <tr className="transition hover:bg-neutral-900/50">
                    <td className="px-4 py-4 font-medium text-white">Local / Inter-School</td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-400">+25</td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-400">+18</td>
                    <td className="px-4 py-4 text-center font-bold text-neutral-300">+8</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. SPEAKER & INDIVIDUAL AWARDS */}
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-white">Speaker &amp; Individual Performance Awards</h2>
              <p className="text-sm italic text-neutral-500">— Annex A, Section 3(C)</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 text-center">
                <p className="text-2xl font-bold text-amber-300">+20</p>
                <p className="mt-1 text-xs text-amber-200/70">Best Speaker</p>
              </div>
              <div className="rounded-2xl border border-purple-900/40 bg-purple-950/20 p-5 text-center">
                <p className="text-2xl font-bold text-purple-300">+12</p>
                <p className="mt-1 text-xs text-purple-200/70">Top 3 Speaker (2nd/3rd)</p>
              </div>
              <div className="rounded-2xl border border-blue-900/40 bg-blue-950/20 p-5 text-center">
                <p className="text-2xl font-bold text-blue-300">+10</p>
                <p className="mt-1 text-xs text-blue-200/70">Best Rebuttal / Reply</p>
              </div>
              <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 text-center">
                <p className="text-2xl font-bold text-emerald-300">+10</p>
                <p className="mt-1 text-xs text-emerald-200/70">Best Case Construction</p>
              </div>
            </div>
          </div>

          {/* 4. ACCUMULATION RULES */}
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-white">Accumulation Rules</h2>
              <p className="text-sm italic text-neutral-500">— Annex A, Section 4</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm shadow-black/20">
                <h3 className="text-lg font-semibold text-white">Cumulative Tracking</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Individual Debate Points accumulate throughout the academic year. Points reset to zero (0) at the start of each new academic year to ensure fair semesterly selection for the Debate League.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm shadow-black/20">
                <h3 className="text-lg font-semibold text-white">Non-Stacking Provision</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  No single performance shall earn points under multiple categories for the same event. Points are awarded based on the highest applicable achievement for that specific activity.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm shadow-black/20">
                <h3 className="text-lg font-semibold text-white">Team vs. Individual Attribution</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  <strong className="text-neutral-200">Team-based awards</strong> grant points to each member of the team who actively participated. <strong className="text-neutral-200">Individual awards</strong> grant points solely to the recognized recipient.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm shadow-black/20">
                <h3 className="text-lg font-semibold text-white">Role-Based Eligibility</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Points are awarded only to members who actively debated or presented. Alternate debaters who did not speak receive <strong className="text-amber-300">50% of participation points</strong> only, provided their contribution to case preparation is documented by the team captain.
                </p>
              </div>
            </div>
          </div>

          {/* 5. DOCUMENTATION & VERIFICATION */}
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-white">Documentation &amp; Verification Process</h2>
              <p className="text-sm italic text-neutral-500">— Annex A, Section 5</p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-bold text-white">1</div>
                <div>
                  <h3 className="text-base font-semibold text-white">Submission (14-Day Window)</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-400">
                    Members must submit a <strong className="text-neutral-200">Point Claim Form</strong> to the Secretary of Internal Affairs within <strong className="text-white">fourteen (14) calendar days</strong> of the activity's completion, including official certificates, published results, or signed attendance sheets.
                  </p>
                  <a 
                    href="/claim-points" 
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-700"
                  >
                    Submit Point Claim Now
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-bold text-white">2</div>
                <div>
                  <h3 className="text-base font-semibold text-white">Verification (5 Business Days)</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-400">
                    The Secretary of Internal Affairs verifies claims within <strong className="text-white">five (5) business days</strong>. Insufficient documentation results in a request for amendment; failure to comply results in claim denial.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-bold text-white">3</div>
                <div>
                  <h3 className="text-base font-semibold text-white">Provisional Status (7-Day Period)</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-400">
                    Verified points are posted to the Ledger and marked <strong className="text-amber-300">Provisional Subject to Petition</strong> for <strong className="text-white">seven (7) calendar days</strong>. If no petition is filed, points become final and executory.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 6. DISPUTE RESOLUTION & PENALTIES */}
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-white">Dispute Resolution &amp; Penalties</h2>
              <p className="text-sm italic text-neutral-500">— Annex A, Section 6</p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Dispute Resolution */}
              <article className="rounded-2xl border border-blue-900/40 bg-blue-950/20 p-6">
                <h3 className="text-lg font-semibold text-blue-200">Adjudication Process</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-100/70">
                  <li className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-400" />
                    Petitions must cite specific grounds (e.g., insufficient docs, misclassification, non-participation).
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-400" />
                    Reviewed by the <strong className="text-white">High Tribunal</strong> (President as Presiding Judge; 3 uninvolved Chancellors vote).
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-400" />
                    A decision is rendered within <strong className="text-white">fourteen (14) calendar days</strong> and is final and executory.
                  </li>
                </ul>
              </article>
              {/* Penalties */}
              <article className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6">
                <h3 className="text-lg font-semibold text-red-200">Penalties for False Claims</h3>
                <p className="mt-2 text-sm leading-6 text-red-100/70">
                  If a Point Claim Form is found to contain knowingly false or materially inaccurate information:
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-red-100/70">
                  <li className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-400" />
                    The claimed points shall be <strong className="text-white">forfeited</strong>.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-400" />
                    A <strong className="text-white">penalty deduction</strong> equal to the claimed amount is applied to the member's tally.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-400" />
                    The matter may be referred to the Office of Internal Affairs for <strong className="text-white">disciplinary review</strong> under Article VI.
                  </li>
                </ul>
              </article>
            </div>
          </div>

          {/* Ready to Claim CTA */}
          <article className="rounded-3xl border border-emerald-900/40 bg-emerald-950/20 p-8 text-center shadow-lg">
            <div className="mx-auto max-w-3xl space-y-4">
              <h2 className="text-2xl font-semibold text-emerald-200">Ready to Claim Your Points?</h2>
              <p className="text-base leading-7 text-emerald-100/80">
                If you have participated in an eligible debate activity or competition, you can proactively submit your Individual Debate Point claim through our member-facing portal. Ensure you have your evidence links (e.g., certificates, published results) ready.
              </p>
              <a
                href="/claim-points"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-800 px-8 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-700"
              >
                Submit Point Claim
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </a>
              <p className="text-xs italic text-emerald-500/70">
                — Rules and Procedures, Annex A, Section 5
              </p>
            </div>
          </article>

          {/* Footer Note */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 text-center">
            <p className="text-sm leading-6 text-neutral-400">
              For the complete text of Annex A, including eligible activities and special provisions for hybrid tournaments, please refer to the official{" "}
              <a href="/documents/rules" className="font-medium text-white underline underline-offset-4 transition hover:text-neutral-200">
                Rules and Procedures
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}