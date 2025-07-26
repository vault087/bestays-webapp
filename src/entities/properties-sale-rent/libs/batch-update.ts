import { MutableDictionary, MutableEntry } from "@/entities/dictionaries/features/form/types/mutable-dictionary.types";
import { MutableProperty } from "@/entities/properties-sale-rent/features/form/types/mutable-property.types";
import { getSupabase } from "@/modules/supabase/clients/server";

export interface BatchUpdateParams {
  dictionaries: MutableDictionary[];
  entries: MutableEntry[];
  properties: MutableProperty[];
  deletedDictionaries?: number[];
  deletedEntries?: number[];
  deletedProperties?: string[];
}

export interface BatchUpdateResult {
  success: boolean;
  idMapping?: {
    dictionary_mapping: Record<string, number>;
    entry_mapping: Record<string, number>;
    property_mapping: Record<string, string>;
  };
  error?: string;
}

/**
 * Call the batch update RPC for dictionaries, entries, and properties
 * Uses the corrected RPC function from 21_rpc_cursor_auto.sql
 */
export async function updateDictionariesEntriesPropertiesBatch(params: BatchUpdateParams): Promise<BatchUpdateResult> {
  try {
    console.log("sending data", params);
    const supabase = await getSupabase();

    const { data, error } = await supabase.rpc("update_dictionaries_entries_properties_batch", {
      dictionaries: params.dictionaries,
      entries: params.entries,
      properties: params.properties,
      deleted_dictionaries: params.deletedDictionaries || [],
      deleted_entries: params.deletedEntries || [],
      deleted_properties: params.deletedProperties || [],
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

// Keep the old function for backward compatibility
export interface BatchUpdateParamsLegacy {
  domainId: string;
  properties: MutableProperty[];
  allOptions?: unknown[]; // TODO: Add proper typing for options
  deletedProperties?: string[];
  deletedOptions?: string[];
}

export interface BatchUpdateResultLegacy {
  success: boolean;
  idMapping?: unknown;
  error?: string;
}

/**
 * Call the batch update RPC for properties with images (legacy function)
 * @deprecated Use updateDictionariesEntriesPropertiesBatch instead
 */
export async function updatePropertiesWithImagesBatch(
  params: BatchUpdateParamsLegacy,
): Promise<BatchUpdateResultLegacy> {
  try {
    const supabase = await getSupabase();
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
