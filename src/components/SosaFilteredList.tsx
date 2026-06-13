"use client";
import { useState, useMemo } from "react";

export interface SosaReport {
  id: number;
  created_at: string;
  president_name: string;
  semester: string;
  academic_year: string;
  delivered_date: string | null;
  financial_health: string;
  departmental_progress: string;
  house_performance: string;
  presidential_vision: string;
  additional_remarks: string | null;
  status: string;
}

export default function SosaFilteredList({ reports }: { reports: SosaReport[] }) {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  // Extract and sort unique academic years (descending)
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(reports.map((r) => r.academic_year)));
    return uniqueYears.sort((a, b) => b.localeCompare(a));
  }, [reports]);

  // Extract and sort unique semesters (First Semester before Second Semester)
  const semesters = useMemo(() => {
    const uniqueSemesters = Array.from(new Set(reports.map((r) => r.semester)));
    return uniqueSemesters.sort((a, b) => {
      if (a.includes("First") && b.includes("Second")) return -1;
      if (a.includes("Second") && b.includes("First")) return 1;
      return a.localeCompare(b);
    });
  }, [reports]);

  // Filter reports based on selected criteria
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const yearMatch = selectedYear === "all" || report.academic_year === selectedYear;
      const semesterMatch = selectedSemester === "all" || report.semester === selectedSemester;
      return yearMatch && semesterMatch;
    });
  }, [reports, selectedYear, selectedSemester]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="space-y-1">
            <label htmlFor="year-filter" className="text-xs font-medium text-neutral-400">
              Academic Year
            </label>
            <select
              id="year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 sm:w-48"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="semester-filter" className="text-xs font-medium text-neutral-400">
              Semester
            </label>
            <select
              id="semester-filter"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 sm:w-48"
            >
              <option value="all">All Semesters</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-sm text-neutral-500">
          Showing {filteredReports.length} of {reports.length} reports
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 text-center text-neutral-400">
          No State of the Society Address reports match the selected filters.
        </article>
      ) : (
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <article
              key={report.id}
              className="group rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-lg shadow-black/20"
            >
              {/* Report Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5 text-neutral-300"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.125 3A3.125 3.125 0 0 0 1 6.125v2.75A3.125 3.125 0 0 0 4.125 12h2.75A3.125 3.125 0 0 0 10 8.875v-2.75A3.125 3.125 0 0 0 6.875 3h-2.75Zm8 0A3.125 3.125 0 0 0 9 6.125v2.75A3.125 3.125 0 0 0 12.125 12h2.75A3.125 3.125 0 0 0 18 8.875v-2.75A3.125 3.125 0 0 0 14.875 3h-2.75Zm-8 8A3.125 3.125 0 0 0 1 14.125v2.75A3.125 3.125 0 0 0 4.125 20h2.75A3.125 3.125 0 0 0 10 16.875v-2.75A3.125 3.125 0 0 0 6.875 11h-2.75Zm8 0a3.125 3.125 0 0 0-3.125 3.125v2.75A3.125 3.125 0 0 0 12.125 20h2.75A3.125 3.125 0 0 0 18 16.875v-2.75A3.125 3.125 0 0 0 14.875 11h-2.75Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        SOSA — {report.semester} {report.academic_year}
                      </h2>
                      <p className="text-sm text-neutral-400">
                        Delivered by {report.president_name}
                      </p>
                    </div>
                  </div>
                  {report.delivered_date && (
                    <p className="text-xs text-neutral-500">
                      Delivered:{" "}
                      {new Date(report.delivered_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Report Content */}
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Financial Health
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-neutral-300">
                    {report.financial_health}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Departmental Progress
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-neutral-300">
                    {report.departmental_progress}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    House Performance
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-neutral-300">
                    {report.house_performance}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Presidential Vision
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-neutral-300">
                    {report.presidential_vision}
                  </p>
                </div>
                {report.additional_remarks && (
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Additional Remarks
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-neutral-300">
                      {report.additional_remarks}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}