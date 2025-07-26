"use client";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import DashboardNavBarComponent from "@/components/dashboard-nav-bar/dashboard-nav-bar";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { PropertyListing } from "@/entities/properties-sale-rent/features/listing";
import { createNewProperty } from "@/entities/properties-sale-rent/libs/actions/property";
import { DashboardProperty } from "@/entities/properties-sale-rent/libs/load-properties";
import { Button } from "@/modules/shadcn/components/ui/button";

export default function PropertyListingPageContent({
  dictionaries,
  entries,
  locale,
  properties,
}: {
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  locale: string;
  properties: DashboardProperty[];
}) {
  const t = useTranslations("Properties");
  const handleAddProperty = async () => {
    const response = await createNewProperty();
    if (response.error) {
      console.error("Error adding property:", response.error);
    }
    const propertyId = response.data?.id;
    if (propertyId) {
      redirect(`/dashboard/properties/${propertyId}`);
    }
  };
  return (
    <div className="flex h-full w-full flex-col">
      <DashboardNavBarComponent />
      <div className="flex w-full flex-col gap-4 pt-4">
        <div className="flex w-full flex-row items-center justify-between px-6">
          <h1 className="text-xl font-bold">{t("title")}</h1>
          <Button onClick={handleAddProperty} variant="outline">
            {t("add_property")}
          </Button>
        </div>
      </div>

      <div className="mt-8 flex-1 px-6 py-4">
        <PropertyListing
          properties={(properties as DashboardProperty[]) || []}
          dictionaries={dictionaries}
          entries={entries}
          locale={locale}
        />
      </div>
    </div>
  );
}
