import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseDomain } from "@cms-data/modules/domains/domain.libs";
import { Domain } from "@cms/modules/domains/domain.types";

export default async function DomainPage({ params }: { params: Promise<{ domain_id: string }> }) {
  const { domain_id } = await params;

  let domain: Domain | null = null;
  try {
    domain = await getBaseDomain(domain_id);
  } catch (error) {
    console.error("Domain not found:", error);
    notFound(); // This triggers Next.js 404 page
  }

  // If domain is still null after try/catch, also trigger 404
  if (!domain) {
    notFound();
  }
  return (
    <div className="flex flex-col space-x-2 p-4">
      <h1 className="mb-8 text-2xl font-thin">
        {domain?.code} ({domain?.name?.en})
      </h1>

      <Link className="text-primary-cta" href={`/dashboard/domain/${domain_id}/records/new`}>
        New Record
      </Link>

      <div className="flex flex-row items-center space-x-2">
        <Link href={`/domain-editor/${domain.id}`} className="text-secondary-cta text-xs font-thin">
          schema
        </Link>
        <Link href={`/dashboard/domain/${domain.id}/edit`}>
          <svg
            className="text-secondary-cta h-5 w-5"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
            <line x1="16" y1="5" x2="19" y2="8" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
