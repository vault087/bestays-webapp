import { Suspense } from "react";
import { getDictionariesAction } from "@/entities/dictionaries/actions";
import DictionariesPageContent from "./page-content";

export default function DictionariesPage() {
  // Create the promise but don't await it
  const dictionariesPromise = getDictionariesAction();

  // Pass the promise directly to the client component
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DictionariesPageContent dictionariesPromise={dictionariesPromise} />
    </Suspense>
  );
}
