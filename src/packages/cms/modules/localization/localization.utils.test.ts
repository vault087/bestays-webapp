import { localizedTextFromBrackets } from './localization.utils';

describe("localizedTextFromBrackets", () => {
  test("should extract localized text from bracket notation: bracket syntax → LocalizedText object", () => {
    const formObject = {
      "name[en]": "English Name",
      "name[th]": "ชื่อไทย",
      "name[ru]": "Русское имя",
    };

    const result = localizedTextFromBrackets(formObject, "name");

    expect(result).toEqual({
      en: "English Name",
      th: "ชื่อไทย",
      ru: "Русское имя",
    });
  });

  test("should handle missing language fields: partial data → only present fields included", () => {
    const formObject = {
      "title[en]": "English Title",
    };

    const result = localizedTextFromBrackets(formObject, "title");

    expect(result).toEqual({
      en: "English Title", // th and ru should NOT be present
    });
  });

  test("should handle empty string values: empty strings → preserved as empty strings", () => {
    const formObject = {
      "desc[en]": "",
      "desc[th]": "",
      "desc[ru]": "Content",
    };

    const result = localizedTextFromBrackets(formObject, "desc");

    expect(result).toEqual({
      en: "",
      th: "",
      ru: "Content",
    });
  });

  test("should handle completely missing prefix: no matching fields → empty object", () => {
    const formObject = {
      "other[en]": "Other content",
      "different[th]": "Different content",
    };

    const result = localizedTextFromBrackets(formObject, "missing");

    expect(result).toEqual({}); // Should be an empty object
  });

  test("should handle FormDataEntryValue types: File objects → converted to string", () => {
    const file = new File(["content"], "test.txt", { type: "text/plain" });
    const formObject: Record<string, FormDataEntryValue> = {
      "file[en]": file,
      "file[th]": "Regular string",
      // ru intentionally omitted
    };

    const result = localizedTextFromBrackets(formObject, "file");

    expect(result.en).toBe("[object File]");
    expect(result.th).toBe("Regular string");
    expect(result.ru).toBeUndefined(); // ru key should not be present
  });

  test("should handle special characters and unicode: complex text → preserved correctly", () => {
    const formObject = {
      "content[en]": "Special: @#$%^&*()",
      "content[th]": "ไทย: ก่อนหน้านี้ 🇹🇭",
      "content[ru]": "Русский: Привет! 🇷🇺",
    };

    const result = localizedTextFromBrackets(formObject, "content");

    expect(result).toEqual({
      en: "Special: @#$%^&*()",
      th: "ไทย: ก่อนหน้านี้ 🇹🇭",
      ru: "Русский: Привет! 🇷🇺",
    });
  });

  test("should handle whitespace-only values: spaces → preserved as strings", () => {
    const formObject = {
      "space[en]": "   ",
      "space[th]": "\t\n",
      "space[ru]": " \r ",
    };

    const result = localizedTextFromBrackets(formObject, "space");

    expect(result).toEqual({
      en: "   ",
      th: "\t\n",
      ru: " \r ",
    });
  });

  test("should handle null and undefined values: falsy values → empty strings if key exists, otherwise absent", () => {
    const formObject: Record<string, FormDataEntryValue> = {
      "test[en]": "" as FormDataEntryValue,
      "test[ru]": "Valid content",
      // th is not present
    };

    const result = localizedTextFromBrackets(formObject, "test");

    expect(result).toEqual({
      en: "",
      ru: "Valid content", // th should not be present
    });
  });

  test("should handle numeric values: numbers → converted to strings", () => {
    const formObject = {
      "num[en]": "123",
      "num[th]": "456.78",
      "num[ru]": "0",
    };

    const result = localizedTextFromBrackets(formObject, "num");

    expect(result).toEqual({
      en: "123",
      th: "456.78",
      ru: "0",
    });
  });

  test("should handle long text values: very long strings → preserved correctly", () => {
    const longText = "A".repeat(1000);
    const formObject = {
      "long[en]": longText,
      "long[th]": "B".repeat(500),
      "long[ru]": "C".repeat(750),
    };

    const result = localizedTextFromBrackets(formObject, "long");

    expect(result.en).toBe(longText);
    expect(result.th).toBe("B".repeat(500));
    expect(result.ru).toBe("C".repeat(750));
  });
});

describe("Edge Cases and Integration", () => {
  test("should handle mixed bracket notation: some fields present → consistent behavior", () => {
    const formObject = {
      "mixed[en]": "English",
      "mixed[th]": "",
      "other[en]": "Should not interfere",
    };

    const result = localizedTextFromBrackets(formObject, "mixed");

    expect(result).toEqual({
      en: "English",
      th: "", // ru should not be present
    });
  });

  test("should handle case sensitivity: exact prefix match required", () => {
    const formObject = {
      "Name[en]": "Capitalized",
      "name[en]": "Lowercase",
      "NAME[en]": "Uppercase",
    };

    const result = localizedTextFromBrackets(formObject, "name");

    expect(result).toEqual({
      en: "Lowercase", // th and ru should not be present
    });
  });

  test("should handle similar prefixes: exact match only", () => {
    const formObject = {
      "name[en]": "Correct",
      "names[en]": "Should not match",
      "name_test[en]": "Should not match",
    };

    const result = localizedTextFromBrackets(formObject, "name");

    expect(result).toEqual({
      en: "Correct", // th and ru should not be present
    });
  });

  test("should handle empty prefix: empty string prefix → match bracket-only fields", () => {
    const formObject = {
      "[en]": "Empty prefix English",
      "[th]": "Empty prefix Thai",
      "[ru]": "Empty prefix Russian",
    };

    const result = localizedTextFromBrackets(formObject, "");

    expect(result).toEqual({
      en: "Empty prefix English",
      th: "Empty prefix Thai",
      ru: "Empty prefix Russian",
    });
  });
});
