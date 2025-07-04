import CreateDomainForm from "@cms/modules/domains/components/new-domain-form";
import { createDomain } from './actions';

export default async function CreateDomainPage() {
  return (
    <div className="flex flex-col p-4">
      <h1 className="mb-8 text-2xl font-thin">Create Domain</h1>
      <div className="bg-primary flex flex-col gap-4 rounded-lg border-1 border-slate-300 p-4">
        <CreateDomainForm serverAction={createDomain} />
      </div>
    </div>
  );
}
