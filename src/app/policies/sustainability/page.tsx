export default function SustainabilityPolicyPage() {
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
              Constitution, Article 3, Section 12
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#4ade80] via-[#22c55e] to-[#16a34a] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Environmental Sustainability Policy
            </h1>
          </div>

          {/* Core Principle */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Society shall integrate environmental sustainability into its procurement practices, event planning, and daily operations. Recognizing that intellectual discourse thrives within a healthy and resilient community, the Society shall prioritize eco-conscious resource allocation, minimize waste, and promote sustainable engagement with its physical and digital environments.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Constitution, Article 3, Section 12
            </p>
          </article>

          {/* Key Guidelines */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-emerald-400">
                    <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM5.35 4.35a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L5.35 5.41a.75.75 0 0 1 0-1.06Zm9.3 0a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-7 3a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 10Zm14 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM5.35 14.59a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm9.3 0a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM10 16a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 16Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Eco-Conscious Procurement</h3>
              </div>
              <p className="text-sm leading-6 text-neutral-300">
                Purchases exceeding <strong className="text-emerald-300">₱2,000</strong> require a Sustainability Impact Statement. Priority is given to suppliers utilizing recycled, biodegradable, or low-impact materials, and those offering responsible disposal or take-back programs.
              </p>
            </article>

            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-emerald-400">
                    <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v1.258a3.001 3.001 0 0 0-2.302 2.302H5.75a.75.75 0 0 0 0 1.5h1.198a3.001 3.001 0 0 0 2.302 2.302v1.198a.75.75 0 0 0 1.5 0v-1.198a3.001 3.001 0 0 0 2.302-2.302h1.198a.75.75 0 0 0 0-1.5h-1.198a3.001 3.001 0 0 0-2.302-2.302V2.75Z" />
                    <path fillRule="evenodd" d="M6 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Waste Minimization</h3>
              </div>
              <p className="text-sm leading-6 text-neutral-300">
                The Society actively minimizes waste in all physical and digital environments. Event planning prioritizes reusable materials, digital-first documentation, and the reduction of single-use plastics in alignment with the Pillar of Laon’s long-term stewardship.
              </p>
            </article>

            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-emerald-400">
                    <path fillRule="evenodd" d="M9.69 18.933a.75.75 0 0 0 1.12 0l4.5-4.5a.75.75 0 0 0-1.06-1.06L11 16.623V4a.75.75 0 0 0-1.5 0v12.623L6.25 13.373a.75.75 0 1 0-1.06 1.06l4.5 4.5Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Local & Regional Support</h3>
              </div>
              <p className="text-sm leading-6 text-neutral-300">
                When evaluating suppliers of comparable cost and quality, preference is given to options that source materials or labor from local Benguet communities or Philippine-based enterprises, reducing carbon footprint and supporting the local economy.
              </p>
            </article>

            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-emerald-400">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8.5V5.5a3 3 0 0 0-6 0V9.5h6Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Digital Sustainability</h3>
              </div>
              <p className="text-sm leading-6 text-neutral-300">
                The Society promotes sustainable engagement with its digital environments by optimizing digital asset storage, utilizing energy-efficient hosting practices where possible, and encouraging digital-first communication to reduce paper consumption.
              </p>
            </article>
          </div>

          {/* Exemption Provisions */}
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
                  Sustainability Impact Statement Exemptions
                </h3>
                <p className="text-sm leading-6 text-amber-300/80">
                  The requirement for a Sustainability Impact Statement (for purchases &gt;₱2,000) shall <strong className="text-white">not apply</strong> to:
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-amber-300/80 list-disc list-inside">
                  <li>Emergency procurements necessary to ensure member safety or continuity of essential operations.</li>
                  <li>Purchases where no sustainable alternative is reasonably available within the required timeframe or budget.</li>
                  <li>Items procured through University-mandated vendors or centralized procurement systems.</li>
                  <li>Expenditures below the Minor Disbursement threshold (≤₱500).</li>
                </ul>
                <p className="mt-3 text-xs italic text-amber-500/80">
                  — Rules and Procedures, Article V, Section 5(1)(d)(iii)
                </p>
              </div>
            </div>
          </article>

          {/* Footer Note */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 text-center">
            <p className="text-sm leading-6 text-neutral-400">
              This policy is subject to periodic review to adapt to emerging environmental best practices while preserving the core values of the Society. Sustainability considerations shall be weighed alongside cost, quality, and timeliness; no procurement shall be delayed or denied solely on sustainability grounds unless expressly required by Society policy or University regulation.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}