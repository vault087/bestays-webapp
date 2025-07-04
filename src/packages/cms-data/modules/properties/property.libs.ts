import { getSupabase } from "@cms-data/libs";
import { zodFieldsToString } from "@cms-data/utils";
import {
  PROPERTY_TABLE,
  PROPERTY_TAGS_VIEW,
  PropertyBase,
  PropertyBaseSchema,
  PropertyOptionBase,
  PropertyOptionBaseSchema,
  UpdatePropertyInput,
  UpdatePropertyOptionInput,
} from "./property.types";

// Internal Database functions
export async function getBaseDomainProperties(domainId: string): Promise<PropertyBase[]> {
  const supabase = await getSupabase();

  const { data: properties, error: propertiesError } = await supabase
    .from(PROPERTY_TABLE)
    .select(zodFieldsToString(PropertyBaseSchema))
    .eq("domain_id", domainId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (propertiesError) {
    throw new Error(`Failed to fetch domain properties: ${propertiesError.message}`);
  }

  return PropertyBaseSchema.array().parse(properties);
}

export async function getBaseDomainPropertyOptions(domainId: string): Promise<PropertyOptionBase[]> {
  const supabase = await getSupabase();
  const { data: options, error: optionsError } = await supabase
    .from(PROPERTY_TAGS_VIEW)
    .select(zodFieldsToString(PropertyOptionBaseSchema))
    .eq("domain_id", domainId)
    .order("display_order", { ascending: true });

  if (optionsError) {
    console.error("Failed to fetch domain property options:", optionsError.message);
    throw new Error(`Failed to fetch domain property options: ${optionsError.message}`);
  }

  return PropertyOptionBaseSchema.array().parse(options);
}

export async function batchUpdateProperties(
  userId: string,
  domainId: string,
  allProperties: UpdatePropertyInput[],
  allOptions: UpdatePropertyOptionInput[],
  deletedPropertyIds: string[],
  deletedOptionIds: string[],
): Promise<void> {
  const supabase = await getSupabase();

  // Prepare all properties (not just updated ones)
  const propertiesJson = allProperties.map((prop) => ({
    id: prop.id,
    group_id: prop.group_id,
    name: prop.name,
    description: prop.description,
    code: prop.code,
    is_locked: prop.is_locked,
    type: prop.type,
    meta: prop.meta,
    display_order: prop.display_order,
    is_required: prop.is_required,
    is_private: prop.is_private,
    creator_id: userId,
    is_new: prop.is_new || false,
  }));

  // Prepare all options (already flattened client-side)
  const optionsJson = allOptions.map((option) => ({
    option_id: option.option_id,
    property_id: option.property_id,
    name: option.name,
    display_order: option.display_order,
    is_new: option.is_new || false,
  }));

  // Call the simple batch function

  // Call cms-data HERE!!!

  const { error } = await supabase.rpc("update_properties_batch", {
    p_domain_id: domainId,
    properties: propertiesJson,
    all_options: optionsJson,
    deleted_properties: deletedPropertyIds,
    deleted_options: deletedOptionIds,
  });

  if (error) {
    console.error("Batch update failed:", error);
    throw new Error(`Failed to batch update properties: ${error.message}`);
  }
}
