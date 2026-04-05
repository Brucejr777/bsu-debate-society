export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800/60 bg-gradient-to-br from-neutral-950/90 via-neutral-900/70 to-neutral-950/80 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="space-y-10">
            <div className="space-y-4 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                Benguet State University Debate Society
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                BSU Debate Society
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-8 text-neutral-400 sm:text-xl">
                Fostering critical thinking, effective communication, and intellectual curiosity.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-8">
                <article className="group rounded-3xl border border-neutral-800/80 bg-neutral-950/90 p-8 shadow-lg shadow-black/20 transition-all duration-200 hover:border-neutral-700/80 hover:shadow-xl hover:shadow-black/30">
                  <h2 className="text-2xl font-semibold text-white">Mission Statement</h2>
                  <p className="mt-4 text-base leading-7 text-neutral-300">
                    The Society envisions a vibrant, inclusive, and intellectually stimulating community where individuals from diverse backgrounds come together to engage in respectful discourse.
                  </p>
                </article>

                <article className="group rounded-3xl border border-neutral-800/80 bg-neutral-950/90 p-8 shadow-lg shadow-black/20 transition-all duration-200 hover:border-neutral-700/80 hover:shadow-xl hover:shadow-black/30">
                  <h2 className="text-2xl font-semibold text-white">Vision Statement</h2>
                  <p className="mt-4 text-base leading-7 text-neutral-300">
                    The Society is dedicated to fostering critical thinking, effective communication, and a spirit of intellectual curiosity.
                  </p>
                </article>

                <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/90 p-8 shadow-lg shadow-black/20">
                  <h2 className="text-2xl font-semibold text-white">Our Core Principles</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="group rounded-2xl border border-neutral-800/60 bg-neutral-900/80 p-5 transition-all duration-200 hover:border-neutral-700/80 hover:bg-neutral-900">
                      <h3 className="text-lg font-semibold text-white">Reasoned Dialogue</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-300">
                        We champion thoughtful conversation rooted in evidence, respect, and clarity.
                      </p>
                    </div>
                    <div className="group rounded-2xl border border-neutral-800/60 bg-neutral-900/80 p-5 transition-all duration-200 hover:border-neutral-700/80 hover:bg-neutral-900">
                      <h3 className="text-lg font-semibold text-white">Diversity &amp; Inclusion</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-300">
                        We celebrate varied perspectives and create a welcoming environment for all members.
                      </p>
                    </div>
                    <div className="group rounded-2xl border border-neutral-800/60 bg-neutral-900/80 p-5 transition-all duration-200 hover:border-neutral-700/80 hover:bg-neutral-900">
                      <h3 className="text-lg font-semibold text-white">Democratic Leadership</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-300">
                        We embrace shared governance, accountability, and collaborative decision-making.
                      </p>
                    </div>
                    <div className="group rounded-2xl border border-neutral-800/60 bg-neutral-900/80 p-5 transition-all duration-200 hover:border-neutral-700/80 hover:bg-neutral-900">
                      <h3 className="text-lg font-semibold text-white">Ethical Conduct</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-300">
                        We uphold honesty, fairness, and a strong sense of responsibility in every action.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-neutral-800/80 bg-gradient-to-b from-neutral-950 to-neutral-900/90 p-8 shadow-lg shadow-black/20">
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Get involved</p>
                      <h3 className="mt-3 text-2xl font-semibold text-white">Discover the Society</h3>
                    </div>

                    <div className="space-y-3">
                      <a
                        href="/houses"
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-neutral-100/10"
                      >
                        Explore Our Houses
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 transition-transform group-hover:translate-x-0.5">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a
                        href="/documents"
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-700 bg-neutral-950 px-6 py-3 text-sm font-semibold text-neutral-100 transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-800/80"
                      >
                        Read the Constitution
                      </a>
                      <a
                        href="/about"
                        className="group inline-flex w-full items-center justify-center rounded-full border border-neutral-700 bg-neutral-800/80 px-6 py-3 text-sm font-semibold text-neutral-100 transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-700/80"
                      >
                        About the Society
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-800/60 bg-neutral-950/80 p-5 shadow-sm shadow-black/20">
                  <p className="text-sm font-medium text-white">Academic spirit</p>
                  <p className="mt-3 text-sm leading-6 text-neutral-300">
                    Rooted in debate, research, and respectful exchange, the BSU Debate Society supports growth for every member across campus.
                  </p>
                </div>
              </aside>
            </div>
          </div>
      </section>
    </div>
  );
}
