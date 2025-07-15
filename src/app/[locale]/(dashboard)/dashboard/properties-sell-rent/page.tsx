import { loadDictionaries } from "@/entities/dictionaries/libs";
import { DictionaryEntry, Dictionary } from "@/entities/dictionaries/types/dictionary.types";
import { loadPropertyDetails } from "@/entities/properties-sale-rent/features/edit/libs/load-properties";
import { Property } from "@/entities/properties-sale-rent/features/edit/types/property-field.types";
import PropertiesPageClient from "./page.client";

export default async function PropertiesSellRentPage() {
  const dbProperties = await loadPropertyDetails();
  const dbDictionaries = await loadDictionaries();

  const properties: Property[] = dbProperties.data.map((property) => ({
    id: property.id || "",
    is_published: property.is_published || false,
    ...property,
    is_new: false,
  }));

  const dictionaries: Dictionary[] = dbDictionaries.dictionaries.map((dictionary) => ({
    ...dictionary,
    is_new: false,
  }));
  const entries: DictionaryEntry[] = dbDictionaries.entries.map((entry) => ({
    ...entry,
    is_new: false,
  }));

  return (
    <div>
      <PropertiesPageClient properties={properties} dictionaries={dictionaries} entries={entries} />
    </div>
  );
}
