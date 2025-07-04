import { notFound } from "next/navigation";
import { getBaseDomain } from "@cms-data/modules/domains/domain.libs";
import EditDomainForm from "@cms/modules/domains/components/edit-domain-form";
import { Domain } from "@cms/modules/domains/domain.types";
import { updateDomain } from './actions';

export default async function EditDomainPage({ params }: { params: Promise<{ domain_id: string }> }) {
  const { domain_id } = await params;

  let domain: Domain;
  try {
    domain = await getBaseDomain(domain_id);
  } catch (error) {
    console.error("Domain not found:", error);
    notFound();
  }

  return (
    <div>
      <EditDomainForm formData={domain} serverAction={updateDomain} />
    </div>
  );
}
