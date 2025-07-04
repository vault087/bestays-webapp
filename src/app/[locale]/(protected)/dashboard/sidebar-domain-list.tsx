import Link from "next/link";
import { getBaseDomainList } from "@cms-data/modules/domains/domain.libs";
import { DomainBaseListing } from "@cms-data/modules/domains/domain.types";

export async function SideBarDomainList() {
  let domainList: DomainBaseListing[] = [];
  try {
    domainList = await getBaseDomainList();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Header */}
      <h1 className="text-primary font-bold tracking-wide">
        Domains {domainList.length !== 0 && `(${domainList.length})`}
      </h1>

      {/* List of domains */}
      <div className="text-primary items-between flex flex-col space-y-2 pl-4 font-mono">
        {domainList.map((domain) => (
          <div key={domain.id} className="flex flex-row justify-between space-x-2">
            <div className="">
              <Link href={`/dashboard/domain/${domain.id}`} className="text-primary-cta text-md shrink-0 text-ellipsis">
                {domain.code || domain.name?.en || domain.id.slice(0, 8)}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {domainList.length === 0 && <p className="text-secondary">No domains found</p>}

      {/* Add new domain */}
      <Link
        href={`/dashboard/domain/create-domain`}
        className="flex w-full flex-row items-center justify-end space-x-1 text-zinc-500"
      >
        {/* Link Item Container */}
        <div className="group flex items-center justify-center space-x-1">
          <p className="text-primary-cta text-xs font-bold">Add new domain</p>
          <svg
            className="text-primary-cta mt-0.5 h-5 w-5"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" /> <line x1="5" y1="12" x2="19" y2="12" />{" "}
            <line x1="13" y1="18" x2="19" y2="12" /> <line x1="13" y1="6" x2="19" y2="12" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
