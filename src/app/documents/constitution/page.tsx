import fs from "fs";
import path from "path";
import DocumentViewer from "@/components/DocumentViewer";

export default function ConstitutionPage() {
  const filePath = path.join(process.cwd(), "CONSTITUTION.md");
  let content = fs.readFileSync(filePath, "utf-8");

  // Strip the markdown title header so the DocumentViewer parser
  // (which looks for **Article ... ** blocks) isn't confused
  // by the leading "# CONSTITUTION" line.
  content = content.replace(/^#\s+CONSTITUTION\s*\n+/i, "");

  return <DocumentViewer content={content} title="The Red Book — The Constitution" subtitle="Ethical Framework — Art. 9, Sec. 2(b)" />;
}
