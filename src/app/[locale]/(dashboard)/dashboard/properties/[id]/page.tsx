import { notFound } from "next/navigation";
import { Suspense } from "react";
import LoadingScreen from "@/components/loading-screen";
import { loadDictionaries } from "@/entities/dictionaries/libs/dictionaries";
import { loadEntries } from "@/entities/dictionaries/libs/entries";
import { MutableProperty } from "@/entities/properties-sale-rent/features/form/types/mutable-property.types";
import { loadDashboardPropertyDetails } from "@/entities/properties-sale-rent/libs/load-properties";
import PropertiesPageClient from "./page.client";

// Separate async component for data loading
async function PropertyDataLoader({ id }: { id: string }) {
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
    <PropertiesPageClient property={property} dictionaries={dbDictionaries.data || []} entries={dbEntries.data || []} />
  );
}

export default async function PropertiesSellRentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<LoadingScreen message="Loading property details..." />}>
      <PropertyDataLoader id={id} />
    </Suspense>
  );
}
