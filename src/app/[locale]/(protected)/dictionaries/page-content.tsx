"use client";

import { PlusCircle } from "lucide-react";
import React, { use } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import {
  createDictionaryStore,
  DictionaryStoreProvider,
  DictionaryCodeInput,
  DictionaryCodeDisplay,
  DictionaryNameInput,
  DictionaryEntryNameInput,
  DictionaryEntryCodeInput,
  DictionaryEntryNameDisplay,
  useDictionaryStore,
} from "@/entities/dictionaries";
import { DictionaryDescriptionInput } from "@/entities/dictionaries/components/dictionary-description";
import { createMockDictionary, createMockDictionaryEntry } from "@/entities/dictionaries/mocks/dictionary-mock-data";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shadcn/components/ui/card";
import { Separator } from "@/modules/shadcn/components/ui/separator";

// Define props for the client component
interface DictionariesPageContentProps {
  dictionariesPromise: Promise<{
    dictionaries: Record<number, Dictionary>;
    entries: Record<number, Record<number, DictionaryEntry>>;
    error: string | null;
  }>;
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
    const newDictionary = createMockDictionary(newId, `new_dictionary_${newId}`, { en: `New Dictionary ${newId}` });
    store.getState().addDictionary(newDictionary);
  };

  // Function to handle adding a new entry to a specific dictionary
  const handleAddEntry = (dictionaryId: number) => {
    const newId = getNewEntryId();
    const newEntry = createMockDictionaryEntry(newId, dictionaryId, `new_code_${newId}`, { en: `New Entry ${newId}` });
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
                  <CardHeader>
                    <CardTitle>
                      <DictionaryCodeDisplay id={dictId} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div>
                        <DictionaryCodeInput id={dictId} />
                      </div>
                      <div>
                        <DictionaryNameInput id={dictId} locale="en" />
                      </div>
                      <div>
                        <DictionaryDescriptionInput id={dictId} />
                      </div>

                      <Separator className="my-4" />

                      {/* Dictionary entries */}
                      {entries[dictId] &&
                        Object.entries(entries[dictId]).map(([entryId]) => {
                          const entId = Number(entryId);
                          return (
                            <Card key={entryId} className="gap-0">
                              <CardHeader>
                                <CardTitle className="text-sm">
                                  <DictionaryEntryNameDisplay dictionaryId={dictId} entryId={entId} locale="en" />
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-1">
                                  <div>
                                    <DictionaryEntryCodeInput dictionaryId={dictId} entryId={entId} />
                                  </div>
                                  <div>
                                    <DictionaryEntryNameInput dictionaryId={dictId} entryId={entId} locale="en" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
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
