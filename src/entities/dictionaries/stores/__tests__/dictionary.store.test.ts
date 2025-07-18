import { createMockDictionary, createMockDictionaryEntry } from "@/entities/dictionaries/mocks/dictionary-mock-data";
import { createDictionaryStore } from "@/entities/dictionaries/stores/-dictionary.store";

describe("Dictionary Store", () => {
  describe("Dictionary Operations", () => {
    test("should add a dictionary", () => {
      // Arrange
      const store = createDictionaryStore({}, {});
      const dictionary = createMockDictionary(1, "test_type", { en: "Test Dictionary" });

      // Act
      store.getState().addDictionary(dictionary);

      // Assert
      expect(store.getState().dictionaries[1]).toEqual(dictionary);
      expect(store.getState().hasChanged).toBe(true);
    });

    test("should update a dictionary", () => {
      // Arrange
      const dictionary = createMockDictionary(1, "test_type", { en: "Test Dictionary" });
      const store = createDictionaryStore({ 1: dictionary }, {});

      // Act
      store.getState().updateDictionary(1, (draft) => {
        draft.code = "updated_type";
      });

      // Assert
      expect(store.getState().dictionaries[1].code).toBe("updated_type");
      expect(store.getState().hasChanged).toBe(true);
    });

    test("should delete a dictionary", () => {
      // Arrange
      const dictionary = createMockDictionary(1, "test_type", { en: "Test Dictionary" });
      const store = createDictionaryStore({ 1: dictionary }, {});

      // Act
      store.getState().deleteDictionary(1);

      // Assert
      expect(store.getState().dictionaries[1]).toBeUndefined();
      expect(store.getState().hasChanged).toBe(true);
    });

    test("should track deleted dictionary IDs", () => {
      // Arrange
      const dictionary = { ...createMockDictionary(1, "test_type", { en: "Test Dictionary" }), is_new: false };
      const store = createDictionaryStore({ 1: dictionary }, {});

      // Act
      store.getState().deleteDictionary(1);

      // Assert
      expect(store.getState().deletedDictionaryIds).toContain(1);
    });
  });

  describe("Dictionary Entry Operations", () => {
    test("should add an entry", () => {
      // Arrange
      const dictionary = createMockDictionary(1, "test_type", { en: "Test Dictionary" });
      const entry = createMockDictionaryEntry(101, 1, "test_code", { en: "Test Entry" });
      const store = createDictionaryStore({ 1: dictionary }, {});

      // Act
      store.getState().addEntry(1, entry);

      // Assert
      expect(store.getState().entries[1][101]).toEqual(entry);
      expect(store.getState().hasChanged).toBe(true);
    });

    test("should update an entry", () => {
      // Arrange
      const dictionary = createMockDictionary(1, "test_type", { en: "Test Dictionary" });
      const entry = createMockDictionaryEntry(101, 1, "test_code", { en: "Test Entry" });
      const store = createDictionaryStore({ 1: dictionary }, { 1: { 101: entry } });

      // Act
      store.getState().updateEntry(1, 101, (draft) => {
        draft.code = "updated_code";
      });

      // Assert
      expect(store.getState().entries[1][101].code).toBe("updated_code");
      expect(store.getState().hasChanged).toBe(true);
    });

    test("should delete an entry", () => {
      // Arrange
      const dictionary = createMockDictionary(1, "test_type", { en: "Test Dictionary" });
      const entry = createMockDictionaryEntry(101, 1, "test_code", { en: "Test Entry" });
      const store = createDictionaryStore({ 1: dictionary }, { 1: { 101: entry } });

      // Act
      store.getState().deleteEntry(1, 101);

      // Assert
      expect(store.getState().entries[1][101]).toBeUndefined();
      expect(store.getState().hasChanged).toBe(true);
    });

    test("should track deleted entry IDs", () => {
      // Arrange
      const dictionary = createMockDictionary(1, "test_type", { en: "Test Dictionary" });
      const entry = { ...createMockDictionaryEntry(101, 1, "test_code", { en: "Test Entry" }), is_new: false };
      const store = createDictionaryStore({ 1: dictionary }, { 1: { 101: entry } });

      // Act
      store.getState().deleteEntry(1, 101);

      // Assert
      expect(store.getState().deletedEntryIds).toContain(101);
    });
  });
});
