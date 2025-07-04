/**
 * @fileoverview Domain Editor Server Actions - Property data fetching
 *
 * 🎯 PURPOSE: Server-side actions for fetching domain property data
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Server-only actions using "use server" directive
 * - Error handling with structured response types
 * - Integration with CMS property libraries
 * - Consistent error messaging for UI consumption
 *
 * 🤖 AI GUIDANCE - Server Actions Usage:
 * ✅ USE for server-side property data fetching
 * ✅ ALWAYS handle errors with structured responses
 * ✅ RETURN consistent response format with properties and errors
 * ✅ WRAP in try-catch for robust error handling
 *
 * ❌ NEVER call from client components directly
 * ❌ NEVER expose raw database errors to client
 * ❌ NEVER skip error handling
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@cms-data/libs";
import { getBaseDomain, updateDomain } from "@cms-data/modules/domains/domain.libs";
import { Domain } from "@cms/modules/domains/domain.types";
import { getDomainProperties as cmsAction, batchUpdateProperties } from "@cms/modules/properties/property.libs";
import { Property, PropertyOption } from "@cms/modules/properties/property.types";

/**
 * 📊 Structured response for property fetching operations
 */
export type GetPropertiesResponse = {
  properties: Property[] | null;
  error: string | null;
};

/**
 * 📊 Structured response for domain fetching operations
 */
export type GetDomainResponse = {
  domain: Domain | null;
  error: string | null;
};

/**
 * 🔍 Get Domain Properties - Fetch all properties for a domain
 *
 * Server action that retrieves all properties associated with a specific domain.
 * Used by DomainEditor to initialize the canvas store with existing property data.
 *
 * @param domain_id - UUID of the domain to fetch properties for
 * @returns Promise<GetPropertiesResponse> - Structured response with properties or error
 *
 * @example
 * ```tsx
 * const propertiesPromise = getDomainProperties("domain-uuid-123");
 * const { properties, error } = await propertiesPromise;
 * if (error) {
 *   // Handle error state
 * } else {
 *   // Use properties array
 * }
 * ```
 */
export async function getDomainProperties(domain_id: string): Promise<GetPropertiesResponse> {
  try {
    const properties = await cmsAction(domain_id);
    return {
      error: null,
      properties,
    };
  } catch (error) {
    console.error("Failed to fetch domain properties:", error);
    return {
      error: "Failed to get domain properties",
      properties: null,
    };
  }
}

/**
 * 📊 Structured response for property saving operations
 */
export type SavePropertiesResponse = {
  success: boolean;
  error: string | null;
};

/**
 * 📊 Enhanced response for property saving operations with authentication details
 */
export type EnhancedSavePropertiesResponse = SavePropertiesResponse & {
  authError?: "session_expired" | "token_refresh_needed" | "insufficient_permissions" | "domain_access_denied";
  retryable?: boolean;
};

/**
 * 💾 Save Domain Properties - Update properties and options in the database
 *
 * Enhanced server action that saves all properties and options for a domain, handling
 * new, updated, and deleted items. Features sophisticated authentication handling,
 * token refresh recovery, and detailed error classification for optimal UX.
 *
 * 🔐 AUTHENTICATION FEATURES:
 * - Automatic token refresh on session expiry
 * - Detailed error classification for UI handling
 * - Retry capability indication
 * - Permission and access validation
 *
 * @param domainId - UUID of the domain being edited
 * @param properties - Array of properties to save (new and updated)
 * @param options - Array of options to save (new and updated)
 * @param deletedPropertyIds - Array of property IDs to delete
 * @param deletedOptionIds - Array of option IDs to delete
 * @param retryAttempt - Current retry attempt number (internal use)
 * @returns Promise<EnhancedSavePropertiesResponse> - Enhanced response with auth details
 *
 * @example
 * ```tsx
 * const result = await saveProperties(
 *   "domain-uuid-123",
 *   properties,
 *   options,
 *   deletedPropertyIds,
 *   deletedOptionIds
 * );
 *
 * if (result.success) {
 *   // Handle success
 * } else if (result.authError === 'session_expired') {
 *   // Show re-authentication UI
 * } else if (result.retryable) {
 *   // Show retry button
 * } else {
 *   // Show non-retryable error
 * }
 * ```
 */
export async function saveProperties(
  domainId: string,
  properties: Property[],
  options: PropertyOption[], // Property options to save
  deletedPropertyIds: string[],
  deletedOptionIds: string[],
  retryAttempt: number = 0,
): Promise<EnhancedSavePropertiesResponse> {
  const maxRetries = 3;

  try {
    const supabase = await getSupabase();

    // 🔄 STEP 1: Get current session with retry logic
    let session;
    try {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn("Session retrieval error:", sessionError);
        return {
          success: false,
          error: "Failed to verify authentication status",
          authError: "session_expired",
          retryable: true,
        };
      }

      session = data.session;
    } catch (error) {
      console.error("Session retrieval failed:", error);
      return {
        success: false,
        error: "Authentication service unavailable",
        authError: "session_expired",
        retryable: true,
      };
    }

    // 🔐 STEP 2: Handle missing session
    if (!session) {
      return {
        success: false,
        error: "Authentication required - please log in again",
        authError: "session_expired",
        retryable: false, // Requires full re-authentication
      };
    }

    // 🔄 STEP 3: Check session validity and attempt refresh if needed
    const now = Math.floor(Date.now() / 1000);
    const sessionExpiresAt = session.expires_at;
    const isSessionExpired = sessionExpiresAt && now >= sessionExpiresAt;
    const isSessionExpiringSoon = sessionExpiresAt && now >= sessionExpiresAt - 300; // 5 minutes before expiry

    if (isSessionExpired || isSessionExpiringSoon) {
      console.log("Session expired or expiring soon, attempting refresh...");

      try {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !refreshData.session) {
          console.warn("Token refresh failed:", refreshError);
          return {
            success: false,
            error: "Session expired - please log in again",
            authError: "session_expired",
            retryable: false,
          };
        }

        session = refreshData.session;
        console.log("Token refresh successful");
      } catch (refreshError) {
        console.error("Token refresh exception:", refreshError);
        return {
          success: false,
          error: "Unable to refresh authentication - please log in again",
          authError: "token_refresh_needed",
          retryable: false,
        };
      }
    }

    // 🆔 STEP 4: Validate user ID
    const userId = session.user?.id;
    if (!userId) {
      return {
        success: false,
        error: "Invalid user session - please log in again",
        authError: "session_expired",
        retryable: false,
      };
    }

    // 🏗️ STEP 5: Log save operation for monitoring
    console.log(`💾 SAVE OPERATION START [User: ${userId}, Domain: ${domainId}]`);
    console.log("📊 Save Data:", {
      propertiesCount: properties.length,
      optionsCount: options.length,
      deletedPropertiesCount: deletedPropertyIds.length,
      deletedOptionsCount: deletedOptionIds.length,
      retryAttempt,
    });

    // 🚀 STEP 6: Perform the actual save operation
    try {
      await batchUpdateProperties(userId, domainId, properties, options, deletedPropertyIds, deletedOptionIds);

      // Revalidate the domain editor page to refresh data
      revalidatePath(`/dashboard/domain-editor/${domainId}`);

      console.log(`✅ SAVE OPERATION SUCCESS [User: ${userId}, Domain: ${domainId}]`);
      return {
        success: true,
        error: null,
      };
    } catch (saveError) {
      console.error("Batch update failed:", saveError);

      // 🔍 STEP 7: Classify save errors for better UX
      const errorMessage = saveError instanceof Error ? saveError.message : String(saveError);

      // 🔄 STEP 8: Handle retryable errors with exponential backoff FIRST
      const isRetryableError =
        errorMessage.includes("timeout") ||
        errorMessage.includes("temporary") ||
        errorMessage.includes("network") ||
        errorMessage.includes("connection") ||
        errorMessage.includes("retry");

      if (retryAttempt < maxRetries && isRetryableError) {
        console.log(`🔄 RETRY ATTEMPT ${retryAttempt + 1}/${maxRetries} [Error: ${errorMessage}]`);

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retryAttempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));

        return saveProperties(domainId, properties, options, deletedPropertyIds, deletedOptionIds, retryAttempt + 1);
      }

      // Check for permission-related errors
      if (
        errorMessage.includes("permission") ||
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("forbidden")
      ) {
        return {
          success: false,
          error: "Insufficient permissions to modify this domain",
          authError: "insufficient_permissions",
          retryable: false,
        };
      }

      // Check for domain access errors
      if (errorMessage.includes("not found") || errorMessage.includes("access denied")) {
        return {
          success: false,
          error: "Domain not found or access denied",
          authError: "domain_access_denied",
          retryable: false,
        };
      }

      // Check for constraint violations (non-retryable)
      if (
        errorMessage.includes("constraint") ||
        errorMessage.includes("duplicate") ||
        errorMessage.includes("foreign key")
      ) {
        return {
          success: false,
          error: `Data validation error: ${errorMessage}`,
          retryable: false,
        };
      }

      // Check for network/timeout errors (after retry attempts exhausted)
      if (isRetryableError) {
        return {
          success: false,
          error: `Save operation failed: ${errorMessage}`,
          retryable: true,
        };
      }

      // Default error handling for non-retryable errors
      return {
        success: false,
        error: `Save operation failed: ${errorMessage}`,
        retryable: false,
      };
    }
  } catch (error) {
    console.error(`❌ SAVE OPERATION FAILED [Domain: ${domainId}, Attempt: ${retryAttempt}]`, error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while saving properties";

    return {
      success: false,
      error: errorMessage,
      retryable: true,
    };
  }
}

/**
 * 🔍 Get Domain - Fetch domain data
 *
 * Server action that retrieves domain data for a specific domain ID.
 * Used by DomainEditor to initialize the domain store.
 *
 * @param domain_id - UUID of the domain to fetch
 * @returns Promise<GetDomainResponse> - Structured response with domain or error
 *
 * @example
 * ```tsx
 * const domainPromise = getDomain("domain-uuid-123");
 * const { domain, error } = await domainPromise;
 * if (error) {
 *   // Handle error state
 * } else {
 *   // Use domain data
 * }
 * ```
 */
export async function getDomain(domain_id: string): Promise<GetDomainResponse> {
  try {
    const domain = await getBaseDomain(domain_id);
    return {
      error: null,
      domain,
    };
  } catch (error) {
    console.error("Failed to fetch domain:", error);
    return {
      error: "Failed to get domain",
      domain: null,
    };
  }
}

/**
 * 💾 Save Domain - Update domain data in the database
 *
 * Server action that saves domain data for a specific domain.
 * Used by DomainEditor to update domain information.
 *
 * @param domain - Domain data to save
 * @returns Promise<GetDomainResponse> - Structured response with updated domain or error
 */
export async function saveDomain(domain: Domain): Promise<GetDomainResponse> {
  try {
    const updatedDomain = await updateDomain(domain.id, domain);

    // Revalidate the domain editor page to refresh data
    revalidatePath(`/dashboard/domain-editor/${domain.id}`);

    return {
      error: null,
      domain: updatedDomain,
    };
  } catch (error) {
    console.error("Failed to save domain:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to save domain",
      domain: null,
    };
  }
}
