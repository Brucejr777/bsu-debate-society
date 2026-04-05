export default function Footer() {
  return (
    <footer className="border-t border-neutral-800/80 bg-gradient-to-r from-neutral-950 via-neutral-900/60 to-neutral-950 lg:pl-64">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-16">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-300">
              BSU Debate Society
            </p>
            <p className="text-xs text-neutral-500">
              &copy; {new Date().getFullYear()} Benguet State University Debate Society. All rights reserved.
            </p>
          </div>
          <p className="text-xs italic text-neutral-500 sm:max-w-xs">
            &quot;Reasoned dialogue rooted in evidence, respect, and clarity.&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
