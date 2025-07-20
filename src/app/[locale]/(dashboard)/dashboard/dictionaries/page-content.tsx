"use client";

import { PlusCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { memo, useMemo } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import {
  DictionaryCodeInput,
  DictionaryNameInput,
  DictionaryEntryNameInput,
  DictionaryDescriptionInput,
  DBDictionary,
  DBDictionaryEntry,
  useDictionaryFormStore,
} from "@/entities/dictionaries";
import { DictionaryMetaInfoInput } from "@/entities/dictionaries/features/form/components/dictionary-meta-info";
import { createDictionaryFormStore, useDictionaryFormStoreActions } from "@/entities/dictionaries/features/form/store";
import {
  DictionaryFormStoreHydrated,
  DictionaryFormStoreProvider,
} from "@/entities/dictionaries/features/form/store/dictionary-form.store.provider";
import { Button, Card, CardContent, CardHeader, CardTitle, Separator } from "@/modules/shadcn/";

// Define props for the client component
interface DictionariesPageContentProps {
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
}

export function ReactiveDebugCard() {
  const dictionaries = useDictionaryFormStore((state) => state.dictionaries);
  const entries = useDictionaryFormStore((state) => state.entries);

  return <DebugCard label="Error State Debug" json={{ dictionaries, entries }} />;
}

export default function DictionariesPageContent({ dictionaries, entries }: DictionariesPageContentProps) {
  // Create store with the resolved data
  const store = useMemo(() => createDictionaryFormStore(dictionaries, entries), [dictionaries, entries]);

  // Function to handle adding a new dictionary
  const handleAddDictionary = () => {
    store.getState().addDictionary({ en: `New Dictionary` });
  };

  console.log("DictionariesPageContent rendered");
  return (
    <DictionaryFormStoreProvider store={store}>
      <div className="flex gap-6 p-4">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-bold">Settings</h1>

          <div className="w-">
            <DictionaryFormStoreHydrated fallback={<div>Loading...</div>}>
              <DictionaryCanvas />
            </DictionaryFormStoreHydrated>
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" className="px-8" onClick={handleAddDictionary}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add new MutableDictionary
            </Button>
          </div>
        </div>

        {/* <ReactiveDebugCard /> */}
      </div>
    </DictionaryFormStoreProvider>
  );
}

const DictionaryCanvas = () => {
  const { addEntry } = useDictionaryFormStoreActions();
  const dictionaryIDs = useDictionaryFormStore((state) => state.dictionaryIds);
  const locale = useLocale();

  const handleAddEntry = (dictionaryId: number) => {
    addEntry(dictionaryId, { en: `New Entry` });
  };

  const showCode = true;

  return (
    <div className="flex w-full flex-wrap gap-4">
      {dictionaryIDs?.map((dictId) => {
        return (
          <Card key={dictId} className="w-full gap-1 md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
            <CardHeader>
              <CardTitle className="font-open-sans text-2xl font-light tracking-tight">Dictionary {dictId}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {showCode && <DictionaryCodeInput id={dictId} />}
                <DictionaryNameInput id={dictId} locale={locale} />
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
  const entriesIds = useDictionaryFormStore((state) => {
    return Object.keys(state.entries[dictionaryId]).map(Number);
  });

  return (
    <div className="flex flex-col space-y-4">
      {entriesIds &&
        entriesIds.map((entryId) => {
          return (
            <div key={entryId}>
              <DictionaryEntryNameInput dictionaryId={dictionaryId} entryId={entryId} locale={locale} />
            </div>
          );
        })}
    </div>
  );
});

EntriesList.displayName = "EntriesList";
