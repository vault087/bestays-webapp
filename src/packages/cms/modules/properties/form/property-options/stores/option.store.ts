import { produce } from "immer";
import { StateCreator } from "zustand";
import { generateUUID } from "@shared-ui/lib/utils";
import { LocalizedText } from "@cms-data/modules/localization/localization.types";
import { PropertyOption } from "@cms/modules/properties/property.types";

// ✅ Property Store State & Actions Types
export interface OptionStoreState {
  hasChanged: boolean;
  options: Record<string, Record<string, PropertyOption>>;
  deletedOptionIds: string[]; // Track deleted options that existed in DB
}

export interface OptionStoreActions {
  addPropertyOption: (propertyId: string, name?: LocalizedText) => void;
  updatePropertyOption: (propertyId: string, optionId: string, updater: (draft: PropertyOption) => void) => void;
  deletePropertyOption: (propertyId: string, optionId: string) => void;
  reorderOptions: (propertyId: string, sourceIndex: number, destinationIndex: number) => void;
}

export type OptionStore = OptionStoreState & OptionStoreActions;

// ✅ STORE CREATOR - Following Zustand patterns (like counterStoreCreator)
export const createOptionStore: StateCreator<OptionStore> = (set) => ({
  hasChanged: false,
  options: {},
  deletedOptionIds: [],

  addPropertyOption: (propertyId: string, name?: LocalizedText) => {
    set(
      produce((state: OptionStore) => {
        // Initialize options for property if not exists
        if (!state.options[propertyId]) {
          state.options[propertyId] = {};
        }

        // Check 100 option limit
        const currentCount = Object.keys(state.options[propertyId]).length;
        if (currentCount >= 100) {
          console.warn(`Cannot add more than 100 options to property ${propertyId}`);
          return;
        }

        function getMaxDisplayOrder(options: Record<string, PropertyOption>): number {
          const orders = Object.values(options).map((option) => option.display_order || 0);
          return orders.length > 0 ? Math.max(...orders) : -1;
        }

        const newOption: PropertyOption = {
          option_id: generateUUID(),
          property_id: propertyId,
          name: name || {}, // Empty localized object
          display_order: getMaxDisplayOrder(state.options[propertyId]) + 1,
          code: "", // Empty code
          is_new: true,
        };

        state.options[propertyId][newOption.option_id] = newOption;
      }),
    );
  },
  /**
   * 🎛️ Update property options using Immer draft
   */
  updatePropertyOption: (propertyId: string, optionId: string, updater: (draft: PropertyOption) => void) =>
    set(
      produce((state) => {
        if (!state.options[propertyId]) {
          state.options[propertyId] = {};
        }
        updater(state.options[propertyId][optionId]);
        state.hasChanged = true;
      }),
    ),

  /**
   * 🗑️ Delete property option and track for database deletion
   */
  deletePropertyOption: (propertyId: string, optionId: string) =>
    set(
      produce((state) => {
        if (state.options[propertyId]?.[optionId]) {
          // Track for deletion if it's not a new option (only once!)
          if (!state.options[propertyId][optionId].is_new) {
            state.deletedOptionIds.push(optionId);
          }

          // Remove from store
          delete state.options[propertyId][optionId];
          state.hasChanged = true;
        }
      }),
    ),

  reorderOptions: (propertyId: string, sourceIndex: number, destinationIndex: number) =>
    set(
      produce((state: OptionStore) => {
        // Get current ordered IDs

        const orderedIds = Object.values(state.options[propertyId])
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .map((option) => option.option_id);

        // Reorder array
        const [movedId] = orderedIds.splice(sourceIndex, 1);
        orderedIds.splice(destinationIndex, 0, movedId);

        orderedIds.forEach((optionId, index) => {
          state.options[propertyId][optionId].display_order = index;
        });

        state.hasChanged = true;
      }),
    ),
});
