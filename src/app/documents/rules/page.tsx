import DocumentViewer from "@/components/DocumentViewer";

export default function RulesPage() {
  // Paste your rules text here, or fetch it from Supabase later
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