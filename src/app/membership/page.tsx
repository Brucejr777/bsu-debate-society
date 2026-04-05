import { HOUSES, HOUSE_COLORS, HOUSE_LABELS } from "@/lib/houses";

export default function MembershipPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back */}
          <div>
            <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
              </svg>
              Back to Home
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Constitution — Article 5
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#ffb800] to-[#ff4d00] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Membership
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              Membership in the Debate Society is open to all students of Benguet
              State University. The following outlines the membership lifecycle — from
              admission through renewal, transfer, fees, and member obligations — as
              established by the Constitution.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Constitution, Article 5 — Membership
            </p>
          </article>

          {/* ═══════════════════════════════════════ */}
          {/* MEMBERSHIP FEES                         */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Membership Fees
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Article 5, Section 9
              </p>
            </div>

            <article className="rounded-3xl border border-emerald-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-emerald-400">
                      <path d="M10.464 2.432a3.75 3.75 0 0 1 3.072 0l1.965.982A4.125 4.125 0 0 1 18 7.327V9a2.625 2.625 0 0 1-1.893 2.517c-.28.077-.57.133-.866.167a2.625 2.625 0 0 1-1.279 1.998l-.567.378a2.625 2.625 0 0 1-2.922 0l-.567-.378a2.625 2.625 0 0 1-1.279-1.998 3.75 3.75 0 0 1-.866-.167A2.625 2.625 0 0 1 6 9V7.327a4.125 4.125 0 0 1 2.501-3.913l1.965-.982Z" />
                      <path d="M3.75 12.75a.75.75 0 0 1 .75.75v5.25c0 1.035.84 1.875 1.875 1.875h11.25A1.875 1.875 0 0 0 19.5 18.75V13.5a.75.75 0 0 1 1.5 0v5.25A3.375 3.375 0 0 1 17.625 22.125H6.375A3.375 3.375 0 0 1 3 18.75V13.5a.75.75 0 0 1 .75-.75Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-200">
                    Semesterly Membership Fee
                  </h3>
                </div>
                <p className="text-base leading-7 text-neutral-300">
                  Every member of the Society is required to pay a membership fee at
                  the commencement of each semester. The specific amount of the fee
                  is determined through a deliberation and majority vote of the
                  Council of House Chancellors, subject to the final approval of the
                  President.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Article 5, Section 9
                </p>
              </div>
            </article>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <h3 className="text-sm font-semibold text-white">
                  Who Sets the Fee
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  The Council of House Chancellors deliberates and votes on the fee
                  amount. A majority vote is required.
                </p>
              </article>
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <h3 className="text-sm font-semibold text-white">
                  Final Approval
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  The President of the Society must give final approval before the
                  fee takes effect.
                </p>
              </article>
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <h3 className="text-sm font-semibold text-white">
                  When It&apos;s Due
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  At the commencement of each semester. Failure to pay may affect
                  member standing and privileges.
                </p>
              </article>
            </div>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* MEMBERSHIP RENEWAL                      */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Membership Renewal
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Article 5, Section 6
              </p>
            </div>

            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4">
                <p className="text-base leading-7 text-neutral-300">
                  Membership is valid for <strong className="text-white">one (1)
                  academic year</strong> and shall be renewed for the following
                  academic year. Renewal of membership to a House only requires the
                  approval of the House Council and does not need the approval of
                  the President.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Article 5, Section 6
                </p>
              </div>
            </article>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-neutral-300">
                      <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.372 2.302l2.148-2.148a2.5 2.5 0 0 0 3.358-3.358l2.148-2.148a5.5 5.5 0 0 1 1.718 5.352Zm-3.878-7.263A5.5 5.5 0 0 0 5.678 3.76L3.53 5.908a2.5 2.5 0 0 0 3.358 3.358l2.148-2.148a5.5 5.5 0 0 0 2.398-2.757Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    House Council Approval
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  Renewal requires only the approval of the House Council. No
                  Presidential approval is needed, streamlining the process.
                </p>
              </article>

              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-neutral-300">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8.5V5.5a3 3 0 0 0-6 0V9.5h6Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    Validity Period
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  Membership runs for one full academic year and must be renewed
                  at the start of the next academic year to remain active.
                </p>
              </article>
            </div>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* TRANSFER PROCESS                        */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Transfer Between Houses
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Article 5, Section 5
              </p>
            </div>

            <article className="rounded-3xl border border-blue-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4">
                <p className="text-base leading-7 text-neutral-300">
                  Transfers between Houses may only occur during{" "}
                  <strong className="text-white">official transfer periods</strong>{" "}
                  and require the <strong className="text-white">mutual consent</strong>{" "}
                  of both Houses involved.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Article 5, Section 5
                </p>
              </div>
            </article>

            {/* Transfer Steps */}
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Identify Official Transfer Period",
                  desc: "Transfers may only occur during officially designated transfer periods as announced by the Council of House Chancellors.",
                },
                {
                  step: "2",
                  title: "Submit Transfer Request",
                  desc: "The member submits a written request to both the current House Council and the receiving House Council, stating the reason for the transfer.",
                },
                {
                  step: "3",
                  title: "Current House Council Review",
                  desc: "The current House Council deliberates on the request. Mutual consent requires their approval of the release.",
                },
                {
                  step: "4",
                  title: "Receiving House Council Review",
                  desc: "The receiving House Council evaluates the member per their internal membership policy and votes on acceptance.",
                },
                {
                  step: "5",
                  title: "Mutual Consent Confirmed",
                  desc: "Both Houses must consent. If either House declines, the transfer does not proceed. Upon approval, the member is officially transferred.",
                },
              ].map((item) => (
                <article key={item.step} className="flex items-start gap-4 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-neutral-400">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>

            <article className="rounded-3xl border border-amber-900/60 bg-amber-950/30 p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-5 shrink-0 text-amber-400">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-200">
                    Important: One House at a Time
                  </p>
                  <p className="mt-1 text-sm leading-6 text-amber-300/80">
                    No individual may be a member of more than one House at a time.
                    A member must be formally released by their current House before
                    being accepted by the receiving House.
                  </p>
                  <p className="mt-2 text-xs italic text-amber-500/80">
                    — Article 5, Section 3(b)
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* MEMBER OBLIGATIONS                      */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Member Obligations
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <h3 className="text-sm font-semibold text-white">
                  Governance Compliance
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Members shall abide by their respective House Charter, House
                  policies, the Society Constitution, and the Society policies.
                </p>
                <p className="mt-2 text-xs italic text-neutral-500">
                  — Article 5, Section 7
                </p>
              </article>

              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <h3 className="text-sm font-semibold text-white">
                  Conduct &amp; Discipline
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  The High Council and the House Councils may sanction members for
                  misconduct, based on collected evidence, inclusion policy, and
                  prior warnings.
                </p>
                <p className="mt-2 text-xs italic text-neutral-500">
                  — Article 5, Section 8
                </p>
              </article>

              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <h3 className="text-sm font-semibold text-white">
                  Membership Fees
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Every member is required to pay a membership fee at the
                  commencement of each semester, as determined by the Council of
                  House Chancellors and approved by the President.
                </p>
                <p className="mt-2 text-xs italic text-neutral-500">
                  — Article 5, Section 9
                </p>
              </article>

              <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <h3 className="text-sm font-semibold text-white">
                  Executive Internship
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Provisional members must complete one (1) academic year of
                  service within an Office of the High Council as an Executive
                  Intern to attain Full Membership status.
                </p>
                <p className="mt-2 text-xs italic text-neutral-500">
                  — Article 5, Section 2
                </p>
              </article>
            </div>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* MEMBERSHIP LIFECYCLE                    */}
          {/* ═══════════════════════════════════════ */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="text-2xl font-semibold text-white">
                Membership Lifecycle
              </h2>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                {[
                  { label: "Apply", desc: "Submit application to a House" },
                  { label: "Provisional", desc: "Admitted as provisional member" },
                  { label: "Executive Intern", desc: "1-year High Council service" },
                  { label: "Full Member", desc: "Elevated to full membership" },
                  { label: "Renew", desc: "Annual House Council approval" },
                ].map((stage, i) => (
                  <div key={stage.label} className="flex flex-col items-center gap-1 text-center">
                    <div className="rounded-2xl bg-neutral-800 px-4 py-3">
                      <p className="text-sm font-semibold text-white">{stage.label}</p>
                    </div>
                    <p className="max-w-[120px] text-[10px] text-neutral-500">{stage.desc}</p>
                    {i < 4 && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-1 size-4 text-neutral-600 sm:hidden sm:rotate-0">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* CTA */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h3 className="text-2xl font-semibold text-white">
                Ready to Join?
              </h3>
              <p className="text-base leading-7 text-neutral-300">
                Submit your membership application and the House Council will review
                it. All students of Benguet State University are welcome to apply.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href="/apply" className="inline-flex items-center justify-center rounded-full bg-neutral-100 px-8 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200">
                  Apply Now
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-1.5 size-4">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="/houses" className="inline-flex items-center justify-center rounded-full border border-neutral-700 px-8 py-3 text-sm font-semibold text-neutral-300 transition hover:text-white hover:border-neutral-500">
                  Learn About the Houses
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
