import { notFound } from "next/navigation";
import { loadDictionaries } from "@/entities/dictionaries/libs/dictionaries";
import { loadEntries } from "@/entities/dictionaries/libs/entries";
import { MutableProperty } from "@/entities/properties-sale-rent/features/form/types/mutable-property.types";
import { loadDashboardPropertyDetails } from "@/entities/properties-sale-rent/libs/load-properties";
import PropertiesPageClient from "./page.client";

export default async function PropertiesSellRentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [propertyResponse, dbDictionaries, dbEntries] = await Promise.all([
    loadDashboardPropertyDetails(id),
    loadDictionaries(),
    loadEntries(),
  ]);

  if (!propertyResponse.data) {
    return notFound();
  }

  const property: MutableProperty = {
    ...propertyResponse.data,
    is_new: false,
  };

  return (
    <div>
      <PropertiesPageClient
        property={property}
        dictionaries={dbDictionaries.data || []}
        entries={dbEntries.data || []}
      />
    </div>
  );
}
