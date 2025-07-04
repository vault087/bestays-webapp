/**
 * @fileoverview Domain Name Input - Display and edit domain name
 *
 * 🎯 PURPOSE: Displays domain name with edit button
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Connects to domain store for domain data
 * - Provides edit button for opening domain form
 * - Shows domain status indicators
 * - Includes back button for navigation
 *
 * 🤖 AI GUIDANCE - Component Usage Rules:
 * ✅ USE in domain editor header
 * ✅ CONNECT to domain store for state
 * ✅ PROVIDE edit functionality
 * ✅ SHOW domain status indicators
 *
 * ❌ NEVER mix domain and property concerns
 * ❌ NEVER use outside of domain editor context
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { ChevronLeft, Edit, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/shadcn/components/ui/button";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDomainStore } from "@cms/modules/domain-editor/stores/domain-store";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store";
import { DomainForm } from "./domain-form";

/**
 * 🏗️ Domain Name Input - Display and edit domain name
 *
 * Component that displays the domain name with an edit button and status indicators.
 * Includes a back button for navigation to the domain list page.
 */
export default function DomainNameInput(): React.JSX.Element {
  const { t } = useCMSTranslations();
  const router = useRouter();
  const layoutStore = useLayoutStore();
  const currentTranslation = layoutStore((state) => state.currentTranslation) || "";

  const domainStore = useDomainStore();
  const domain = domainStore((state) => state.domain);
  const openForm = domainStore((state) => state.openForm);

  // Navigate back to domain list
  const handleBack = () => {
    router.push("/dashboard/domain");
  };

  // Get domain name in current translation or fallback to code
  const domainName = domain?.name?.[currentTranslation] || domain?.code || t("domain.unnamed");

  // Determine status indicator
  const getStatusIndicator = () => {
    if (!domain) return null;

    if (domain.is_active) {
      return (
        <div className="flex items-center text-xs text-green-600">
          <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
          {t("domain.status.published")}
        </div>
      );
    }

    return (
      <div className="flex items-center text-xs text-green-600">
        <Check className="mr-1 h-3 w-3" />
        {t("domain.status.ready")}
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={handleBack}
        title={t("domain.back_to_list")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="group relative">
        <div className="flex flex-col">
          <div className="flex items-center">
            <h2 className="max-w-[200px] truncate text-lg font-medium">{domainName}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
              onClick={openForm}
              title={t("domain.edit")}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
          {getStatusIndicator()}
        </div>
      </div>

      <DomainForm />
    </div>
  );
}
