import React from "react";

interface Block {
  type: "article" | "section" | "subsection" | "letter" | "text" | "divider";
  content: string;
  sectionNum?: string;
  label?: string;
}

function parseDocument(text: string): Block[] {
  // Normalize line endings
  const raw = text.replace(/\r\n/g, "\n");

  // Step 1: Find all **Article ... ** blocks (title may span multiple lines)
  const articles: { start: number; end: number; title: string; fullMatchLength: number }[] = [];

  const openTag = "**Article";
  let searchPos = 0;

  while (true) {
    const openIdx = raw.indexOf(openTag, searchPos);
    if (openIdx === -1) break;

    // Find the closing ** after this
    const afterOpen = raw.indexOf("**", openIdx + openTag.length);
    if (afterOpen === -1) break;

    const fullMatch = raw.slice(openIdx, afterOpen + 2);
    // Extract title: everything between "Article " and "**", remove ** and newlines
    const inner = raw.slice(openIdx + openTag.length, afterOpen).trim();
    // Clean up: "1.\nTHE ORGANIZATION" -> "1. THE ORGANIZATION"
    const title = inner.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

    articles.push({ start: openIdx, end: -1, title, fullMatchLength: fullMatch.length });

    searchPos = afterOpen + 2;
  }

  // Set article boundaries
  for (let i = 0; i < articles.length; i++) {
    if (i < articles.length - 1) {
      articles[i].end = articles[i + 1].start;
    } else {
      articles[i].end = raw.length;
    }
  }

  const blocks: Block[] = [];

  for (const article of articles) {
    // Add article header
    blocks.push({ type: "article", content: article.title });

    // Parse content within this article
    const articleContent = raw.slice(
      article.start + article.fullMatchLength,
      article.end
    );

    const lines = articleContent.split("\n");
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        i++;
        continue;
      }

      // Section: Section 1. or Section 12. or Section 5(2).
      const sectionMatch = trimmed.match(
        /^Section\s+(\d+[a-zA-Z]?(?:\s*\([^)]*\))?)\.\s*(.*)$/
      );
      if (sectionMatch) {
        const num = sectionMatch[1];
        let rest = sectionMatch[2];

        // If rest is empty, look for title on same/next line
        if (!rest && i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine && !nextLine.match(/^Section\s/i) && !nextLine.match(/^\(\d+\)/) && !nextLine.match(/^[a-z]\.\s/)) {
            rest = nextLine;
            i++;
          }
        }

        blocks.push({ type: "section", content: rest, sectionNum: num });
        i++;
        continue;
      }

      // Numbered subsection: (1), (2), (3), etc.
      const numSubMatch = trimmed.match(/^\((\d+)\)\s+(.*)$/);
      if (numSubMatch) {
        blocks.push({
          type: "subsection",
          content: numSubMatch[2],
          sectionNum: numSubMatch[1],
        });
        i++;
        continue;
      }

      // Letter subsection: (a), (b), (c), etc.
      const letterSubMatch = trimmed.match(/^\(([a-z])\)\s+(.*)$/);
      if (letterSubMatch) {
        blocks.push({
          type: "subsection",
          content: letterSubMatch[2],
          sectionNum: letterSubMatch[1],
        });
        i++;
        continue;
      }

      // Letter subsection variant: a., b., c. (but not a. that's part of Roman numeral or something)
      const letterVarMatch = trimmed.match(/^([a-z])\.\s+(.+)$/);
      if (letterVarMatch && letterVarMatch[2].length > 2) {
        blocks.push({
          type: "letter",
          content: letterVarMatch[2],
          sectionNum: letterVarMatch[1],
        });
        i++;
        continue;
      }

      // Roman numeral sub-subsection: (i), (ii), (iii), (iv), etc.
      const romanMatch = trimmed.match(/^\((\w+)\)\s+(.*)$/);
      if (romanMatch) {
        blocks.push({
          type: "subsection",
          content: `${romanMatch[1]}. ${romanMatch[2]}`,
        });
        i++;
        continue;
      }

      // Regular text - collect consecutive non-empty, non-special lines
      let textBuffer = trimmed;
      i++;
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (!nextLine) break;
        if (nextLine.match(/^Section\s/i)) break;
        if (nextLine.match(/^\(\d+\)/)) break;
        if (nextLine.match(/^\([a-z]\)/)) break;
        if (nextLine.match(/^\*\*Article\s/i)) break;
        if (nextLine.match(/^[a-z]\.\s.+/) && nextLine.length < 100) break;
        textBuffer += " " + nextLine;
        i++;
      }

      blocks.push({ type: "text", content: textBuffer });
    }
  }

  return blocks;
}

function inlineFormat(text: string): React.ReactNode {
  // Handle **bold**
  let parts = text.split(/(\*\*[^*]+\*\*)/g);
  let result: React.ReactNode[] = [];

  parts.forEach((part, idx) => {
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      // Process inner text for italics
      result.push(
        <strong key={idx} className="font-semibold text-neutral-200">
          {inlineFormat(boldMatch[1])}
        </strong>
      );
      return;
    }

    // Handle _italic_ or _text._
    const italicParts = part.split(/(_[^_]+_)/g);
    italicParts.forEach((ip, iIdx) => {
      const italicMatch = ip.match(/^_(.+)_$/);
      if (italicMatch) {
        result.push(
          <em key={`${idx}-${iIdx}`} className="italic text-neutral-400">
            {italicMatch[1]}
          </em>
        );
      } else {
        // Handle en-dash and em-dash formatting
        result.push(<span key={`${idx}-${iIdx}`}>{ip}</span>);
      }
    });
  });

  return result.length === 1 ? result[0] : <>{result}</>;
}

interface DocumentViewerProps {
  content: string;
  title: string;
  subtitle: string;
}

export default function DocumentViewer({
  content,
  title,
  subtitle,
}: DocumentViewerProps) {
  const blocks = parseDocument(content);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10 lg:px-16">
      {/* Back Navigation */}
      <div className="mb-8">
        <a
          href="/documents"
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
          Back to Documents
        </a>
      </div>

      {/* Header */}
      <div className="mb-12 space-y-2 border-b border-neutral-800 pb-8 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
          {subtitle}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-0">
        {blocks.map((block, idx) => {
          if (block.type === "article") {
            return (
              <div
                key={idx}
                className="mt-12 border-b border-neutral-700 pb-3 first:mt-0"
              >
                <h2 className="text-xl font-bold uppercase tracking-wide text-white">
                  {inlineFormat(block.content)}
                </h2>
              </div>
            );
          }

          if (block.type === "section") {
            return (
              <p key={idx} className="mt-4 text-justify leading-7 text-neutral-300">
                <span className="font-semibold text-neutral-100">
                  Section {block.sectionNum}.
                </span>{" "}
                {inlineFormat(block.content)}
              </p>
            );
          }

          if (block.type === "subsection") {
            return (
              <p key={idx} className="ml-6 mt-2 text-justify leading-7 text-neutral-300">
                <span className="font-medium text-neutral-400">
                  ({block.sectionNum}){" "}
                </span>
                {inlineFormat(block.content)}
              </p>
            );
          }

          if (block.type === "letter") {
            return (
              <p key={idx} className="ml-8 mt-1.5 text-justify leading-7 text-neutral-400">
                <span className="font-medium text-neutral-500">
                  {block.sectionNum}.{" "}
                </span>
                {inlineFormat(block.content)}
              </p>
            );
          }

          // Regular text
          return (
            <p key={idx} className="mt-2 text-justify leading-7 text-neutral-400">
              {inlineFormat(block.content)}
            </p>
          );
        })}
      </div>

      <div className="h-16" />
    </div>
  );
}
