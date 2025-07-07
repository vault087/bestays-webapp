import { Suspense } from "react";
import { getDictionariesAction } from "@/entities/dictionaries/actions";
import { getPropertiesAction } from "@/entities/properties-sale-rent/actions";
import PropertiesSellRentPageContent from "./page-content";

export default function PropertiesSellRentPage() {
  // Create both promises but don't await them
  const propertiesPromise = getPropertiesAction();
  const dictionariesPromise = getDictionariesAction();

  // Pass both promises directly to the client component
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesSellRentPageContent propertiesPromise={propertiesPromise} dictionariesPromise={dictionariesPromise} />
    </Suspense>
  );
}
