export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
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
                <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8">
                  <h2 className="text-2xl font-semibold text-white">Mission Statement</h2>
                  <p className="mt-4 text-base leading-7 text-neutral-300">
                    The Society envisions a vibrant, inclusive, and intellectually stimulating community where individuals from diverse backgrounds come together to engage in respectful discourse.
                  </p>
                </article>

                <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8">
                  <h2 className="text-2xl font-semibold text-white">Vision Statement</h2>
                  <p className="mt-4 text-base leading-7 text-neutral-300">
                    The Society is dedicated to fostering critical thinking, effective communication, and a spirit of intellectual curiosity.
                  </p>
                </article>

                <div className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8">
                  <h2 className="text-2xl font-semibold text-white">Our Core Principles</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-neutral-900 p-5 shadow-sm shadow-black/20">
                      <h3 className="text-lg font-semibold text-white">Reasoned Dialogue</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-300">
                        We champion thoughtful conversation rooted in evidence, respect, and clarity.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-neutral-900 p-5 shadow-sm shadow-black/20">
                      <h3 className="text-lg font-semibold text-white">Diversity & Inclusion</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-300">
                        We celebrate varied perspectives and create a welcoming environment for all members.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-neutral-900 p-5 shadow-sm shadow-black/20">
                      <h3 className="text-lg font-semibold text-white">Democratic Leadership</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-300">
                        We embrace shared governance, accountability, and collaborative decision-making.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-neutral-900 p-5 shadow-sm shadow-black/20">
                      <h3 className="text-lg font-semibold text-white">Ethical Conduct</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-300">
                        We uphold honesty, fairness, and a strong sense of responsibility in every action.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Get involved</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Discover the Society</h3>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="/houses"
                      className="inline-flex w-full items-center justify-center rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                    >
                      Explore Our Houses
                    </a>
                    <a
                      href="/documents"
                      className="inline-flex w-full items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 px-6 py-3 text-sm font-semibold text-neutral-100 transition hover:bg-neutral-800"
                    >
                      Read the Constitution
                    </a>
                    <a
                      href="/about"
                      className="inline-flex w-full items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 px-6 py-3 text-sm font-semibold text-neutral-100 transition hover:bg-neutral-700"
                    >
                      About the Society
                    </a>
                  </div>

                  <div className="rounded-3xl bg-neutral-950/95 p-5 shadow-sm shadow-black/20 border border-neutral-800">
                    <p className="text-sm font-medium text-white">Academic spirit</p>
                    <p className="mt-3 text-sm leading-6 text-neutral-300">
                      Rooted in debate, research, and respectful exchange, the BSU Debate Society supports growth for every member across campus.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
      </section>
    </div>
  );
}
