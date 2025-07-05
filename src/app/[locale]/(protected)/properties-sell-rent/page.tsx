import { getDictionaries } from "@/entities/dictionaries";
import DictionariesPageContent from "./page-content";

export default function DictionariesPage() {
  // Create the promise but don't await it
  const dictionariesPromise = getDictionaries();

  // Pass the promise directly to the client component
  return <DictionariesPageContent dictionariesPromise={dictionariesPromise} />;
}
