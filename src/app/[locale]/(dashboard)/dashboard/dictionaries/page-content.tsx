"use client";

import { PlusCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { useStore } from "zustand";
import { DebugCard } from "@/components/ui/debug-json-card";
import {
  createDictionaryStore,
  DictionaryStoreProvider,
  DictionaryCodeInput,
  DictionaryNameInput,
  DictionaryEntryNameInput,
  useDictionaryStore,
  DictionaryDescriptionInput,
  DBDictionary,
  MutableEntry,
  DBDictionaryEntry,
  useDictionaryStoreContext,
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
  const dictionaries = useDictionaryStore((state) => state.dictionaries);
  const entries = useDictionaryStore((state) => state.entries);

  return <DebugCard label="Error State Debug" json={{ dictionaries, entries }} />;
}

export default function DictionariesPageContent({ dictionaries, entries }: DictionariesPageContentProps) {
  // Create store with the resolved data
  const store = useMemo(() => createDictionaryStore(dictionaries, entries), [dictionaries, entries]);

  // Function to handle adding a new dictionary
  const handleAddDictionary = () => {
    store.getState().addDictionary({ en: `New Dictionary` });
  };

  // Check if we have dictionaries
  const dictionaryCount = Object.keys(dictionaries).length;
  if (dictionaryCount === 0) {
    return (
      <div className="flex gap-6 p-4">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-bold">MutableDictionary System Demo</h1>
          <Card>
            <CardContent className="p-4">
              <p className="text-center text-gray-500">No dictionaries found</p>
              <div className="mt-8 text-center">
                <Button variant="outline" className="px-8" onClick={handleAddDictionary}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add new MutableDictionary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <ReactiveDebugCard />
      </div>
    );
  }

  console.log(
    "dictionaries",
    dictionaries.map((d) => d.id),
  );
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
  const sorting = useStore(store, (state) => state.dictionariesSorting);
  const dictionaries = store.getState().dictionaries;
  const entries = store.getState().entries;

  const locale = useLocale();

  const handleAddEntry = (dictionaryId: number) => {
    store.getState().addEntry(dictionaryId, { en: `New Entry` });
  };

  const showCode = false;

  console.log("dictionaries", dictionaries);
  console.log("entries", entries);

  return (
    <div className="flex w-full flex-wrap gap-4">
      {Object.values(sorting).map((dictId) => {
        const currentEntries = entries[dictId];
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
                {/* MutableDictionary entries */}
                {currentEntries &&
                  Object.values(currentEntries).map((entry: MutableEntry) => {
                    const entId = Number(entry?.id);
                    return (
                      <div key={entId}>
                        <DictionaryEntryNameInput dictionaryId={dictId} entryId={entId} locale={locale} />
                      </div>
                    );
                  })}
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
