/**
 * @fileoverview Domain Form - Edit domain properties
 *
 * 🎯 PURPOSE: Provides a form for editing domain properties
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Uses Dialog component for modal overlay
 * - Connects to domain store for state management
 * - Handles form submission with server action
 * - Provides validation with zod schema
 *
 * 🤖 AI GUIDANCE - Form Usage Rules:
 * ✅ USE for editing domain properties
 * ✅ CONNECT to domain store for state
 * ✅ HANDLE validation with zod schema
 * ✅ PROVIDE clear error messages
 *
 * ❌ NEVER mix domain and property concerns
 * ❌ NEVER skip validation
 * ❌ NEVER use outside of domain editor context
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/modules/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shadcn/components/ui/dialog";
import { Input } from "@/modules/shadcn/components/ui/input";
import { Label } from "@/modules/shadcn/components/ui/label";
import { Switch } from "@/modules/shadcn/components/ui/switch";
import { Textarea } from "@/modules/shadcn/components/ui/textarea";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { saveDomain } from "@cms/modules/domain-editor/actions";
import { useDomainStore } from "@cms/modules/domain-editor/stores/domain-store";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store";
import { Domain, DomainSchema } from "@cms/modules/domains/domain.types";

/**
 * 🏗️ Domain Form - Edit domain properties
 *
 * Dialog form for editing domain properties. Connects to domain store
 * for state management and handles form submission with server action.
 */
export function DomainForm(): React.JSX.Element {
  const { t } = useCMSTranslations();
  const domainStore = useDomainStore();
  const layoutStore = useLayoutStore();
  const currentTranslation = layoutStore((state) => state.currentTranslation) || "";

  const isOpen = domainStore((state) => state.isFormOpen);
  const domain = domainStore((state) => state.domain);
  const closeForm = domainStore((state) => state.closeForm);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with domain data
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Domain>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(DomainSchema) as any,
    defaultValues: domain || undefined,
  });

  // Reset form when domain changes
  useEffect(() => {
    if (domain) {
      reset(domain);
    }
  }, [domain, reset]);

  // Handle form submission
  const onSubmit = useCallback(
    async (formData: Domain) => {
      if (!domain) return;

      setIsSaving(true);
      setError(null);

      try {
        const result = await saveDomain(formData);

        if (result.error) {
          setError(result.error);
        } else if (result.domain) {
          domainStore.getState().setDomain(result.domain);
          closeForm();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save domain");
      } finally {
        setIsSaving(false);
      }
    },
    [domain, domainStore, closeForm],
  );

  if (!domain) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeForm()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("domain.edit_title")}</DialogTitle>
            <DialogDescription>{t("domain.edit_description")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Domain Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("domain.name")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  {...register(`name.${currentTranslation}`)}
                  placeholder={t("domain.name_placeholder")}
                  className="w-full"
                />
                {errors.name?.message && <p className="text-destructive mt-1 text-sm">{String(errors.name.message)}</p>}
              </div>
            </div>

            {/* Domain Code */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                {t("domain.code")}
              </Label>
              <div className="col-span-3">
                <Input id="code" {...register("code")} placeholder={t("domain.code_placeholder")} className="w-full" />
                {errors.code?.message && <p className="text-destructive mt-1 text-sm">{String(errors.code.message)}</p>}
              </div>
            </div>

            {/* Domain Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t("domain.description")}
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  {...register(`description.${currentTranslation}`)}
                  placeholder={t("domain.description_placeholder")}
                  className="w-full"
                />
                {errors.description?.message && (
                  <p className="text-destructive mt-1 text-sm">{String(errors.description.message)}</p>
                )}
              </div>
            </div>

            {/* Domain Active Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">
                {t("domain.active")}
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="is_active" {...register("is_active")} defaultChecked={domain.is_active} />
                <Label htmlFor="is_active">{domain.is_active ? t("domain.active_yes") : t("domain.active_no")}</Label>
              </div>
            </div>

            {/* Domain Locked Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_locked" className="text-right">
                {t("domain.locked")}
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="is_locked" {...register("is_locked")} defaultChecked={domain.is_locked} />
                <Label htmlFor="is_locked">{domain.is_locked ? t("domain.locked_yes") : t("domain.locked_no")}</Label>
              </div>
            </div>

            {/* System Description (Meta) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meta.system_description" className="text-right">
                {t("domain.system_description")}
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="meta.system_description"
                  {...register("meta.system_description")}
                  placeholder={t("domain.system_description_placeholder")}
                  className="w-full"
                />
                {errors.meta?.system_description?.message && (
                  <p className="text-destructive mt-1 text-sm">{String(errors.meta.system_description.message)}</p>
                )}
              </div>
            </div>
          </div>

          {error && <p className="text-destructive mb-4 text-sm">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeForm} disabled={isSaving}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
