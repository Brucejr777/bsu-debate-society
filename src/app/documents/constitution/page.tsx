import DocumentViewer from "@/components/DocumentViewer";

export default function ConstitutionPage() {
  // Paste your constitution text here, or fetch it from Supabase later
  const content = `
content is underway...
  `;

  return (
    <DocumentViewer 
      content={content} 
      title="The Red Book — The Constitution" 
      subtitle="Ethical Framework — Art. 9, Sec. 2(b)" 
    />
  );
}