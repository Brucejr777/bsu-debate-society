// src/app/documents/constitution/page.tsx
import BookViewer from "@/components/BookViewer";
import { redBookSections } from "@/lib/bookSections";

export default function ConstitutionPage() {
  return (
    <BookViewer
      title="The Red Book — The Constitution"
      sections={redBookSections}
      basePath="/redbook"
      defaultFile="cover_page.html"
    />
  );
}