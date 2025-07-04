"use client";

import { PlusCircle } from "lucide-react";
import React, { use } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import {
  createStandaloneDictionaryStore,
  DictionaryStoreProvider,
  DictionaryCodeInput,
  DictionaryCodeDisplay,
  DictionaryNameFloatingInput,
  DictionaryEntryCodeInput,
  DictionaryEntryNameFloatingInput,
  DictionaryEntryNameDisplay,
} from "@/entities/dictionaries";
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

export default function DictionariesPageContent({ dictionariesPromise }: DictionariesPageContentProps) {
  // Use React's 'use' hook to resolve the promise
  const { dictionaries, entries, error } = use(dictionariesPromise);

  // Create store with the resolved data
  const store = React.useMemo(() => createStandaloneDictionaryStore(dictionaries, entries), [dictionaries, entries]);

  // Error handling
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Error Loading Dictionaries</h1>
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>

        <DebugCard label="Error State Debug" json={{ error, dictionaries, entries }} />
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
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Dictionary System Demo</h1>
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

        <DebugCard
          label="All Dictionaries & Entries (Empty State)"
          json={{ dictionaries, entries, message: "No dictionaries found" }}
        />
      </div>
    );
  }

  return (
    <DictionaryStoreProvider store={store}>
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Dictionary System Demo</h1>

        <div className="flex flex-wrap gap-6">
          {Object.entries(dictionaries).map(([dictionaryId]) => {
            const dictId = Number(dictionaryId);
            return (
              <Card key={dictionaryId} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <CardHeader>
                  <CardTitle>
                    <DictionaryCodeDisplay id={dictId} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Dictionary name:</h3>
                      <DictionaryNameFloatingInput id={dictId} locale="en" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Dictionary type:</h3>
                      <DictionaryCodeInput id={dictId} />
                    </div>

                    <Separator className="my-4" />

                    {/* Dictionary entries */}
                    {entries[dictId] &&
                      Object.entries(entries[dictId]).map(([entryId]) => {
                        const entId = Number(entryId);
                        return (
                          <Card key={entryId} className="mb-4">
                            <CardHeader className="py-2">
                              <CardTitle className="text-sm">
                                <DictionaryEntryNameDisplay dictionaryId={dictId} entryId={entId} locale="en" />
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-3">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="mb-1 text-xs font-medium">Code:</h4>
                                  <DictionaryEntryCodeInput dictionaryId={dictId} entryId={entId} />
                                </div>
                                <div>
                                  <h4 className="mb-1 text-xs font-medium">Name:</h4>
                                  <DictionaryEntryNameFloatingInput dictionaryId={dictId} entryId={entId} locale="en" />
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

        <DebugCard label="All Dictionaries & Entries" json={{ dictionaries, entries, storeState: store.getState() }} />
      </div>
    </DictionaryStoreProvider>
  );
}
