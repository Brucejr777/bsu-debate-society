import DocumentViewer from "@/components/DocumentViewer";

export default function ConstitutionPage() {
  // NO FILE READING. Just a hardcoded string.
  // You can paste the full text of your Constitution between these backticks (`)
  const content = `
under construction
  `;

  return (
    <DocumentViewer
      content={content}
      title="The Red Book — The Constitution"
      subtitle="Ethical Framework — Art. 9, Sec. 2(b)"
    />
  );
}