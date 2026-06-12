import DocumentViewer from "@/components/DocumentViewer";

export default function RulesPage() {
  // NO FILE READING. Just a hardcoded string.
  const content = `
under construction
  `;

  return (
    <DocumentViewer
      content={content}
      title="The Blue Book — Rules and Procedures"
      subtitle="Operations Manual — Art. 9, Sec. 2(a)"
    />
  );
}