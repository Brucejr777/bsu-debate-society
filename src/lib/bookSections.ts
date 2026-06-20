// src/lib/bookSections.ts

export interface Section {
  label: string;
  file: string;
}

// ── Red Book: The Constitution (Articles I–XV + Cover) ──
export const redBookSections: Section[] = [
  { label: "Cover Page", file: "cover_page.html" },
  { label: "Article I — The Organization", file: "article_1.html" },
  { label: "Article II — Vision and Mission", file: "article_2.html" },
  { label: "Article III — Declaration of Principles", file: "article_3.html" },
  { label: "Article IV — Rights of the Members", file: "article_4.html" },
  { label: "Article V — Membership", file: "article_5.html" },
  { label: "Article VI — The Society Houses", file: "article_6.html" },
  { label: "Article VII — The House Councils", file: "article_7.html" },
  { label: "Article VIII — The High Council", file: "article_8.html" },
  { label: "Article IX — The Council of House Chancellors", file: "article_9.html" },
  { label: "Article X — The High Tribunal", file: "article_10.html" },
  { label: "Article XI — Elections and Votes", file: "article_11.html" },
  { label: "Article XII — Meetings", file: "article_12.html" },
  { label: "Article XIII — Amendment and Revision", file: "article_13.html" },
  { label: "Article XIV — Dependability and Separability Clause", file: "article_14.html" },
  { label: "Article XV — Effectivity Clause", file: "article_15.html" },
];

// ── Blue Book: Rules and Procedures (Articles I–IX + Annexes A–C + Cover) ──
export const blueBookSections: Section[] = [
  { label: "Cover Page", file: "cover_page.html" },
  { label: "Article I — House Point System", file: "article_1.html" },
  { label: "Article II — Individual Recognition Framework", file: "article_2.html" },
  { label: "Article III — The Debate League", file: "article_3.html" },
  { label: "Article IV — Meetings and Deliberative Procedures", file: "article_4.html" },
  { label: "Article V — Financial and Resource Management Protocols", file: "article_5.html" },
  { label: "Article VI — Disciplinary Procedures and Due Process Implementation", file: "article_6.html" },
  { label: "Article VII — The Presidential Conclave", file: "article_7.html" },
  { label: "Article VIII — Records Management, Transparency, and Information Access", file: "article_8.html" },
  { label: "Article IX — Amendment Procedures, Review Cycles, and Effectivity", file: "article_9.html" },
  { label: "Annex A — Debate Performance Criteria", file: "annex_a.html" },
  { label: "Annex B — Standard Debate Formats and Procedures", file: "annex_b.html" },
  { label: "Annex C — Operational Compliance Templates", file: "annex_c.html" },
];