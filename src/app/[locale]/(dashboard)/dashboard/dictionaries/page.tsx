import { Suspense } from "react";
import { loadDictionaries, loadEntries } from "@/entities/dictionaries/libs";
import DictionariesPageContent from "./page-content";

export default async function DictionariesPage() {
  // Create the promise but don't await it

  const [dictionariesResponse, entriesResponse] = await Promise.all([loadDictionaries(), loadEntries()]);

  // Pass the promise directly to the client component
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DictionariesPageContent dictionaries={dictionariesResponse.data} entries={entriesResponse.data} />
    </Suspense>
  );
}
