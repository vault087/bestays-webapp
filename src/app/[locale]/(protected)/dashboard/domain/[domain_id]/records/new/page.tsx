import { getDomainProperties } from "@cms/modules/properties/property.libs";
import EditRecordForm from "@cms/modules/records/components/edit-record-form";
import { Value } from "@cms/modules/values/value.types";

export default async function NewRecordPage({ params }: { params: Promise<{ domain_id: string }> }) {
  const { domain_id } = await params;
  const record = null;
  const formProperties = await getDomainProperties(domain_id);

  const formValues: Value[] = [];

  return (
    <div>
      <EditRecordForm
        domainId={domain_id}
        recordId={null}
        record={record}
        properties={formProperties}
        values={formValues}
      />
    </div>
  );
}
