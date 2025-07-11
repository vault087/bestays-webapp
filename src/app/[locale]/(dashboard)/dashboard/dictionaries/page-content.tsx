"use client";

import { PlusCircle } from "lucide-react";
import { useLocale } from "next-intl";
import React, { use } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import {
  createDictionaryStore,
  DictionaryStoreProvider,
  DictionaryCodeInput,
  DictionaryNameInput,
  DictionaryEntryNameInput,
  DictionaryEntryCodeInput,
  useDictionaryStore,
  DictionaryDescriptionInput,
} from "@/entities/dictionaries";
import { GetDictionariesActionResponse } from "@/entities/dictionaries/actions";
import { DictionaryMetaInfoInput } from "@/entities/dictionaries/components/dictionary-meta-info";
import { Button, Card, CardContent, Separator } from "@/modules/shadcn/";

// Define props for the client component
interface DictionariesPageContentProps {
  dictionariesPromise: GetDictionariesActionResponse;
}

function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const dictionaries = useDictionaryStore((state) => state.dictionaries);
  const entries = useDictionaryStore((state) => state.entries);

  return <DebugCard label="Error State Debug" json={{ dictionaries, entries }} />;
}

export default function DictionariesPageContent({ dictionariesPromise }: DictionariesPageContentProps) {
  // Use React's 'use' hook to resolve the promise
  const { dictionaries, entries, error } = use(dictionariesPromise);
  const locale = useLocale();

  // Create store with the resolved data
  const store = React.useMemo(() => createDictionaryStore(dictionaries, entries), [dictionaries, entries]);

  // Error handling
  if (error) {
    return (
      <div className="flex gap-6 p-4">
        <div className="flex-1">
          <h1 className="mb-6 text-2xl font-bold">Error Loading Dictionaries</h1>
          <Card className="bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Function to generate a new dictionary ID
  const getNewDictionaryId = () => {
    const existingIds = Object.keys(store.getState().dictionaries).map(Number);
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  };

  // Function to generate a new entry ID
  const getNewEntryId = () => {
    const allEntryIds = Object.values(store.getState().entries)
      .flatMap((entriesDict) => Object.keys(entriesDict))
      .map(Number);
    return allEntryIds.length > 0 ? Math.max(...allEntryIds) + 1 : 1;
  };

  // Function to handle adding a new dictionary
  const handleAddDictionary = () => {
    const newId = getNewDictionaryId();
    const newDictionary = {
      id: newId,
      code: `new_dictionary`,
      name: { en: `New Dictionary` },
      description: { en: `New Dictionary` },
      is_new: true,
    };
    store.getState().addDictionary(newDictionary);
  };

  // Function to handle adding a new entry to a specific dictionary
  const handleAddEntry = (dictionaryId: number) => {
    const newId = getNewEntryId();
    const newEntry = {
      id: newId,
      dictionary_id: dictionaryId,
      code: `new_entry`,
      name: { en: `New Entry` },
      description: { en: `New Entry` },
      is_new: true,
      is_active: true,
    };
    store.getState().addEntry(dictionaryId, newEntry);
  };

  // Check if we have dictionaries
  const dictionaryCount = Object.keys(dictionaries).length;
  if (dictionaryCount === 0) {
    return (
      <div className="flex gap-6 p-4">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-bold">Dictionary System Demo</h1>
          <Card>
            <CardContent className="p-4">
              <p className="text-center text-gray-500">No dictionaries found</p>
              <div className="mt-8 text-center">
                <Button variant="outline" className="px-8" onClick={handleAddDictionary}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add new Dictionary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <ReactiveDebugCard />
      </div>
    );
  }

  const showCode = false;

  return (
    <DictionaryStoreProvider store={store}>
      <div className="flex gap-6 p-4">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-bold">Dictionary System Demo</h1>

          <div className="flex flex-wrap gap-4">
            {Object.entries(dictionaries).map(([dictionaryId]) => {
              const dictId = Number(dictionaryId);
              return (
                <Card key={dictionaryId} className="w-full gap-1 md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
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

                      {/* Dictionary entries */}
                      {entries[dictId] &&
                        Object.entries(entries[dictId]).map(([entryId]) => {
                          const entId = Number(entryId);
                          return (
                            <div key={entryId}>
                              <DictionaryEntryNameInput dictionaryId={dictId} entryId={entId} locale={locale} />
                              {showCode && (
                                <div className="space-y-1">
                                  <div>
                                    <DictionaryEntryCodeInput dictionaryId={dictId} entryId={entId} />
                                  </div>
                                </div>
                              )}
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

          <div className="mt-8 text-center">
            <Button variant="outline" className="px-8" onClick={handleAddDictionary}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add new Dictionary
            </Button>
          </div>
        </div>

        <ReactiveDebugCard />
      </div>
    </DictionaryStoreProvider>
  );
}
