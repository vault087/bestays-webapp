"use server";

import { redirect } from "next/navigation";
import { updateDomainAction } from "@cms/modules/domains/actions/edit-domain.actions";
import { EditDomainFormState } from "@cms/modules/domains/components/edit-domain.types";

export async function updateDomain(
  previousState: EditDomainFormState,
  formData: FormData,
): Promise<EditDomainFormState> {
  const result = await updateDomainAction(previousState, formData);

  if (!result.error && result.formData) {
    redirect(`/dashboard/domain/${result.formData.id}`);
  }

  return result;
}
