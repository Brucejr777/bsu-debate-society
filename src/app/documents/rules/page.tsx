import fs from "fs";
import path from "path";
import DocumentViewer from "@/components/DocumentViewer";

export default function RulesPage() {
  const filePath = path.join(process.cwd(), "RULES_AND_PROCEDURES.md");
  const content = fs.readFileSync(filePath, "utf-8");

  return <DocumentViewer content={content} title="The Blue Book — Rules and Procedures" subtitle="Operations Manual — Art. 9, Sec. 2(a)" />;
}
