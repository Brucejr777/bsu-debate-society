import fs from "fs";
import path from "path";
import DocumentViewer from "@/components/DocumentViewer";

export default function ConstitutionPage() {
  const filePath = path.join(process.cwd(), "CONSTITUTION.md");
  const content = fs.readFileSync(filePath, "utf-8");

  return <DocumentViewer content={content} title="The Red Book — The Constitution" subtitle="Ethical Framework — Art. 9, Sec. 2(b)" />;
}
