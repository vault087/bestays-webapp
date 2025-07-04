import { getDomainProperties } from "@cms/modules/properties/property.libs";
import EditRecordForm from "@cms/modules/records/components/edit-record-form";
import { Value } from "@cms/modules/values/value.types";

export default async function RecordPage({ params }: { params: Promise<{ domain_id: string; recordId: string }> }) {
  const { domain_id, recordId } = await params;
  const record = null;
  const formProperties = await getDomainProperties(domain_id);

  const formValues: Value[] = [];
  console.log("domain_id", domain_id);
  console.log("recordId", recordId);
  console.log("formProperties", formProperties);
  console.log("formValues", formValues);
  return (
    <div>
      <EditRecordForm
        domainId={domain_id}
        recordId={recordId}
        record={record}
        properties={formProperties}
        values={formValues}
      />
    </div>
  );
}
