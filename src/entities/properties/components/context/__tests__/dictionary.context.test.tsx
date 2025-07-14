import { render } from "@testing-library/react";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { LocalizedText } from "@/entities/localized-text/types/localized-text.type";
import {
  DictionaryProvider,
  useDictionaryContext,
  DictionaryContextType,
} from "@/entities/properties/components/context/dictionary.context";

// Test component to access context values
const TestComponent = ({ onContext }: { onContext: (context: DictionaryContextType) => void }) => {
  const context = useDictionaryContext();
  onContext(context);
  return <div data-testid="test-component">Test</div>;
};

// Helper to create LocalizedText
const createLocalizedText = (en: string, th?: string): LocalizedText => ({
  en,
  ...(th && { th }),
});

// Helper to create test dictionaries
const createDictionary = (id: number, code: string, name: string, description?: string): Dictionary => ({
  id,
  code,
  name: createLocalizedText(name),
  description: description ? createLocalizedText(description) : undefined,
  is_new: false,
});

// Helper to create test dictionary entries
const createDictionaryEntry = (
  id: number,
  dictionary_id: number,
  code: string | null,
  name: string,
): DictionaryEntry => ({
  id,
  is_active: true,
  dictionary_id,
  code,
  name: createLocalizedText(name),
  is_new: false,
});

describe("DictionaryProvider", () => {
  describe("Normal operation", () => {
    it("should provide correct context values with valid dictionaries and entries", () => {
      const dictionaries: Dictionary[] = [
        createDictionary(1, "property_type", "Property Type"),
        createDictionary(2, "location_type", "Location Type"),
      ];

      const entries: DictionaryEntry[] = [
        createDictionaryEntry(1, 1, "house", "House"),
        createDictionaryEntry(2, 1, "condo", "Condominium"),
        createDictionaryEntry(3, 2, "urban", "Urban Area"),
        createDictionaryEntry(4, 2, "rural", "Rural Area"),
      ];

      let capturedContext: DictionaryContextType | null = null;

      render(
        <DictionaryProvider dictionaries={dictionaries} entries={entries}>
          <TestComponent onContext={(ctx) => (capturedContext = ctx)} />
        </DictionaryProvider>,
      );

      expect(capturedContext).not.toBeNull();
      expect(capturedContext!.dictionariesByCode).toEqual({
        property_type: dictionaries[0],
        location_type: dictionaries[1],
      });

      expect(capturedContext!.entriesByDictionaryCode).toEqual({
        property_type: [entries[0], entries[1]],
        location_type: [entries[2], entries[3]],
      });
    });

    it("should provide correct helper functions", () => {
      const dictionaries: Dictionary[] = [createDictionary(1, "property_type", "Property Type")];

      const entries: DictionaryEntry[] = [
        createDictionaryEntry(1, 1, "house", "House"),
        createDictionaryEntry(2, 1, "condo", "Condominium"),
      ];

      let capturedContext: DictionaryContextType | null = null;

      render(
        <DictionaryProvider dictionaries={dictionaries} entries={entries}>
          <TestComponent onContext={(ctx) => (capturedContext = ctx)} />
        </DictionaryProvider>,
      );

      // Test dictionaryForPropertyField
      expect(capturedContext!.dictionaryForPropertyField("property_type")).toEqual(dictionaries[0]);
      expect(capturedContext!.dictionaryForPropertyField("nonexistent")).toBeUndefined();

      // Test entriesForPropertyField
      expect(capturedContext!.entriesForPropertyField("property_type")).toEqual([entries[0], entries[1]]);
      expect(capturedContext!.entriesForPropertyField("nonexistent")).toBeUndefined();
    });
  });

  describe("Edge cases", () => {
    it("should handle empty dictionaries and entries arrays", () => {
      let capturedContext: DictionaryContextType | null = null;

      render(
        <DictionaryProvider dictionaries={[]} entries={[]}>
          <TestComponent onContext={(ctx) => (capturedContext = ctx)} />
        </DictionaryProvider>,
      );

      expect(capturedContext!.dictionariesByCode).toEqual({});
      expect(capturedContext!.entriesByDictionaryCode).toEqual({});
      expect(capturedContext!.dictionaryForPropertyField("any")).toBeUndefined();
      expect(capturedContext!.entriesForPropertyField("any")).toBeUndefined();
    });

    it("should ignore dictionaries without codes", () => {
      const dictionaries: Dictionary[] = [
        createDictionary(1, "property_type", "Property Type"),
        { ...createDictionary(2, "", "Invalid Dictionary"), code: "" }, // Empty code
        createDictionary(3, "location_type", "Location Type"),
      ];

      const entries: DictionaryEntry[] = [
        createDictionaryEntry(1, 1, "house", "House"),
        createDictionaryEntry(2, 3, "urban", "Urban Area"),
      ];

      let capturedContext: DictionaryContextType | null = null;

      render(
        <DictionaryProvider dictionaries={dictionaries} entries={entries}>
          <TestComponent onContext={(ctx) => (capturedContext = ctx)} />
        </DictionaryProvider>,
      );

      // Should only include dictionaries with valid codes
      expect(Object.keys(capturedContext!.dictionariesByCode)).toEqual(["property_type", "location_type"]);
      expect(capturedContext!.dictionariesByCode.property_type).toEqual(dictionaries[0]);
      expect(capturedContext!.dictionariesByCode.location_type).toEqual(dictionaries[2]);
    });

    it("should ignore entries without codes", () => {
      const dictionaries: Dictionary[] = [createDictionary(1, "property_type", "Property Type")];

      const entries: DictionaryEntry[] = [
        createDictionaryEntry(1, 1, "house", "House"),
        createDictionaryEntry(2, 1, null, "Invalid Entry"), // No code
        createDictionaryEntry(3, 1, "", "Another Invalid"), // Empty code
        createDictionaryEntry(4, 1, "condo", "Condominium"),
      ];

      let capturedContext: DictionaryContextType | null = null;

      render(
        <DictionaryProvider dictionaries={dictionaries} entries={entries}>
          <TestComponent onContext={(ctx) => (capturedContext = ctx)} />
        </DictionaryProvider>,
      );

      // Should only include entries with valid codes
      expect(capturedContext!.entriesByDictionaryCode.property_type).toEqual([
        entries[0], // house
        entries[3], // condo
      ]);
    });

    it("should ignore entries for non-existent dictionaries", () => {
      const dictionaries: Dictionary[] = [createDictionary(1, "property_type", "Property Type")];

      const entries: DictionaryEntry[] = [
        createDictionaryEntry(1, 1, "house", "House"),
        createDictionaryEntry(2, 999, "orphan", "Orphan Entry"), // Dictionary ID 999 doesn't exist
        createDictionaryEntry(3, 1, "condo", "Condominium"),
      ];

      let capturedContext: DictionaryContextType | null = null;

      render(
        <DictionaryProvider dictionaries={dictionaries} entries={entries}>
          <TestComponent onContext={(ctx) => (capturedContext = ctx)} />
        </DictionaryProvider>,
      );

      // Should only include entries for existing dictionaries
      expect(capturedContext!.entriesByDictionaryCode.property_type).toEqual([
        entries[0], // house
        entries[2], // condo
      ]);
      expect(Object.keys(capturedContext!.entriesByDictionaryCode)).toEqual(["property_type"]);
    });

    it("should handle multiple entries for the same dictionary", () => {
      const dictionaries: Dictionary[] = [createDictionary(1, "property_type", "Property Type")];

      const entries: DictionaryEntry[] = [
        createDictionaryEntry(1, 1, "house", "House"),
        createDictionaryEntry(2, 1, "condo", "Condominium"),
        createDictionaryEntry(3, 1, "villa", "Villa"),
        createDictionaryEntry(4, 1, "apartment", "Apartment"),
      ];

      let capturedContext: DictionaryContextType | null = null;

      render(
        <DictionaryProvider dictionaries={dictionaries} entries={entries}>
          <TestComponent onContext={(ctx) => (capturedContext = ctx)} />
        </DictionaryProvider>,
      );

      expect(capturedContext!.entriesByDictionaryCode.property_type).toHaveLength(4);
      expect(capturedContext!.entriesByDictionaryCode.property_type).toEqual(entries);
    });

    it("should handle dictionaries with missing or null IDs gracefully", () => {
      const dictionaries: Dictionary[] = [
        createDictionary(1, "property_type", "Property Type"),
        { ...createDictionary(2, "location_type", "Location Type"), id: 0 }, // Invalid ID
      ];

      const entries: DictionaryEntry[] = [
        createDictionaryEntry(1, 1, "house", "House"),
        createDictionaryEntry(2, 2, "urban", "Urban Area"), // References invalid dictionary ID
      ];

      let capturedContext: DictionaryContextType | null = null;

      render(
        <DictionaryProvider dictionaries={dictionaries} entries={entries}>
          <TestComponent onContext={(ctx) => (capturedContext = ctx)} />
        </DictionaryProvider>,
      );

      // Should handle gracefully without crashing
      expect(capturedContext!.dictionariesByCode.property_type).toEqual(dictionaries[0]);
      expect(capturedContext!.entriesByDictionaryCode.property_type).toEqual([entries[0]]);
    });
  });

  describe("Complex scenarios", () => {
    it("should handle mixed valid and invalid data correctly", () => {
      const dictionaries: Dictionary[] = [
        createDictionary(1, "property_type", "Property Type"),
        { ...createDictionary(2, "", "Invalid Dict"), code: "" }, // Invalid
        createDictionary(3, "location_type", "Location Type"),
        createDictionary(4, "ownership_type", "Ownership Type"),
      ];

      const entries: DictionaryEntry[] = [
        createDictionaryEntry(1, 1, "house", "House"),
        createDictionaryEntry(2, 1, null, "Invalid Entry"), // Invalid
        createDictionaryEntry(3, 999, "orphan", "Orphan"), // Invalid dictionary_id
        createDictionaryEntry(4, 3, "urban", "Urban"),
        createDictionaryEntry(5, 4, "", "Invalid Code"), // Invalid code
        createDictionaryEntry(6, 4, "freehold", "Freehold"),
      ];

      let capturedContext: DictionaryContextType | null = null;

      render(
        <DictionaryProvider dictionaries={dictionaries} entries={entries}>
          <TestComponent onContext={(ctx) => (capturedContext = ctx)} />
        </DictionaryProvider>,
      );

      // Only valid dictionaries should be included
      expect(Object.keys(capturedContext!.dictionariesByCode)).toEqual([
        "property_type",
        "location_type",
        "ownership_type",
      ]);

      // Only valid entries should be included
      expect(capturedContext!.entriesByDictionaryCode).toEqual({
        property_type: [entries[0]], // Only "house"
        location_type: [entries[3]], // Only "urban"
        ownership_type: [entries[5]], // Only "freehold"
      });
    });
  });

  describe("Error handling", () => {
    it("should throw error when useDictionaryContext is used outside provider", () => {
      const ComponentWithoutProvider = () => {
        useDictionaryContext();
        return <div>Should not render</div>;
      };

      // Expect the error to be thrown
      expect(() => {
        render(<ComponentWithoutProvider />);
      }).toThrow("useDictionaryContext must be used within a DictionaryProvider");
    });
  });

  describe("Memoization", () => {
    it("should not recreate context value when props haven't changed", () => {
      const dictionaries: Dictionary[] = [createDictionary(1, "property_type", "Property Type")];

      const entries: DictionaryEntry[] = [createDictionaryEntry(1, 1, "house", "House")];

      const contextValues: DictionaryContextType[] = [];

      const TestMemoComponent = () => {
        const context = useDictionaryContext();
        contextValues.push(context);
        return <div>Test</div>;
      };

      const { rerender } = render(
        <DictionaryProvider dictionaries={dictionaries} entries={entries}>
          <TestMemoComponent />
        </DictionaryProvider>,
      );

      // Rerender with same props
      rerender(
        <DictionaryProvider dictionaries={dictionaries} entries={entries}>
          <TestMemoComponent />
        </DictionaryProvider>,
      );

      expect(contextValues).toHaveLength(2);
      expect(contextValues[0]).toBe(contextValues[1]); // Should be the same object reference
    });

    it("should recreate context value when props change", () => {
      const dictionaries1: Dictionary[] = [createDictionary(1, "property_type", "Property Type")];

      const dictionaries2: Dictionary[] = [createDictionary(2, "location_type", "Location Type")];

      const entries: DictionaryEntry[] = [createDictionaryEntry(1, 1, "house", "House")];

      const contextValues: DictionaryContextType[] = [];

      const TestMemoComponent = () => {
        const context = useDictionaryContext();
        contextValues.push(context);
        return <div>Test</div>;
      };

      const { rerender } = render(
        <DictionaryProvider dictionaries={dictionaries1} entries={entries}>
          <TestMemoComponent />
        </DictionaryProvider>,
      );

      // Rerender with different dictionaries
      rerender(
        <DictionaryProvider dictionaries={dictionaries2} entries={entries}>
          <TestMemoComponent />
        </DictionaryProvider>,
      );

      expect(contextValues).toHaveLength(2);
      expect(contextValues[0]).not.toBe(contextValues[1]); // Should be different object references
    });
  });
});
