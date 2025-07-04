import { getDomainProperties, getDomain, DomainEditor } from "@cms/modules/domain-editor";

export default async function DomainEditorPage({ params }: { params: Promise<{ domain_id: string }> }) {
  console.log("DomainEditorPage >>>");
  const { domain_id } = await params;
  const propertiesPromise = getDomainProperties(domain_id);
  const domainPromise = getDomain(domain_id);

  return (
    <div>
      <DomainEditor domain_id={domain_id} propertiesPromise={propertiesPromise} domainPromise={domainPromise} />
    </div>
  );
}
