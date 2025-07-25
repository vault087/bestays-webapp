import { loadDictionaries, loadEntries } from "@/entities/dictionaries/libs";
import { loadDashboardPropertyListings } from "@/entities/properties-sale-rent/libs/load-properties";

export default async function PropertiesListingPage() {
  const [listings, dbDictionaries, dbEntries] = await Promise.all([
    loadDashboardPropertyListings(),
    loadDictionaries(),
    loadEntries(),
  ]);

  console.log("data:", listings.data);
  console.log("error:", listings.error);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full flex-col gap-4 pt-4">
        <div className="flex w-full flex-row items-center justify-between px-6">
          <h1 className="text-xl font-bold">Listings</h1>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 pt-4">
        {listings.data &&
          listings.data.length > 0 &&
          listings.data.map((listing) => (
            <div key={listing.id} className="flex flex-row items-center justify-between space-x-2">
              <h2>Title: {listing.personal_title}</h2>
              <p>Property Type: {listing.property_type}</p>
              <p>Area: {listing.area}</p>
              <p>Rent Price: {listing.rent_price}</p>
              <p>Sale Price: {listing.sale_price}</p>
              <p>Sale Enabled: {listing.sale_enabled}</p>
              <p>Rent Enabled: {listing.rent_enabled}</p>
              <p>Cover Image: {listing.cover_image}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
