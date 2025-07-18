"use client";

import { PlusCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { memo, useMemo } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { DebugCard } from "@/components/ui/debug-json-card";
import {
  createDefaultDictionaryStore,
  DictionaryStoreProvider,
  DictionaryCodeInput,
  DictionaryNameInput,
  DictionaryEntryNameInput,
  DictionaryDescriptionInput,
  DBDictionary,
  MutableEntry,
  DBDictionaryEntry,
  useDictionaryStoreContext,
  useDictionaryOnlySlice,
  useEntrySlice,
} from "@/entities/dictionaries";
import { DictionaryMetaInfoInput } from "@/entities/dictionaries/features/edit/components/dictionary-meta-info";
import { Button, Card, CardContent, Separator } from "@/modules/shadcn/";

// Define props for the client component
interface DictionariesPageContentProps {
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
}

function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const dictionaries = useDictionaryOnlySlice((state) => state.dictionaries);
  const entries = useEntrySlice((state) => state.entries);

  return <DebugCard label="Error State Debug" json={{ dictionaries, entries }} />;
}

export default function DictionariesPageContent({ dictionaries, entries }: DictionariesPageContentProps) {
  // Create store with the resolved data
  const store = useMemo(() => createDefaultDictionaryStore(dictionaries, entries), [dictionaries, entries]);

  // Function to handle adding a new dictionary
  const handleAddDictionary = () => {
    store.getState().addDictionary({ en: `New Dictionary` });
  };

  return (
    <DictionaryStoreProvider store={store}>
      <div className="flex gap-6 p-4">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-bold">MutableDictionary System Demo</h1>

          <div className="w-">
            <DictionaryCanvas />
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" className="px-8" onClick={handleAddDictionary}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add new MutableDictionary
            </Button>
          </div>
        </div>

        <ReactiveDebugCard />
      </div>
    </DictionaryStoreProvider>
  );
}

const DictionaryCanvas = () => {
  const store = useDictionaryStoreContext();
  const dictionaryIDs = useStore(
    store,
    useShallow((state) => Object.keys(state.dictionaries).map(Number)),
  );
  const locale = useLocale();

  const handleAddEntry = (dictionaryId: number) => {
    store.getState().addEntry(dictionaryId, { en: `New Entry` });
  };

  const showCode = false;

  console.log("dictionaryIDs", dictionaryIDs);

  return (
    <div className="flex w-full flex-wrap gap-4">
      {dictionaryIDs.map((dictId) => {
        return (
          <Card key={dictId} className="w-full gap-1 md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
            <CardContent>
              <div className="space-y-1">
                {showCode && (
                  <div>
                    <DictionaryCodeInput id={dictId} />
                  </div>
                )}
                <div>
                  <DictionaryNameInput id={dictId} locale={locale} />
                </div>
                <div>
                  <DictionaryDescriptionInput id={dictId} locale={locale} />
                  <DictionaryMetaInfoInput id={dictId} />
                </div>
                <Separator className="my-4" />
                <EntriesList dictionaryId={dictId} locale={locale} />
                {/* MutableDictionary entries */}
                <Separator className="my-4" />
                <Button variant="outline" className="w-full" onClick={() => handleAddEntry(dictId)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add new entry
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const EntriesList = memo(({ dictionaryId, locale }: { dictionaryId: number; locale: string }) => {
  const store = useDictionaryStoreContext();
  const entries = useStore(
    store,
    useShallow((state) => state.entries[dictionaryId]),
  );

  return (
    <div>
      {entries &&
        Object.values(entries).map((entry: MutableEntry) => {
          const entId = Number(entry?.id);
          return (
            <div key={entId}>
              <DictionaryEntryNameInput dictionaryId={dictionaryId} entryId={entId} locale={locale} />
            </div>
          );
        })}
    </div>
  );
});

EntriesList.displayName = "EntriesList";
