export default function PointSystemPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back */}
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
              </svg>
              Back to Home
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Rules & Procedures — Article I
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              House Point System
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The House Point System is established to promote constructive and healthy
              competition among Society Houses, recognize excellence in debate and organizational
              contribution, and strengthen House identity and camaraderie in accordance with
              Article 3, Section 7 of the Society Constitution.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article I, Section 1
            </p>
          </article>

          {/* ═══════════════════════════════════════ */}
          {/* FOUR POINT CATEGORIES                   */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Four Point Categories
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Article I, Section 3
              </p>
            </div>

            {/* 1. Competitive Excellence */}
            <article className="rounded-3xl border border-emerald-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-emerald-400">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8.5V5.5a3 3 0 0 0-6 0V9.5h6Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-emerald-200">
                    Competitive Excellence
                  </h3>
                </div>
                <p className="text-base leading-7 text-neutral-300">
                  Points awarded for debate performance in inter-House tournaments
                  and external competitions where members represent Benguet State University.
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-neutral-700 bg-neutral-900/80 p-5">
                    <h4 className="text-lg font-semibold text-white mb-3">Inter-House Tournaments</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center py-1 border-b border-neutral-800">
                        <span className="text-sm text-neutral-300">1st Place</span>
                        <span className="text-lg font-bold text-emerald-400">+100</span>
                      </li>
                      <li className="flex justify-between items-center py-1 border-b border-neutral-800">
                        <span className="text-sm text-neutral-300">2nd Place</span>
                        <span className="text-lg font-bold text-emerald-400">+75</span>
                      </li>
                      <li className="flex justify-between items-center py-1 border-b border-neutral-800">
                        <span className="text-sm text-neutral-300">3rd Place</span>
                        <span className="text-lg font-bold text-emerald-400">+50</span>
                      </li>
                      <li className="flex justify-between items-center py-1">
                        <span className="text-sm text-neutral-300">Best Speaker</span>
                        <span className="text-lg font-bold text-emerald-400">+25</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-neutral-700 bg-neutral-900/80 p-5">
                    <h4 className="text-lg font-semibold text-white mb-3">External Competitions</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center py-1 border-b border-neutral-800">
                        <span className="text-sm text-neutral-300">Championship / 1st Place</span>
                        <span className="text-lg font-bold text-emerald-400">+50</span>
                      </li>
                      <li className="flex justify-between items-center py-1 border-b border-neutral-800">
                        <span className="text-sm text-neutral-300">Finalist / Semi-Finalist</span>
                        <span className="text-lg font-bold text-emerald-400">+30</span>
                      </li>
                      <li className="flex justify-between items-center py-1">
                        <span className="text-sm text-neutral-300">Participation</span>
                        <span className="text-lg font-bold text-emerald-400">+10</span>
                      </li>
                    </ul>
                    <p className="mt-3 text-xs italic text-neutral-500">
                      Placement points and participation points are mutually exclusive.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* 2. Organizational Contribution */}
            <article className="rounded-3xl border border-blue-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-blue-400">
                      <path d="M10.362 1.093a.75.75 0 0 0-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925ZM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0 0 18 14.25V6.443ZM9.25 18.693v-8.25l-7.25-4v7.807a.75.75 0 0 0 .388.657l6.862 3.786Z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-blue-200">
                    Organizational Contribution
                  </h3>
                </div>
                <p className="text-base leading-7 text-neutral-300">
                  Points awarded for House-led initiatives that demonstrate each House's
                  core embodied value. Each activity must be classified based on its primary
                  purpose; no single activity may claim points under more than one category.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl bg-neutral-900 p-5" style={{ borderLeft: "4px solid #8b0000" }}>
                    <p className="text-sm font-semibold text-white">House of Bathala</p>
                    <p className="text-xs text-neutral-500 mb-2">Leadership initiative</p>
                    <p className="text-2xl font-bold text-emerald-400">+100</p>
                    <p className="mt-1 text-[10px] text-neutral-500">Mentorship, workshops, team management</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-5" style={{ borderLeft: "4px solid #280137" }}>
                    <p className="text-sm font-semibold text-white">House of Kabunian</p>
                    <p className="text-xs text-neutral-500 mb-2">Journalism initiative</p>
                    <p className="text-2xl font-bold text-emerald-400">+100</p>
                    <p className="mt-1 text-[10px] text-neutral-500">Debate chronicles, content, public records</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-5" style={{ borderLeft: "4px solid #000b90" }}>
                    <p className="text-sm font-semibold text-white">House of Laon</p>
                    <p className="text-xs text-neutral-500 mb-2">Academic initiative</p>
                    <p className="text-2xl font-bold text-emerald-400">+100</p>
                    <p className="mt-1 text-[10px] text-neutral-500">Research forums, case briefs, workshops</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-5" style={{ borderLeft: "4px solid #006400" }}>
                    <p className="text-sm font-semibold text-white">House of Manama</p>
                    <p className="text-xs text-neutral-500 mb-2">Arts initiative</p>
                    <p className="text-2xl font-bold text-emerald-400">+100</p>
                    <p className="mt-1 text-[10px] text-neutral-500">Creative formats, design, cultural showcases</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <p className="text-sm text-neutral-300">Co-hosted initiative (2 Houses)</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-emerald-400">+20</span>
                      <span className="text-xs text-neutral-500">each House</span>
                    </div>
                    <p className="mt-1 text-[10px] text-neutral-500">Must meaningfully integrate both Houses' embodied values</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <p className="text-sm text-neutral-300">Recruitment — new member</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-emerald-400">+5</span>
                      <span className="text-xs text-neutral-500">per member</span>
                    </div>
                    <p className="mt-1 text-[10px] text-neutral-500">Member must remain active for at least 1 semester</p>
                  </div>
                </div>
              </div>
            </article>

            {/* 3. Governance & Compliance */}
            <article className="rounded-3xl border border-amber-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-amber-400">
                      <path fillRule="evenodd" d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.382l2.447.895A.75.75 0 0 0 6 9.232V9h8v.232a.75.75 0 0 0 .553.71l2.447-.895V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3Zm3 4V5a1.5 1.5 0 0 0-3 0v1h3Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-amber-200">
                    Governance & Compliance
                  </h3>
                </div>
                <p className="text-base leading-7 text-neutral-300">
                  Points awarded or deducted based on timely submission of reports, meeting attendance,
                  financial compliance, and proper use of House Resources.
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-900/30 bg-neutral-900/80 p-5">
                    <h4 className="text-lg font-semibold text-emerald-200 mb-3">Additions</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-neutral-300">On-time report submission</p>
                          <p className="text-[10px] text-neutral-500">Accomplishment Reports, Financial Reports</p>
                        </div>
                        <span className="text-lg font-bold text-emerald-400">+5</span>
                      </li>
                      <li className="flex justify-between items-center pt-2 border-t border-neutral-800">
                        <div>
                          <p className="text-sm text-neutral-300">Full Council meeting attendance</p>
                          <p className="text-[10px] text-neutral-500">All House Council members present</p>
                        </div>
                        <span className="text-lg font-bold text-emerald-400">+3</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-red-900/30 bg-neutral-900/80 p-5">
                    <h4 className="text-lg font-semibold text-red-200 mb-3">Deductions</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-neutral-300">Late submission</p>
                          <p className="text-[10px] text-neutral-500">Per day, up to 15 points max</p>
                        </div>
                        <span className="text-lg font-bold text-red-400">-3/day</span>
                      </li>
                      <li className="flex justify-between items-center pt-2 border-t border-neutral-800">
                        <div>
                          <p className="text-sm text-neutral-300">No financial report</p>
                          <p className="text-[10px] text-neutral-500">Missing semester-end submission</p>
                        </div>
                        <span className="text-lg font-bold text-red-400">-20</span>
                      </li>
                      <li className="flex justify-between items-center pt-2 border-t border-neutral-800">
                        <div>
                          <p className="text-sm text-neutral-300">Unauthorized use of House Resources</p>
                          <p className="text-[10px] text-neutral-500">Personal gain or non-Society purposes</p>
                        </div>
                        <span className="text-lg font-bold text-red-400">-75%</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs italic text-neutral-500 text-center">
                  Deductions for unauthorized resource use are 75% of the House's current point total
                  at the time of the violation.
                </p>
              </div>
            </article>

            {/* 4. Conduct & Ethics */}
            <article className="rounded-3xl border border-red-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-400">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314 0c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm2.813 5.25a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h6.5Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-red-200">
                    Conduct & Ethics
                  </h3>
                </div>
                <p className="text-base leading-7 text-neutral-300">
                  Point deductions applied based on disciplinary sanctions recorded in the
                  Society Disciplinary Ledger. Deductions are applied by the Office of Internal
                  Affairs (OIA), not self-reported by House Councils.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-amber-900/30 bg-neutral-900/80 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="size-2 rounded-full bg-amber-500" />
                      <h4 className="text-base font-semibold text-amber-200">Minor Violation</h4>
                    </div>
                    <ul className="space-y-1 text-xs text-neutral-400 mb-4">
                      <li>• First-time failure to complete tasks</li>
                      <li>• Minor disrespect during proceedings</li>
                      <li>• Minor negligence in asset custody</li>
                    </ul>
                    <p className="text-3xl font-bold text-red-400">-5</p>
                  </div>

                  <div className="rounded-2xl border border-red-900/30 bg-neutral-900/80 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="size-2 rounded-full bg-red-500" />
                      <h4 className="text-base font-semibold text-red-200">Major Violation</h4>
                    </div>
                    <ul className="space-y-1 text-xs text-neutral-400 mb-4">
                      <li>• Dishonesty or falsification of records</li>
                      <li>• Harassment or intimidation</li>
                      <li>• Intentional disruption or sabotage</li>
                      <li>• Repeated minor violations after warning</li>
                    </ul>
                    <p className="text-3xl font-bold text-red-400">-15</p>
                  </div>

                  <div className="rounded-2xl border border-red-900/30 bg-neutral-900/80 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="size-2 rounded-full bg-red-500" />
                      <h4 className="text-base font-semibold text-red-200">Severe Violation</h4>
                    </div>
                    <ul className="space-y-1 text-xs text-neutral-400 mb-4">
                      <li>• Discrimination or exclusionary behavior</li>
                      <li>• Intentional misrepresentation in official communications</li>
                      <li>• Failure to report a Minor Violation (Concealment)</li>
                    </ul>
                    <p className="text-3xl font-bold text-red-400">-30</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-red-950/30 border border-red-900/40 p-4">
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-5 shrink-0 text-red-400">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-red-200">Concealment Penalty</p>
                      <p className="text-xs text-red-300/80">
                        Failure by a House Council to submit a finalized Minor Violation sanction to the
                        Society OIA within the prescribed period is classified as a Major Violation
                        (Dishonesty/Concealment), resulting in a <strong className="text-white">-30 point deduction</strong>
                        and potential disciplinary action against the House Council officers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* SPECIAL COMPETITIONS & BONUSES           */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Special Competitions & Bonuses
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Article I, Section 10
              </p>
            </div>

            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-4xl space-y-6">

                {/* Annual Excellence Awards */}
                <div className="rounded-2xl border border-purple-900/40 bg-neutral-950/95 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-purple-400">
                        <path fillRule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 0 0-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 0 0-.552.698 5 5 0 0 0 4.503 5.152 6 6 0 0 0 2.946 1.822A.75.75 0 0 0 10 12.75c.297 0 .583-.032.863-.094a6 6 0 0 0 2.946-1.822 5 5 0 0 0 4.503-5.152.75.75 0 0 0-.552-.698c-.803-.22-1.618-.408-2.445-.565v-.387a.75.75 0 0 0-.629-.74C13.623 1.149 11.828 1 10 1Zm2.5 4.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0ZM3.69 12.972c-.485.166-.971.35-1.445.556a.75.75 0 0 0-.485.694v.312c.746.263 1.506.493 2.282.662a.75.75 0 0 0 .808-.44l.412-1.03a7.553 7.553 0 0 1-1.573-.754Zm.82 3.947c.496.133 1.002.243 1.518.327a.75.75 0 0 0 .78-.376l.67-1.34a8.12 8.12 0 0 1-1.557-.405l-.79 1.568c-.19.373-.008.826.379 1.004v.222Zm8.76-2.243a.75.75 0 0 1 .344.354l.67 1.34a.75.75 0 0 0 .78.376c.516-.084 1.022-.194 1.518-.327a.843.843 0 0 0 .38-1.004l-.791-1.568a8.12 8.12 0 0 1-1.557.405l.67 1.34a.75.75 0 0 1-.014.084Zm3.884-4.588c-.474-.205-.96-.39-1.445-.556a7.553 7.553 0 0 1-1.573.754l.412 1.03a.75.75 0 0 0 .808.44c.776-.169 1.536-.399 2.282-.662v-.312a.75.75 0 0 0-.484-.694Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-purple-200">Annual Excellence Awards</h4>
                  </div>
                  <p className="text-sm text-neutral-400 mb-4">
                    Presented at the end of each academic year. Each award is worth <strong className="text-white">+25 points</strong>.
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { title: "Historical Integrity", desc: "Best documentation and accountability" },
                      { title: "Inclusive Dialogue", desc: "Best embodiment of diversity and inclusion" },
                      { title: "Innovation in Debate", desc: "Creativity in argumentation and event design" },
                      { title: "Community Impact", desc: "Most effective outreach efforts" },
                      { title: "Member Development", desc: "Highest retention and growth rate" },
                      { title: "Rising House", desc: "Most improved — semester-to-semester increase" },
                    ].map((award) => (
                      <div key={award.title} className="rounded-xl bg-neutral-900 p-4">
                        <p className="text-sm font-semibold text-white">{award.title}</p>
                        <p className="text-xs text-neutral-500 mt-1">{award.desc}</p>
                        <p className="text-lg font-bold text-emerald-400 mt-2">+25</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bonus Opportunities */}
                <div className="rounded-2xl border border-amber-900/40 bg-neutral-950/95 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-amber-400">
                        <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633l-.683-2.051Z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-amber-200">Bonus Point Opportunities</h4>
                  </div>
                  <p className="text-sm text-neutral-400 mb-4">
                    Available throughout the year to supplement regular category points.
                    Attendance bonuses count only bona fide House members.
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      { label: "Perfect attendance at all Society Assembly Meetings", points: "+15", desc: "100% of bona fide members present all semester" },
                      { label: "≥90% attendance at Society Assembly Meetings", points: "+10", desc: "90% or higher attendance all semester" },
                      { label: "Zero conduct violations (entire semester)", points: "+10", desc: "No Minor, Major, or Severe violations recorded" },
                      { label: "Cross-House collaboration (3+ Houses)", points: "+30", desc: "Cumulative with co-host points under §3(2)" },
                      { label: "External individual award won by a member", points: "+15", desc: "Documented by official certificate (submit within 14 days)" },
                      { label: "Host a visit from an external organization", points: "+10", desc: "Approved and documented visit" },
                    ].map((bonus) => (
                      <div key={bonus.label} className="flex justify-between items-center rounded-xl bg-neutral-900 p-4">
                        <div className="flex-1">
                          <p className="text-sm text-neutral-300">{bonus.label}</p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">{bonus.desc}</p>
                        </div>
                        <span className="text-lg font-bold text-emerald-400 ml-3 shrink-0">{bonus.points}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inter-House Debate Cup */}
                <div className="rounded-2xl border border-emerald-900/40 bg-neutral-950/95 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-emerald-400">
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM4.332 8.027a6.012 6.012 0 0 1 11.336 0 6.011 6.011 0 0 1-2.041 3.112 5.99 5.99 0 0 1-3.627 1.111 5.99 5.99 0 0 1-3.627-1.111A6.011 6.011 0 0 1 4.332 8.027Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-emerald-200">Inter-House Debate Cup</h4>
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">
                    Held each semester with mandatory participation from all Houses in a round-robin format.
                    Points under this section are separate from and cumulative with Tournament points under §3(1).
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-neutral-900 p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-400">+15</p>
                      <p className="text-xs text-neutral-400 mt-1">Match Win</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-4 text-center">
                      <p className="text-2xl font-bold text-neutral-300">+7</p>
                      <p className="text-xs text-neutral-400 mt-1">Draw</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-4 text-center">
                      <p className="text-2xl font-bold text-neutral-400">+3</p>
                      <p className="text-xs text-neutral-400 mt-1">Participation</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-4 text-center">
                      <p className="text-2xl font-bold text-amber-400">+5</p>
                      <p className="text-xs text-neutral-400 mt-1">Best Team</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs italic text-neutral-500">Placement points and participation points are mutually exclusive.</p>
                </div>
              </div>
            </article>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* TRANSACTION PROCESS                      */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Point Transaction Process
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Article I, Sections 4–6
              </p>
            </div>

            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-6">
                {[
                  {
                    step: "1",
                    title: "Submit Accomplishment Report",
                    desc: "Within 7 calendar days of the activity, the House submits an Accomplishment Report to the Secretary of Internal Affairs including: activity name, date, purpose, category, claimed points with subsection reference, supporting documentation (attendance sheets, photos), and the House Chancellor's signature.",
                  },
                  {
                    step: "2",
                    title: "Provisional Posting",
                    desc: "The Secretary of Internal Affairs reviews the report for sufficiency in form and substance. If sufficient, points are posted to the Master House Point Ledger within 3 business days, marked as 'Provisional Subject to Petition.'",
                  },
                  {
                    step: "3",
                    title: "Petition Period (7 Days)",
                    desc: "Any of the three non-claiming Houses may file a written petition to challenge the posting within 7 calendar days. Grounds include: activity not qualifying for the category, insufficient documentation, misstated figures, or violation of the single-category rule.",
                  },
                  {
                    step: "4",
                    title: "Adjudication (if petitioned)",
                    desc: "If a valid petition is filed, the High Tribunal is convened with the President as Presiding Judge and the three uninvolved House Chancellors voting. A decision is rendered within 14 calendar days. The Tribunal may uphold, modify, or reverse the transaction.",
                  },
                  {
                    step: "5",
                    title: "Finalization",
                    desc: "If no petition is filed within 7 days, the provisional status is removed and points become final and executory. If knowingly false information is discovered, the House forfeits the claimed points, receives an equal penalty deduction, and must submit a corrective report.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-sm font-bold text-white">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-neutral-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Provisional Sanctions */}
            <article className="rounded-3xl border border-amber-900/40 bg-amber-950/30 p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-5 shrink-0 text-amber-400">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-200">Provisional Sanctions for Major Violations</p>
                  <p className="mt-1 text-sm leading-6 text-amber-300/80">
                    When a House Council independently initiates disciplinary action against one of its own members
                    for a Major Violation, it may recommend a provisional point deduction of up to <strong className="text-white">-15 points</strong>
                    pending full review by the High Council. The deduction is subject to restoration if the High Council
                    overturns the sanction. This does not apply to complaints initiated by external parties.
                  </p>
                  <p className="mt-2 text-xs italic text-amber-500/80">
                    — Article I, Section 6
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* POINT KEEPER & LEDGER                    */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Point Keeper & Ledger Management
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Article I, Sections 7 & 11
              </p>
            </div>

            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-6">
                <p className="text-base leading-7 text-neutral-300">
                  The <strong className="text-white">Secretary of Internal Affairs</strong> serves as the Point Keeper,
                  responsible for maintaining the Master House Point Ledger, reviewing Accomplishment Reports,
                  publishing standings, responding to House inquiries, and preparing semester point reports for
                  the Council of House Chancellors. The Point Keeper may designate an Assistant Point Keeper
                  for support.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-emerald-400">
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.536-4.464a.75.75 0 1 0-1.061-1.061 3.5 3.5 0 0 1-4.95 0 .75.75 0 0 0-1.06 1.06 5 5 0 0 0 7.07 0Z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-sm font-semibold text-white">View Access</h3>
                    </div>
                    <p className="text-xs text-neutral-400">
                      All Society members have view access to the Master House Point Ledger through the Society's official online platform.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-amber-400">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8.5V5.5a3 3 0 0 0-6 0V9.5h6Z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-sm font-semibold text-white">Edit Access</h3>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Restricted to the Secretary of Internal Affairs only. All edits are logged and traceable.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-neutral-900 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-blue-400">
                        <path d="M10.362 1.093a.75.75 0 0 0-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925ZM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0 0 18 14.25V6.443ZM9.25 18.693v-8.25l-7.25-4v7.807a.75.75 0 0 0 .388.657l6.862 3.786Z" />
                      </svg>
                      <h3 className="text-sm font-semibold text-white">Monthly Reports</h3>
                    </div>
                    <p className="text-xs text-neutral-400">
                      A summary report with category breakdowns is presented monthly at the Society Assembly Meeting.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* APPEALS & DISPUTE RESOLUTION              */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Appeals & Dispute Resolution
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Article I, Section 8
              </p>
            </div>

            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <p className="text-base leading-7 text-neutral-300">
                  A House may appeal a <strong className="text-white">final</strong> point transaction only on the grounds
                  of an alleged violation of constitutional rights under Article 4 of the Constitution. The appeal
                  must be submitted via written Appeal Form to the Council of House Chancellors.
                </p>
                <p className="text-base leading-7 text-neutral-300">
                  If approved for hearing, the <strong className="text-white">Society Chief Adviser</strong> serves as
                  Presiding Judge. The Council of House Chancellors may provide advisory input, but the Adviser's
                  decision is <strong className="text-white">final and executory</strong>.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                  <div className="rounded-2xl bg-neutral-900 p-4">
                    <p className="text-lg font-bold text-white">5</p>
                    <p className="text-xs text-neutral-400">business days to review appeal</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-4">
                    <p className="text-lg font-bold text-white">14</p>
                    <p className="text-xs text-neutral-400">calendar days to render decision</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 p-4">
                    <p className="text-lg font-bold text-white">Final</p>
                    <p className="text-xs text-neutral-400">Adviser's decision is executory</p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href="/standings"
              className="inline-flex items-center justify-center rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              View Current Standings
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-1.5 size-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="/house-cup"
              className="inline-flex items-center justify-center rounded-full border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-300 transition hover:text-white hover:border-neutral-500"
            >
              View House Cup
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}