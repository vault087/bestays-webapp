"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";
import { LOCALES } from "@/modules/i18n/locales";
import { CMSTranslationContextProvider } from "@cms/i18n";
import { CanvasStoreProvider, CanvasStoreHydrated } from "@cms/modules/domain-editor/stores/";
import { CustomLocaleProvider } from "@cms/modules/localization/hooks/use-custom-locale";
import type { FormProperty } from "@cms/modules/properties/form";
import {
  CodeInput,
  DescriptionDisplay,
  DescriptionFloatingInput,
  MetaOptionMultiToggle,
  MetaOptionSortingToggle,
  NameDisplay,
  NameFloatingInput,
  NameInput,
  PropertyStoreProvider,
  PropertyIdProvider,
  usePropertyId,
  usePropertyStore,
  useProperty,
  MetaNumberMinInput,
  MetaNumberMaxInput,
  MetaNumberIntegerToggle,
  TypeSelector,
  getDefaultMeta,
  IsLockedToggleButton,
  IsPrivateToggleButton,
  IsRequiredToggleButton,
  MetaTextMaxInput,
  MetaTextMultilineToggle,
} from "@cms/modules/properties/form";
import { Property } from "@cms/modules/properties/property.types";
import { PageStoreProvider, usePageStore } from "./page-store.context";

const MOCK_PROPERTY_ID = "mock-property-1";

export default function Page() {
  const locale = useLocale();
  const domain_id = "mock-domain-1";

  const properties: Property[] = [
    {
      id: MOCK_PROPERTY_ID,
      code: "DEMO123",
      name: { en: "Demo Property", ru: "Тестовое Свойство", th: "สมมติสินค้า" },
      description: { en: "Demo Property Description", ru: "Тестовое Свойство Описание", th: "สมมติสินค้าเป็นภาษาไทย" },
      is_locked: false,
      is_new: false,
      is_private: false,
      is_required: false,
      type: "text",
      meta: getDefaultMeta("text"),
      options: [],
      display_order: 0,
    },
  ];

  return (
    <CMSTranslationContextProvider namespace="domain_editor">
      <CanvasStoreProvider domainId={domain_id} locale={locale} initialProperties={properties}>
        <PageStoreProvider>
          <PageContent
            properties={Object.fromEntries(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              properties.map(({ display_order, options, ...formProperty }) => [formProperty.id, formProperty]),
            )}
          />
        </PageStoreProvider>
      </CanvasStoreProvider>
    </CMSTranslationContextProvider>
  );
}

function PageContent({ properties }: { properties: Record<string, FormProperty> }) {
  // Use the page store from context instead of creating our own
  const pageStore = usePageStore();

  // Initialize the store with our mock properties
  useEffect(() => {
    pageStore.setState({ properties });
  }, [pageStore, properties]);

  return (
    <CanvasStoreHydrated fallback={<div>Loading...</div>}>
      <PropertyStoreProvider store={pageStore}>
        <PropertyIdProvider propertyId={MOCK_PROPERTY_ID}>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col space-y-4 p-4">
              <h2 className="text-lg font-bold">Property Form Components Demo</h2>
              <CodeInput />
              <Names />
              <PropertyDescription />
              <div className="flex flex-row items-center space-x-2">
                <span className="text-sm font-bold">Property Type Selector</span>
                <TypeSelector />
                <div className="flex flex-row items-center space-x-2">
                  <TypeMeta />
                </div>
              </div>

              <div className="flex flex-row items-center space-x-2">
                <span className="text-sm font-bold">Property Lock Toggle Button</span>
                <IsLockedToggleButton />
                <IsLockedToggleButton />
              </div>

              <div className="flex flex-row items-center space-x-2">
                <span className="text-sm font-bold">Property Private Toggle Button</span>
                <IsPrivateToggleButton />
                <IsPrivateToggleButton />
              </div>

              <div className="flex flex-row items-center space-x-2">
                <span className="text-sm font-bold">Property Required Toggle Button</span>
                <IsRequiredToggleButton />
                <IsRequiredToggleButton />
              </div>
            </div>
            <PropertyDebug />
          </div>
        </PropertyIdProvider>
      </PropertyStoreProvider>
    </CanvasStoreHydrated>
  );
}

function TypeMeta() {
  const propertyType = useProperty((property) => property.type);

  return (
    <>
      {propertyType === "number" && (
        <>
          <MetaNumberIntegerToggle />
          <MetaNumberMinInput />
          <MetaNumberMaxInput />
        </>
      )}
      {propertyType === "text" && (
        <>
          <MetaTextMultilineToggle />
          <MetaTextMaxInput />
        </>
      )}

      {propertyType === "option" && (
        <>
          <MetaOptionMultiToggle />
          <MetaOptionSortingToggle />
        </>
      )}
    </>
  );
}
function PropertyDebug() {
  const propertyId = usePropertyId();
  const allProperties = usePropertyStore((state) => state.properties);
  const property = allProperties[propertyId];

  // const allProperties =  Object.keys(state.properties)
  // Combine for debug display (not for Zustand selector)
  const storeData = { propertyId, allProperties: Object.keys(allProperties), property };

  return (
    <div>
      <pre>{JSON.stringify(storeData, null, 2)}</pre>
    </div>
  );
}

function Names() {
  return (
    <>
      <Localized title="Property Name Components">
        <NameInput />
        <NameFloatingInput />
        <NameDisplay />
      </Localized>
    </>
  );
}

function PropertyDescription() {
  return (
    <>
      <Localized title="Property Description Components">
        <DescriptionFloatingInput />
        <DescriptionDisplay />
      </Localized>
    </>
  );
}

function Localized({ title, children }: { title: string; children: React.ReactNode }) {
  const locales: string[] = LOCALES;
  return (
    <div className="flex flex-col space-y-2 py-2">
      <span className="text-sm font-bold uppercase">{title}</span>
      <div className="flex flex-row space-x-4">
        {locales.map((locale) => (
          <div key={locale} className="flex flex-row space-y-2">
            <CustomLocaleProvider customLocale={locale}>
              <div>
                <span className="text-sm font-bold uppercase">{locale}</span>
                {children}
              </div>
            </CustomLocaleProvider>
          </div>
        ))}
      </div>
    </div>
  );
}
