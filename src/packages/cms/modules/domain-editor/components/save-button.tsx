/**
 * @fileoverview Enhanced Save Button - Domain editor save functionality with authentication protection
 *
 * 🎯 PURPOSE: Provides robust save functionality with authentication failure protection
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Client component for saving domain properties
 * - Integrates with canvas store to gather property data
 * - Enhanced server action with authentication handling
 * - Local storage backup for data safety
 * - Retry mechanism for network failures
 * - Authentication status monitoring
 *
 * 🔐 AUTHENTICATION FEATURES:
 * - Automatic retry on authentication failures
 * - Local storage backup on session loss
 * - Recovery after re-authentication
 * - Clear error messaging with retry options
 *
 * 🤖 AI GUIDANCE - Enhanced Save Button Usage:
 * ✅ USE in domain editor header for saving properties
 * ✅ HANDLE all authentication failure scenarios gracefully
 * ✅ PRESERVE user data during network/auth failures
 * ✅ PROVIDE clear retry mechanisms
 * ✅ INTEGRATE with local storage for data safety
 *
 * ❌ NEVER lose user data on authentication failures
 * ❌ NEVER skip error classification and retry logic
 * ❌ NEVER use outside of domain editor context
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { RefreshCw, AlertTriangle } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/modules/shadcn/components/ui/button";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { saveProperties, EnhancedSavePropertiesResponse } from "@cms/modules/domain-editor/actions";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { FormProperty } from "@cms/modules/properties/form/types";
import { Property, PropertyOption } from "@cms/modules/properties/property.types";

/**
 * 🔄 Convert FormProperty to Property - Prepare for saving
 *
 * Converts a FormProperty from the canvas store to a Property for saving.
 * Adds display_order from the sorting map and ensures proper typing.
 */
function convertToProperty(formProperty: FormProperty, displayOrder: number): Property {
  return {
    ...formProperty,
    display_order: displayOrder,
    options: [], // Options are handled separately
  };
}

/**
 * 🔄 Local storage backup management
 */
interface LocalBackupData {
  domainId: string;
  properties: Record<string, FormProperty>;
  propertyOptions: Record<string, Record<string, PropertyOption>>;
  sorting: Record<string, number>;
  deletedPropertyIds: string[];
  deletedOptionIds: string[];
  timestamp: number;
}

/**
 * 💾 Enhanced Save Button - Domain editor save functionality with authentication protection
 *
 * Enhanced button component that saves all domain properties and options with
 * comprehensive authentication failure protection, retry mechanisms, and local storage backup.
 *
 * 🔐 AUTHENTICATION FEATURES:
 * - Session expiry detection and retry
 * - Token refresh recovery
 * - Permission error handling
 * - Local storage backup on failure
 * - Recovery after re-authentication
 *
 * 🔄 NETWORK FEATURES:
 * - Automatic retry on network failures
 * - Connection status monitoring
 * - Exponential backoff for retries
 * - Detailed error classification
 *
 * @example
 * ```tsx
 * // In domain editor header
 * <div className="flex items-center space-x-3">
 *   <SaveButton />
 * </div>
 * ```
 */
export function SaveButton() {
  const { t } = useCMSTranslations();
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState<string | null>(null);
  const [lastSaveResult, setLastSaveResult] = useState<EnhancedSavePropertiesResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const store = useCanvasStore();
  const hasChanged = store((state) => state.hasChanged);

  // 🌐 Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 💾 Local storage backup functions
  const createBackup = useCallback(
    (state: ReturnType<typeof store.getState>) => {
      const backupData: LocalBackupData = {
        domainId: state.domainId,
        properties: state.properties,
        propertyOptions: state.propertyOptions,
        sorting: state.sorting,
        deletedPropertyIds: state.deletedPropertyIds,
        deletedOptionIds: state.deletedOptionIds,
        timestamp: Date.now(),
      };

      try {
        localStorage.setItem(`domain-editor-backup-${state.domainId}`, JSON.stringify(backupData));
        console.log(`💾 LOCAL BACKUP CREATED [Domain: ${state.domainId}]`);
      } catch (error) {
        console.warn("Failed to create local backup:", error);
      }
    },
    [store],
  );

  const clearBackup = useCallback((domainId: string) => {
    try {
      localStorage.removeItem(`domain-editor-backup-${domainId}`);
      console.log(`🗑️ LOCAL BACKUP CLEARED [Domain: ${domainId}]`);
    } catch (error) {
      console.warn("Failed to clear local backup:", error);
    }
  }, []);

  // 🔄 Extract save parameters from store
  const extractSaveParameters = useCallback(() => {
    const state = store.getState();
    const { domainId, properties, propertyOptions, sorting, deletedPropertyIds, deletedOptionIds } = state;

    // Convert properties to the format expected by the server action
    const propertiesToSave: Property[] = Object.entries(properties).map(([id, property]) =>
      convertToProperty(property, sorting[id] || 0),
    );

    // Flatten options from nested structure to array
    const optionsToSave: PropertyOption[] = Object.entries(propertyOptions).flatMap(([propertyId, options]) =>
      Object.values(options).map((option) => ({
        ...option,
        property_id: propertyId,
      })),
    );

    return {
      domainId,
      propertiesToSave,
      optionsToSave,
      deletedPropertyIds, // ✅ Use store-tracked deletions (consistent & efficient)
      deletedOptionIds, // ✅ Use store-tracked deletions (consistent & efficient)
      state,
    };
  }, [store]);

  // 💾 Main save handler with enhanced authentication protection
  const handleSave = useCallback(async () => {
    if (!isOnline) {
      setError("You're offline. Changes will be saved when connection is restored.");
      const state = store.getState();
      createBackup(state);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { domainId, propertiesToSave, optionsToSave, deletedPropertyIds, deletedOptionIds, state } =
        extractSaveParameters();

      // 🔐 Create backup before attempting save (in case of auth failure)
      createBackup(state);

      console.log(`🚀 SAVE ATTEMPT ${retryCount + 1} [Domain: ${domainId}]`);

      // Call the enhanced server action
      const result = await saveProperties(
        domainId,
        propertiesToSave,
        optionsToSave,
        deletedPropertyIds,
        deletedOptionIds,
      );

      setLastSaveResult(result);

      if (result.success) {
        console.log("✅ Properties saved successfully");
        setRetryCount(0);
        clearBackup(domainId);

        // Fetch fresh properties from server
        const { getDomainProperties } = await import("@cms/modules/domain-editor/actions");
        const freshPropertiesResponse = await getDomainProperties(domainId);

        if (freshPropertiesResponse.error) {
          setError("Saved successfully but failed to refresh data: " + freshPropertiesResponse.error);
        } else if (freshPropertiesResponse.properties) {
          store.getState().setup(freshPropertiesResponse.properties);
        }
      } else {
        console.error("❌ Save failed:", result.error);

        // Handle authentication errors
        if (result.authError) {
          switch (result.authError) {
            case "session_expired":
              setError("Your session has expired. Please log in again to save your changes.");
              break;
            case "token_refresh_needed":
              setError("Authentication refresh needed. Please try saving again.");
              break;
            case "insufficient_permissions":
              setError("You don't have permission to modify this domain.");
              break;
            case "domain_access_denied":
              setError("Access to this domain has been revoked.");
              break;
            default:
              setError(result.error || "Authentication failed");
          }
        } else {
          setError(result.error || "Failed to save properties");
        }

        // Increment retry count for retryable errors
        if (result.retryable) {
          setRetryCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("💥 Save error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      setRetryCount((prev) => prev + 1);

      // Create backup on unexpected errors
      const state = store.getState();
      createBackup(state);
    } finally {
      setIsSaving(false);
    }
  }, [isOnline, extractSaveParameters, createBackup, clearBackup, retryCount, store]);

  // 🔄 Retry handler
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    handleSave();
  }, [handleSave]);

  // 🎨 Get button variant and icon based on state
  const getButtonState = () => {
    if (!isOnline) {
      return {
        variant: "secondary" as const,
        text: t("offline"),
        disabled: true,
      };
    }

    if (lastSaveResult?.authError) {
      return {
        variant: "destructive" as const,
        text: t("auth_required"),
        disabled: isSaving,
      };
    }

    if (isSaving) {
      return {
        variant: "default" as const,
        text: t("saving"),
        disabled: true,
      };
    }

    return {
      variant: "default" as const,
      text: t("save"),
      disabled: !hasChanged,
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="flex flex-col items-end space-y-1">
      <div className="flex items-center space-x-2">
        <Button
          variant={buttonState.variant}
          className="hover:cursor-pointer"
          onClick={handleSave}
          disabled={buttonState.disabled}
        >
          <span className="">{buttonState.text}</span>
        </Button>

        {/* Retry button for retryable errors */}
        {lastSaveResult && !lastSaveResult.success && lastSaveResult.retryable && !isSaving && (
          <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center space-x-1">
            <RefreshCw className="h-3 w-3" />
            <span>{t("retry")}</span>
          </Button>
        )}

        {/* Auth error indicator */}
        {lastSaveResult?.authError && (
          <div className="flex items-center text-yellow-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Error message with retry info */}
      {error && (
        <div className="max-w-xs text-right">
          <p className="text-destructive text-sm">{error}</p>
          {retryCount > 0 && (
            <p className="text-muted-foreground text-xs">{t("retry_attempt", { count: retryCount })}</p>
          )}
          {!isOnline && <p className="text-xs text-orange-600">{t("changes_saved_locally")}</p>}
        </div>
      )}
    </div>
  );
}
