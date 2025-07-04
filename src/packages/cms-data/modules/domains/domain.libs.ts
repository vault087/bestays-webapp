import { getSupabase } from "@cms-data/libs";
import { zodFieldsToString } from "@cms-data/utils";
import {
  DOMAIN_TABLE,
  DomainBaseListing,
  DomainBaseListingSchema,
  DomainBaseSchema,
  CreateDomainInput,
  UpdateDomainInput,
  DomainBase,
} from './domain.types';

export async function getBaseDomain(domainId: string): Promise<DomainBase> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(DOMAIN_TABLE)
    .select(zodFieldsToString(DomainBaseSchema))
    .eq("id", domainId)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Domain not found");
  }

  return DomainBaseSchema.parse(data);
}

export async function createDomain(domain: CreateDomainInput): Promise<DomainBase | null> {
  const supabase = await getSupabase();

  // For creation, we omit the id and let the database generate it
  const payload = DomainBaseSchema.omit({ id: true }).parse(domain);
  const { data, error } = await supabase.from(DOMAIN_TABLE).insert(payload).select().single();

  if (error) {
    throw error;
  }

  return DomainBaseSchema.parse(data);
}

export async function updateDomain(id: string, domain: UpdateDomainInput): Promise<DomainBase | null> {
  const supabase = await getSupabase();

  const payload = DomainBaseSchema.parse(domain);
  const { data, error } = await supabase
    .from(DOMAIN_TABLE)
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return DomainBaseSchema.parse(data);
}

export async function getBaseDomainList(): Promise<DomainBaseListing[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(DOMAIN_TABLE)
    .select(zodFieldsToString(DomainBaseListingSchema))
    .order("display_order", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  // return zod validated object
  return DomainBaseListingSchema.array().parse(data);
}
