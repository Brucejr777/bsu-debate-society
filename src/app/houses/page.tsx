export default function HousesPage() {
  const houses = [
    {
      name: "House of Bathala",
      value: "Leadership",
      color: "#8b0000",
      description:
        "The House of Bathala embodies the value of Leadership. Through mentorship programs, leadership workshops, and member-driven initiatives, Bathala cultivates decision-making, team management, and the ability to empower others — preparing debaters who lead with integrity both within and beyond the Society.",
    },
    {
      name: "House of Kabunian",
      value: "Journalism",
      color: "#280137",
      description:
        "The House of Kabunian embodies the value of Journalism. Dedicated to advancing communication, documentation, and media excellence, Kabunian produces high-quality debate chronicles, informative content, and engaging public records — sharpening members into articulate storytellers and truth-tellers.",
    },
    {
      name: "House of Laon",
      value: "Academic",
      color: "#000b90",
      description:
        "The House of Laon embodies the value of Academic excellence. Through research forums, case briefs, academic skill-building sessions, and critical analysis workshops, Laon promotes intellectual growth and scholarly inquiry — building debaters grounded in rigor, evidence, and deep understanding.",
    },
    {
      name: "House of Manama",
      value: "Arts",
      color: "#006400",
      description:
        "The House of Manama embodies the value of the Arts. By developing creativity, artistic expression, and cultural appreciation, Manama integrates performance and design into discourse — producing debaters who combine aesthetic vision with persuasive power.",
    },
  ];

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
                Article 6 — The Society Houses
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                The Society Houses
              </h1>
            </div>

            {/* Introduction */}
            <article className="mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-base leading-7 text-neutral-300">
                The Society shall be composed of four permanent and chartered Houses, each
                representing a unique philosophical, cultural, and symbolic identity that reflects the
                values of the Society. These Houses serve as the foundational sub-organizations and
                act as the primary units for competitive debate, truth-seeking, scholarly inquiry,
                community-building, and leadership development.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 6, Section 1
              </p>
            </article>

            {/* House Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {houses.map((house) => (
                <article
                  key={house.name}
                  className="group relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Color accent bar */}
                  <div
                    className="absolute left-0 top-0 h-full w-1.5"
                    style={{ backgroundColor: house.color }}
                  />

                  <div className="space-y-4 pl-3">
                    <h2 className="text-2xl font-semibold text-white">
                      {house.name}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
                        style={{ backgroundColor: house.color }}
                      >
                        {house.value}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-neutral-500">
                        Embodied Value
                      </span>
                    </div>
                    <p className="text-sm leading-7 text-neutral-300">
                      {house.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* House Councils Section */}
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  House Councils
                </h2>
                <p className="text-base leading-7 text-neutral-300">
                  Each House is governed by its own House Council, which serves as the highest
                  governing body within the House. The House Council has full authority over the
                  internal affairs of the House — including membership, programs, finances, and
                  discipline — subject to the overarching Constitution and policies of the Society.
                  All official House policies are enacted through formal House Council Resolutions,
                  requiring the concurrence of a majority of sitting Council members and the
                  approval of the House Chancellor.
                </p>
                <p className="text-sm italic text-neutral-500">
                  — Constitution, Article 7 — The House Councils
                </p>
              </div>
            </article>
          </div>
        </section>
      </div>
  );
}
