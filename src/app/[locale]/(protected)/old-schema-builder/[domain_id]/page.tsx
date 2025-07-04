import { getTranslations } from "@/modules/i18n/libs/get-translations";
import { getDomainProperties, getDomain, DomainEditor } from "@cms/modules/domain-editor";

export default async function SchemBuilderPage({ params }: { params: Promise<{ domain_id: string }> }) {
  const { domain_id } = await params;
  const { t } = await getTranslations({ subNamespace: "schema_builder" });
  console.log("SchemaBuilderPage rendering>>>");
  return (
    <div className="flex h-dvh flex-col">
      <h1>{t("pageName")}</h1>
      <DomainEditor
        key={domain_id}
        domain_id={domain_id}
        propertiesPromise={getDomainProperties(domain_id)}
        domainPromise={getDomain(domain_id)}
      />
    </div>
  );
}
