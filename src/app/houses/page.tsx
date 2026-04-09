import { HOUSES } from "@/lib/houses";

export default function HousesPage() {

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
              <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
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
              {HOUSES.map((house) => (
                <a
                  key={house.slug}
                  href={`/houses/${house.slug}`}
                  className="group relative block overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30 transition-all duration-300 hover:scale-[1.02]"
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
                    <span className="mt-2 inline-flex items-center text-sm font-medium text-neutral-400 transition group-hover:text-white">
                      View House Page
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-1 size-4">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </a>
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
