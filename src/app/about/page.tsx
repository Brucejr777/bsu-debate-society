export default function AboutPage() {
  const principles = [
    {
      title: "Reasoned Dialogue",
      description:
        "The Society upholds the transformative power of reasoned dialogue. Civil and intellectual debate is not merely an exercise in rhetoric, but a lifelong discipline essential to the pursuit of truth, critical thought, and personal development.",
    },
    {
      title: "Diversity & Inclusion",
      description:
        "The Society promotes and protects the principles of diversity and inclusion. It affirms the importance of integrating contributions, presence, and perspectives of individuals from various backgrounds into the community.",
    },
    {
      title: "Democratic Leadership",
      description:
        "The Society adheres to the principles of democratic leadership, discipline, cooperation, industry, brotherhood, and harmony among its constituents, providing avenues for the development and application of such competencies.",
    },
    {
      title: "Ethical Conduct",
      description:
        "The Society and its members uphold the highest standards of honesty, fairness, and ethical conduct. All actions undertaken in the name of the Society are guided by a shared sense of responsibility: to truth, to one another, and to the duties entrusted to each member.",
    },
    {
      title: "Filipino Culture & Heritage",
      description:
        "The Society promotes an enduring appreciation of Filipino culture, heritage, and values. It advocates for a form of patriotism grounded in critical love, compassion, civic engagement, and social responsibility, rejecting all expressions of exclusion, hostility, or prejudice.",
    },
    {
      title: "Constructive Competition",
      description:
        "The Society cultivates a spirit of constructive and healthy competition among its members and constituent Houses. All competitions and contests are designed to inspire excellence, deepen commitment, and strengthen both individual character and collective bonds.",
    },
    {
      title: "Tradition & Innovation",
      description:
        "The Society preserves its meaningful traditions while remaining open to innovation and reform. It affirms that institutional relevance requires adaptability, and that traditions must evolve in response to the changing needs of its members and the broader society.",
    },
    {
      title: "Continuous Growth",
      description:
        "The Society regards membership not merely as a temporary affiliation, but as a continuous process of growth: intellectually, socially, and morally. It strives to form individuals who are articulate, principled, and prepared to lead both within and beyond the organization.",
    },
    {
      title: "Education as Empowerment",
      description:
        "The Society affirms that education is not solely the acquisition of knowledge, but also the cultivation of awareness, empathy, and agency. It serves as a platform for empowerment through discourse, recognizing that learning is a means to liberation — personally, socially, and morally.",
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
              Articles 1–3 — Identity &amp; Principles
            </p>
            <h1 className="inline-block rounded-lg bg-gradient-to-r from-[#e8c840] via-[#e8c840] to-[#e8c840] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              About the Society
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Debate Society is defined by its Constitution — the supreme governing
              document that establishes its identity, vision, mission, and the nine core
              principles that guide every debate, event, and member experience.
            </p>
          </article>

          {/* ── Organization Identity ── */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Organization Identity
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 1 &amp; Article 2
              </p>
            </div>
            <p className="mx-auto max-w-3xl text-center text-base leading-7 text-neutral-300">
              The name of the organization shall be The Debate Society. It envisions a
              vibrant, inclusive, and intellectually stimulating community where individuals
              from diverse backgrounds come together to engage in respectful discourse. The
              Society is dedicated to fostering critical thinking, effective communication,
              and a spirit of intellectual curiosity.
            </p>
          </div>

          {/* ── Membership ── */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                  Membership
                </h2>
                <p className="text-sm italic text-neutral-500">
                  — Constitution, Article 5 — Membership
                </p>
              </div>
              <p className="text-base leading-7 text-neutral-300">
                Membership in the Society is open to all students of Benguet State
                University, regardless of college, degree program, gender, class, race,
                political affiliation, religious belief, or other personal background. The
                Society is built on the principles of inclusivity, equal access, and the
                belief that every voice deserves a place at the table.
              </p>
            </div>
          </article>

          {/* ── Declaration of Principles ── */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">
                Declaration of Principles
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 3 — Nine Core Principles
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((principle) => (
                <article
                  key={principle.title}
                  className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-sm shadow-black/20"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-300">
                    {principle.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* ── Member Rights ── */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                  Rights of Members
                </h2>
                <p className="text-sm italic text-neutral-500">
                  — Constitution, Article 4 — Rights of the Members
                </p>
              </div>
              <p className="text-base leading-7 text-neutral-300">
                Every member of the Society is guaranteed fundamental rights including
                freedom of speech and peaceful assembly, the right to file candidacy for
                elective office, suffrage, access to official records, protection from
                exploitation and unjust punishment, due process in disciplinary proceedings,
                and the right to form, assist, and join organizations for their integral
                development.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
