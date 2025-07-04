"use client";

import { useActionState } from "react";
import { DebugCard } from "@/packages/shared-ui/components/ui/debug-json-card";
import { Domain } from "@cms/modules/domains/domain.types";
import LocalizedTextField from "@cms/modules/localization/components/localized-text-field";
import { NewDomainProvider, useNewDomainContext } from './new-domain.context';
import { NewDomainState } from './new-domain.types';

type Props = {
  serverAction: (formState: NewDomainState, formData: FormData) => Promise<NewDomainState>;
};

export default function NewDomainForm({ serverAction }: Props) {
  const [formState, formAction] = useActionState(serverAction, {
    domain: null,
    error: null,
  } as NewDomainState);

  return (
    <div className="relative flex flex-col bg-slate-100 p-4">
      <NewDomainProvider>
        {/* Toolbar floats outside normal flow */}
        <div className="sticky top-0 z-50 flex flex-row items-start justify-between bg-slate-100 pt-2">
          <h1 className="ml-4 text-2xl font-bold">Create Domain</h1>

          {/* Fade mask */}
          <div className="pointer-events-none absolute inset-x-0 top-full h-3 bg-gradient-to-b from-slate-100 to-transparent"></div>
        </div>

        <div className="relative z-10 mt-2">
          <form action={formAction} className="flex flex-col space-y-4">
            <NewDomainFormContent domain={formState.domain} />

            <button type="submit" className="cta-primary mt-4">
              Create Domain
            </button>
          </form>
        </div>

        {formState.error && (
          <div className="mt-4 rounded-md bg-red-100 p-4 text-red-700">
            <p className="font-semibold">Error:</p>
            <p>{formState.error}</p>
          </div>
        )}

        <DebugCard label="deferredFormState: NewDomainState" json={formState} />
      </NewDomainProvider>
    </div>
  );
}

function NewDomainFormContent({ domain }: { domain: Domain | null }) {
  const { isDevMode } = useNewDomainContext();

  return (
    <div className="flex flex-col items-start justify-between">
      <div className="flex flex-col items-start justify-start space-x-4 rounded-lg bg-zinc-200 px-4 py-4 shadow-md ring-1 ring-zinc-200">
        <div className="flex w-full flex-col items-start justify-start gap-2">
          {/* Domain Name */}
          <div className="w-full">
            <label className="text-lg font-bold">Name:</label>
            <LocalizedTextField localizedText={domain?.name ?? {}} prefix="name" placeholder="Enter domain name" />
          </div>

          {/* Basic Fields */}
          <div className={`flex flex-col gap-2 ${!isDevMode ? "hidden" : ""}`}>
            <label htmlFor="code">Domain Code</label>
            <input
              type="text"
              name="code"
              defaultValue={domain?.code ?? ""}
              placeholder="Enter domain code"
              className="w-full border-b border-b-zinc-300"
            />
          </div>

          <div className={`flex flex-col gap-2 ${!isDevMode ? "hidden" : ""}`}>
            <label htmlFor="system_description">System Description</label>
            <input
              type="text"
              name="system_description"
              defaultValue={domain?.meta?.system_description ?? ""}
              placeholder="Enter system description"
              className="w-full border-b border-b-zinc-300"
            />
          </div>

          <div className={`flex flex-row gap-2 ${!isDevMode ? "hidden" : ""}`}>
            <label htmlFor="display_order">Display Order</label>
            <input
              type="number"
              name="display_order"
              defaultValue={domain?.display_order ?? 0}
              className="border-b border-b-zinc-300"
            />
          </div>

          <div className={`flex flex-row justify-start gap-4 ${!isDevMode ? "hidden" : ""}`}>
            <div className="flex flex-row gap-2">
              <label htmlFor="is_active">Active</label>
              <input type="checkbox" name="is_active" defaultChecked={domain?.is_active ?? false} />
            </div>
            <div className="flex flex-row gap-2">
              <label htmlFor="is_locked">Locked</label>
              <input type="checkbox" name="is_locked" defaultChecked={domain?.is_locked ?? false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
