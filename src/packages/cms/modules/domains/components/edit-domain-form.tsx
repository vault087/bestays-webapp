"use client";

import { useActionState } from "react";
import { DebugCard } from "@/packages/shared-ui/components/ui/debug-json-card";
import { Domain } from "@cms/modules/domains/domain.types";
import LocalizedTextField from "@cms/modules/localization/components/localized-text-field";
import { EditDomainToolbar } from './edit-domain-toolbar';
import { EditDomainProvider, useEditDomainContext } from './edit-domain.context';
import { EditDomainFormState } from './edit-domain.types';

export default function EditDomainForm({
  formData,
  serverAction,
}: {
  formData: Domain;
  serverAction: (formState: EditDomainFormState, formData: FormData) => Promise<EditDomainFormState>;
}) {
  return (
    <EditDomainProvider>
      <EditDomainFormContent formData={formData} serverAction={serverAction} />
    </EditDomainProvider>
  );
}

function EditDomainFormContent({
  formData,
  serverAction,
}: {
  formData: Domain;
  serverAction: (formState: EditDomainFormState, formData: FormData) => Promise<EditDomainFormState>;
}) {
  const { isDevMode } = useEditDomainContext();
  const [state, formAction, isPending] = useActionState(serverAction, {
    formData: formData,
    error: null,
  } as EditDomainFormState);

  // Use the original formData if state.formData is null (error case)
  const currentFormData = state.formData || formData;

  return (
    <div className="relative flex flex-col bg-slate-100 p-4">
      {/* Toolbar floats outside normal flow - can stick independently */}
      <div className="sticky top-0 z-50 flex flex-row items-start justify-between bg-slate-100 pt-2">
        <h1 className="ml-4 text-2xl font-bold">Edit Schema</h1>
        <EditDomainToolbar />
        {/* Fade mask - positioned absolutely under the toolbar */}
        <div className="pointer-events-none absolute inset-x-0 top-full h-3 bg-gradient-to-b from-slate-100 to-transparent"></div>
      </div>

      <div className="z-10 mx-auto mt-2 min-w-sm rounded-xl bg-zinc-200 p-4">
        <form action={formAction} className="flex flex-col space-y-4">
          <input type="hidden" name="id" value={currentFormData.id} />
          <div>
            <span className="text-lg font-bold">Name:</span>
            <LocalizedTextField
              localizedText={currentFormData?.name ?? {}}
              prefix="name"
              placeholder="Enter domain name"
            />
          </div>
          <div className={`flex flex-col gap-2 ${!isDevMode ? "hidden" : ""}`}>
            <label htmlFor="code">Domain Code</label>
            <input
              type="text"
              name="code"
              defaultValue={currentFormData?.code as string}
              placeholder="Enter domain code"
            />
          </div>
          <div className={`flex flex-col gap-2 ${!isDevMode ? "hidden" : ""}`}>
            <label htmlFor="system_description">System Description</label>
            <input
              type="text"
              name="system_description"
              defaultValue={currentFormData?.meta?.system_description ?? ""}
              placeholder="Enter system description"
            />
          </div>
          <div className={`flex flex-row gap-2 ${!isDevMode ? "hidden" : ""}`}>
            <label htmlFor="display_order">Display Order</label>
            <input type="number" name="display_order" defaultValue={currentFormData?.display_order ?? ""} />
          </div>
          <div className="flex flex-col gap-4">
            <div className={`flex flex-row gap-2 ${!isDevMode ? "hidden" : ""}`}>
              <label htmlFor="is_active">Active</label>
              <input type="checkbox" name="is_active" value="true" defaultChecked={currentFormData?.is_active} />
            </div>
            <div className={`flex flex-row gap-2 ${!isDevMode ? "hidden" : ""}`}>
              <label htmlFor="is_locked">Locked</label>
              <input type="checkbox" name="is_locked" value="true" defaultChecked={currentFormData?.is_locked} />
            </div>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="cta-primary mt-4" disabled={isPending}>
              {isPending ? "Updating..." : "Update Domain"}
            </button>
          </div>
          {state.error && (
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-red-600">Error</p>
              <p className="text-red-500">{state.error}</p>
            </div>
          )}
          {isDevMode && <DebugCard label="EditDomainFormState" json={state} />}
        </form>
      </div>
    </div>
  );
}
