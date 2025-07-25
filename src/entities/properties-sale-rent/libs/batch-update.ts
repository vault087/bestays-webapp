import { MutableProperty } from "@/entities/properties-sale-rent/features/form/types/mutable-property.types";
import { supabase } from "@/modules/supabase/clients/client";

export interface BatchUpdateParams {
  domainId: string;
  properties: MutableProperty[];
  allOptions?: unknown[]; // TODO: Add proper typing for options
  deletedProperties?: string[];
  deletedOptions?: string[];
}

export interface BatchUpdateResult {
  success: boolean;
  idMapping?: unknown;
  error?: string;
}

/**
 * Call the batch update RPC for properties with images
 */
export async function updatePropertiesWithImagesBatch(params: BatchUpdateParams): Promise<BatchUpdateResult> {
  try {
    const { data, error } = await supabase.rpc("update_properties_with_images_batch", {
      p_domain_id: params.domainId,
      properties: params.properties,
      all_options: params.allOptions || [],
      deleted_properties: params.deletedProperties || [],
      deleted_options: params.deletedOptions || [],
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      idMapping: data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown batch update error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
