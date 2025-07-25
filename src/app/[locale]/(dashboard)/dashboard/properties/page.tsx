import { loadDictionaries, loadEntries } from "@/entities/dictionaries/libs";
import { PropertyListing } from "@/entities/properties-sale-rent/features/listing";
import { loadDashboardPropertyListings, DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";

export default async function PropertiesListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const [listings, dbDictionaries, dbEntries] = await Promise.all([
    loadDashboardPropertyListings(),
    loadDictionaries(),
    loadEntries(),
  ]);

  if (listings.error) {
    console.error("Error loading properties:", listings.error);
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-destructive text-xl font-bold">Error loading properties</h1>
        <p className="text-muted-foreground">{listings.error}</p>
      </div>
    );
  }

  if (dbDictionaries.error) {
    console.error("Error loading dictionaries:", dbDictionaries.error);
  }

  if (dbEntries.error) {
    console.error("Error loading entries:", dbEntries.error);
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full flex-col gap-4 pt-4">
        <div className="flex w-full flex-row items-center justify-between px-6">
          <h1 className="text-xl font-bold">Property Listings</h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-4">
        <PropertyListing
          properties={(listings.data as DashboardProperty[]) || []}
          dictionaries={dbDictionaries.data || []}
          entries={dbEntries.data || []}
          locale={locale}
        />
      </div>
    </div>
  );
}
