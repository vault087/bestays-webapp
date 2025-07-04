"use server";

import { ZodError } from "zod";
import { createDomain } from "@cms-data/modules/domains/domain.libs";
import { NewDomainState } from "@cms/modules/domains/components/new-domain.types";
import { Domain } from "@cms/modules/domains/domain.types";
import { convertFormDataToNewDomain } from "@cms/modules/domains/domain.utils";

export async function createDomainAction(formState: NewDomainState, formData: FormData): Promise<NewDomainState> {
  let error: string | null = null;
  let domain: Domain | null = null;

  try {
    // Convert FormData to NewDomain (without id)
    const newDomain = await convertFormDataToNewDomain(formData);

    // Create domain in database
    const result = await createDomain(newDomain);
    if (!result) {
      throw new Error("Failed to create domain");
    }
    domain = result;
  } catch (err) {
    if (err instanceof ZodError) {
      error = err.message;
    } else if (err instanceof Error) {
      error = err.message;
    } else {
      error = "Invalid data";
    }
  }

  return {
    domain: domain,
    error: error,
  };
}
