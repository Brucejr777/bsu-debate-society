import { supabase } from "@/lib/supabase";
import SosaFilteredList, { type SosaReport } from "@/components/SosaFilteredList";

export const dynamic = "force-dynamic";

export default async function SosaArchivePage() {
  const { data, error } = await supabase
    .from("sosa_reports")
    .select("*")
    .eq("is_published", true)
    .order("delivered_date", { ascending: false });

  const reports: SosaReport[] = data ?? [];

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
              Constitution — Art. 8, Sec. 4(i)
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              State of the Society Address
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The State of the Society Address (SOSA) is the formal report delivered
              by the President of the Debate Society to the Assembly of the Society
              one week after the conclusion of each semester. The President delivers
              a total of two SOSAs throughout their one-year term. Each address
              serves as the official report on the Society&apos;s financial health,
              departmental progress, the vision of the President, and the
              performance of the Four Houses.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Constitution, Article 8, Section 4(i)
            </p>
          </article>

          {/* Required Contents */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4">
              <h2 className="text-center text-xl font-semibold text-white">
                Report Contents
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <h3 className="text-sm font-semibold text-white">
                    Financial Health
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Overview of the Society&apos;s financial standing, including
                    General Fund status, House Treasury summaries, and resource
                    allocation.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <h3 className="text-sm font-semibold text-white">
                    Departmental Progress
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Accomplishments and challenges of each High Council office,
                    programs, and initiatives across the semester.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <h3 className="text-sm font-semibold text-white">
                    House Performance
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Assessment of the Four Houses&apos; competitive,
                    organizational, governance, and conduct metrics.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <h3 className="text-sm font-semibold text-white">
                    Presidential Vision
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    The President&apos;s strategic direction, goals, and outlook
                    for the Society going forward.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* SOSA Reports Archive (Filtered) */}
          {error ? (
            <article className="rounded-3xl border border-red-800 bg-red-950/50 p-8 text-center text-red-400">
              Failed to load SOSA reports. Please try again later.
            </article>
          ) : (
            <SosaFilteredList reports={reports} />
          )}
        </div>
      </section>
    </div>
  );
}