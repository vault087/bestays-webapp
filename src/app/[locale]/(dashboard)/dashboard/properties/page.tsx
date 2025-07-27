import { Suspense } from "react";
import LoadingScreen from "@/components/loading-screen";
import { loadDictionaries } from "@/entities/dictionaries/libs/dictionaries";
import { loadEntries } from "@/entities/dictionaries/libs/entries";
import { loadDashboardPropertyListings, DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";
import PropertyListingPageContent from "./properties_listing";

// Separate async component for data loading
async function PropertiesDataLoader({ locale }: { locale: string }) {
  const [listings, dbDictionaries, dbEntries] = await Promise.all([
    loadDashboardPropertyListings(),
    loadDictionaries(),
    loadEntries(),
  ]);

  if (dbDictionaries.error) {
    console.error("Error loading dictionaries:", dbDictionaries.error);
  }

  if (dbEntries.error) {
    console.error("Error loading entries:", dbEntries.error);
  }

  return (
    <PropertyListingPageContent
      dictionaries={dbDictionaries.data || []}
      entries={dbEntries.data || []}
      locale={locale}
      properties={listings as DashboardProperty[]}
    />
  );
}

export default async function PropertiesListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <Suspense fallback={<LoadingScreen message="Loading properties..." />}>
      <PropertiesDataLoader locale={locale} />
    </Suspense>
  );
}
