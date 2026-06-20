// src/app/documents/rules/page.tsx
import BookViewer from "@/components/BookViewer";
import { blueBookSections } from "@/lib/bookSections";

export default function RulesPage() {
  return (
    <BookViewer
      title="The Blue Book — Rules and Procedures"
      sections={blueBookSections}
      basePath="/bluebook"
      defaultFile="cover_page.html"
    />
  );
}