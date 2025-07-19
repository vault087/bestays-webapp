import { loadDictionaries, loadEntries } from "@/entities/dictionaries/libs";
import { loadPropertyDetails } from "@/entities/properties-sale-rent/libs/load-properties";
import { MutableProperty } from "@/entities/properties-sale-rent/features/form/types/mutable-property.types";
import PropertiesPageClient from "./page.client";

export default async function PropertiesSellRentPage() {
  const [dbProperties, dbDictionaries, dbEntries] = await Promise.all([
    loadPropertyDetails(),
    loadDictionaries(),
    loadEntries(),
  ]);

  const properties: MutableProperty[] = dbProperties.data.map((property) => ({
    id: property.id || "",
    is_published: property.is_published || false,
    ...property,
    is_new: false,
  }));

  return (
    <div>
      <PropertiesPageClient
        properties={properties}
        dictionaries={dbDictionaries.data || []}
        entries={dbEntries.data || []}
      />
    </div>
  );
}
