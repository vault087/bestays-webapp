import { Suspense } from "react";
import { getPropertiesAction } from "@/entities/properties-sale-rent";
import PropertiesSellRentPageContent from "./page-content";

export default function PropertiesSellRentPage() {
  // Create the promise but don't await it
  const propertiesPromise = getPropertiesAction();

  // Pass the promise directly to the client component
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesSellRentPageContent propertiesPromise={propertiesPromise} />
    </Suspense>
  );
}
