/**
 * @fileoverview Domain Editor Page - Server component for domain editor
 *
 * 🎯 PURPOSE: Server component for domain editor page
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Uses server component for data fetching
 * - Fetches domain and property data in parallel
 * - Passes data to client component via promises
 *
 * 🤖 AI GUIDANCE - Page Usage Rules:
 * ✅ USE for domain editor page
 * ✅ FETCH domain and property data
 * ✅ PASS data to client component
 *
 * ❌ NEVER skip error handling
 * ❌ NEVER fetch data in client component
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */

import { DomainEditor } from "@cms/modules/domain-editor";
import { getDomain, getDomainProperties } from "@cms/modules/domain-editor/actions";

interface DomainEditorPageProps {
  params: {
    domain_id: string;
  };
}

/**
 * 🏗️ Domain Editor Page - Server component
 *
 * Server component that fetches domain and property data and
 * passes it to the client component via promises.
 */
export default async function DomainEditorPage({ params }: DomainEditorPageProps) {
  const { domain_id } = params;

  // Fetch domain and property data in parallel
  const propertiesPromise = getDomainProperties(domain_id);
  const domainPromise = getDomain(domain_id);

  return <DomainEditor domain_id={domain_id} propertiesPromise={propertiesPromise} domainPromise={domainPromise} />;
}
