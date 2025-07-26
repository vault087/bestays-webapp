import { loadDictionaries } from "@/entities/dictionaries/libs/dictionaries";
import { loadEntries } from "@/entities/dictionaries/libs/entries";
import { loadDashboardPropertyListings, DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";
import PropertyListingPageContent from "./properties_listing";

export default async function PropertiesListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

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
