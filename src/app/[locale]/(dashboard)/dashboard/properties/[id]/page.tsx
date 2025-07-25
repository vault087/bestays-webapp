import { loadDictionaries, loadEntries } from "@/entities/dictionaries/libs";
import { MutableProperty } from "@/entities/properties-sale-rent/features/form/types/mutable-property.types";
import { loadDashboardPropertyDetails } from "@/entities/properties-sale-rent/libs/load-properties";
import PropertiesPageClient from "./page.client";

export default async function PropertiesSellRentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log("id", id);
  const [dbProperties, dbDictionaries, dbEntries] = await Promise.all([
    loadDashboardPropertyDetails(id),
    loadDictionaries(),
    loadEntries(),
  ]);

  const properties: MutableProperty[] = dbProperties.data.map((property) => ({
    // id: property.id.toString() || "",
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
