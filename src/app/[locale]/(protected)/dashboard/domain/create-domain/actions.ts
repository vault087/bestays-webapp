"use server";

import { redirect } from "next/navigation";
import { createDomainAction } from "@cms/modules/domains/actions/create-domain.actions";
import { NewDomainState } from "@cms/modules/domains/components/new-domain.types";

export async function createDomain(formState: NewDomainState, formData: FormData): Promise<NewDomainState> {
  const newState = await createDomainAction(formState, formData);

  if (!newState.error && newState.domain) {
    redirect(`/dashboard/domain/${newState.domain.id}`);
  }

  return {
    domain: newState.domain,
    error: newState.error,
  };
}
