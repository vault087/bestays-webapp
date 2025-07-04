"use client";

import React, { useState } from "react";
import {
  createStandaloneDictionaryStore,
  DictionaryStoreProvider,
  DictionaryTypeInput,
  DictionaryTypeDisplay,
  DictionaryNameFloatingInput,
  DictionaryNameDisplay,
  DictionaryEntryCodeInput,
  DictionaryEntryNameFloatingInput,
  DictionaryEntryNameDisplay,
} from "@/entities/dictionaries";
import { mockDictionaries, mockEntries } from "@/entities/dictionaries/mocks/dictionary-mock-data";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shadcn/components/ui/card";

export default function DictionariesPage() {
  // Create a store with mock data
  const store = React.useMemo(() => createStandaloneDictionaryStore(mockDictionaries, mockEntries), []);

  // State for selected dictionary and entry
  const [selectedDictionaryId, setSelectedDictionaryId] = useState<number>(1);
  const [selectedEntryId, setSelectedEntryId] = useState<number>(101);
  const [activeLocale, setActiveLocale] = useState<string>("en");
  const [activeView, setActiveView] = useState<"dictionaries" | "entries">("dictionaries");

  // Available locales
  const locales = ["en", "th", "ru"];

  return (
    <DictionaryStoreProvider store={store}>
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Dictionary System Demo</h1>

        <div className="mb-6 flex gap-4">
          <Button
            variant={activeView === "dictionaries" ? "default" : "outline"}
            onClick={() => setActiveView("dictionaries")}
          >
            Dictionaries
          </Button>
          <Button variant={activeView === "entries" ? "default" : "outline"} onClick={() => setActiveView("entries")}>
            Dictionary Entries
          </Button>
        </div>

        {activeView === "dictionaries" ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Dictionary Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  {Object.keys(mockDictionaries).map((id) => (
                    <Button
                      key={id}
                      variant={selectedDictionaryId === Number(id) ? "default" : "outline"}
                      onClick={() => setSelectedDictionaryId(Number(id))}
                    >
                      {mockDictionaries[Number(id)].type}
                    </Button>
                  ))}
                </div>
                <div className="text-sm text-gray-500">Selected Dictionary ID: {selectedDictionaryId}</div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-6">
              <Card className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <CardHeader>
                  <CardTitle>Dictionary Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Input:</h3>
                    <DictionaryTypeInput id={selectedDictionaryId} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Display:</h3>
                    <DictionaryTypeDisplay id={selectedDictionaryId} />
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <CardHeader>
                  <CardTitle>Dictionary Name</CardTitle>
                  <div className="flex gap-2">
                    {locales.map((locale) => (
                      <Button
                        key={locale}
                        size="sm"
                        variant={activeLocale === locale ? "default" : "outline"}
                        onClick={() => setActiveLocale(locale)}
                      >
                        {locale.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Input:</h3>
                    <DictionaryNameFloatingInput id={selectedDictionaryId} locale={activeLocale} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Display:</h3>
                    <DictionaryNameDisplay id={selectedDictionaryId} locale={activeLocale} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Entry Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-medium">Dictionary:</h3>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {Object.keys(mockDictionaries).map((id) => (
                      <Button
                        key={id}
                        variant={selectedDictionaryId === Number(id) ? "default" : "outline"}
                        onClick={() => {
                          setSelectedDictionaryId(Number(id));
                          // Reset entry selection when dictionary changes
                          if (mockEntries[Number(id)]) {
                            setSelectedEntryId(Number(Object.keys(mockEntries[Number(id)])[0]));
                          }
                        }}
                      >
                        {mockDictionaries[Number(id)].type}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">Entry:</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockEntries[selectedDictionaryId] &&
                      Object.keys(mockEntries[selectedDictionaryId]).map((entryId) => (
                        <Button
                          key={entryId}
                          variant={selectedEntryId === Number(entryId) ? "default" : "outline"}
                          onClick={() => setSelectedEntryId(Number(entryId))}
                        >
                          {mockEntries[selectedDictionaryId][Number(entryId)].code}
                        </Button>
                      ))}
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Selected Dictionary ID: {selectedDictionaryId}, Entry ID: {selectedEntryId}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-6">
              <Card className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <CardHeader>
                  <CardTitle>Entry Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Input:</h3>
                    <DictionaryEntryCodeInput dictionaryId={selectedDictionaryId} entryId={selectedEntryId} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Display:</h3>
                    <div className="rounded border p-2">
                      {mockEntries[selectedDictionaryId]?.[selectedEntryId]?.code || "No code"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <CardHeader>
                  <CardTitle>Entry Name</CardTitle>
                  <div className="flex gap-2">
                    {locales.map((locale) => (
                      <Button
                        key={locale}
                        size="sm"
                        variant={activeLocale === locale ? "default" : "outline"}
                        onClick={() => setActiveLocale(locale)}
                      >
                        {locale.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Input:</h3>
                    <DictionaryEntryNameFloatingInput
                      dictionaryId={selectedDictionaryId}
                      entryId={selectedEntryId}
                      locale={activeLocale}
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Display:</h3>
                    <DictionaryEntryNameDisplay
                      dictionaryId={selectedDictionaryId}
                      entryId={selectedEntryId}
                      locale={activeLocale}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DictionaryStoreProvider>
  );
}
