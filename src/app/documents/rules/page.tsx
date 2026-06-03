import DocumentViewer from "@/components/DocumentViewer";

export default function RulesPage() {
  // Paste or fetch? keep in mind the formatting
  const content = `
content is underway...
  `;

  return (
    <DocumentViewer 
      content={content} 
      title="The Blue Book — Rules and Procedures" 
      subtitle="Operations Manual — Art. 9, Sec. 2(a)" 
    />
  );
}