import fs from "fs";
import path from "path";
import DocumentViewer from "@/components/DocumentViewer";

export default function RulesPage() {
  const filePath = path.join(process.cwd(), "RULES_AND_PROCEDURES.md");
  let content = fs.readFileSync(filePath, "utf-8");

  // Strip the markdown title headers so the DocumentViewer parser
  // (which looks for **Article ... ** blocks) isn't confused
  // by the leading "# RULES AND PROCEDURES" and "## DEBATE SOCIETY" lines.
  content = content.replace(/^#\s+RULES AND PROCEDURES\s*\n+/i, "");
  content = content.replace(/^##\s+DEBATE SOCIETY\s*\n+/i, "");

  return <DocumentViewer content={content} title="The Blue Book — Rules and Procedures" subtitle="Operations Manual — Art. 9, Sec. 2(a)" />;
}
