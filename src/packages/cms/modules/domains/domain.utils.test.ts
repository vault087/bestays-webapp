import { convertFormDataToDomain, convertFormDataToNewDomain } from './domain.utils';

// Mock data helpers
const createBasicFormData = (includeId = false): FormData => {
  const formData = new FormData();

  if (includeId) {
    formData.append("id", "550e8400-e29b-41d4-a716-446655440000");
  }

  formData.append("name[en]", "Test Domain");
  formData.append("name[th]", "โดเมนทดสอบ");
  formData.append("name[ru]", "Тестовый домен");
  formData.append("code", "test_domain");
  formData.append("is_active", "true");
  formData.append("is_locked", "false");
  formData.append("display_order", "1");
  formData.append("meta[system_description]", "Test domain description");

  return formData;
};

const createMinimalFormData = (includeId = false): FormData => {
  const formData = new FormData();

  if (includeId) {
    formData.append("id", "550e8400-e29b-41d4-a716-446655440000");
  }

  formData.append("name[en]", "Minimal Domain");
  formData.append("is_active", "false");
  formData.append("is_locked", "false");

  return formData;
};

describe("convertFormDataToDomain", () => {
  test("should convert complete FormData to Domain: all fields → verify full transformation", async () => {
    const formData = createBasicFormData(true);

    const domain = await convertFormDataToDomain(formData);

    expect(domain.id).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(domain.name).toEqual({
      en: "Test Domain",
      th: "โดเมนทดสอบ",
      ru: "Тестовый домен",
    });
    expect(domain.code).toBe("test_domain");
    expect(domain.is_active).toBe(true);
    expect(domain.is_locked).toBe(false);
    expect(domain.display_order).toBe(1);
    expect(domain.meta).toEqual({
      system_description: "Test domain description",
    });
  });

  test("should handle minimal FormData: required fields only → verify defaults", async () => {
    const formData = createMinimalFormData(true);

    const domain = await convertFormDataToDomain(formData);

    expect(domain.id).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(domain.name).toEqual({
      en: "Minimal Domain",
    });
    expect(domain.code).toBeNull();
    expect(domain.is_active).toBe(false);
    expect(domain.is_locked).toBe(false);
    expect(domain.display_order).toBeNull();
    expect(domain.meta).toBeNull();
  });

  test("should handle boolean string conversions: 'true'/'false' strings → boolean values", async () => {
    const formData = new FormData();
    formData.append("id", "550e8400-e29b-41d4-a716-446655440000");
    formData.append("name[en]", "Boolean Test");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const domain = await convertFormDataToDomain(formData);

    expect(domain.is_active).toBe(true);
    expect(domain.is_locked).toBe(false);
  });

  test("should handle number string conversions: string numbers → numeric values", async () => {
    const formData = new FormData();
    formData.append("id", "550e8400-e29b-41d4-a716-446655440000");
    formData.append("name[en]", "Number Test");
    formData.append("display_order", "42");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const domain = await convertFormDataToDomain(formData);

    expect(domain.display_order).toBe(42);
  });

  test("should handle empty localized fields: missing language values → empty strings", async () => {
    const formData = new FormData();
    formData.append("id", "550e8400-e29b-41d4-a716-446655440000");
    formData.append("name[en]", "English Only");
    // Missing th and ru values
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const domain = await convertFormDataToDomain(formData);

    expect(domain.name).toEqual({
      en: "English Only",
    });
  });

  test("should handle meta field variations: different meta sources → correct meta object", async () => {
    const formData = new FormData();
    formData.append("id", "550e8400-e29b-41d4-a716-446655440000");
    formData.append("name[en]", "Meta Test");
    formData.append("system_description", "Direct system description");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const domain = await convertFormDataToDomain(formData);

    expect(domain.meta).toEqual({
      system_description: "Direct system description",
    });
  });

  test("should handle meta bracket notation: meta[system_description] → meta object", async () => {
    const formData = new FormData();
    formData.append("id", "550e8400-e29b-41d4-a716-446655440000");
    formData.append("name[en]", "Meta Bracket Test");
    formData.append("meta[system_description]", "Bracket notation description");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const domain = await convertFormDataToDomain(formData);

    expect(domain.meta).toEqual({
      system_description: "Bracket notation description",
    });
  });

  test("should handle missing meta: no system_description → null meta", async () => {
    const formData = new FormData();
    formData.append("id", "550e8400-e29b-41d4-a716-446655440000");
    formData.append("name[en]", "No Meta Test");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const domain = await convertFormDataToDomain(formData);

    expect(domain.meta).toBeNull();
  });

  test("should handle null/undefined values: missing optional fields → null values", async () => {
    const formData = new FormData();
    formData.append("id", "550e8400-e29b-41d4-a716-446655440000");
    formData.append("name[en]", "Null Test");
    formData.append("is_active", "false");
    formData.append("is_locked", "false");
    // Missing code, display_order, meta

    const domain = await convertFormDataToDomain(formData);

    expect(domain.code).toBeNull();
    expect(domain.display_order).toBeNull();
    expect(domain.meta).toBeNull();
  });

  test("should throw validation error: missing required id → schema validation fails", async () => {
    const formData = new FormData();
    formData.append("name[en]", "Missing ID Test");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    await expect(convertFormDataToDomain(formData)).rejects.toThrow();
  });

  test("should throw validation error: invalid UUID format → schema validation fails", async () => {
    const formData = new FormData();
    formData.append("id", "invalid-uuid");
    formData.append("name[en]", "Invalid UUID Test");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    await expect(convertFormDataToDomain(formData)).rejects.toThrow();
  });
});

describe("convertFormDataToNewDomain", () => {
  test("should convert complete FormData to NewDomain: all fields without id → verify transformation", async () => {
    const formData = createBasicFormData(false);

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain).not.toHaveProperty("id");
    expect(newDomain.name).toEqual({
      en: "Test Domain",
      th: "โดเมนทดสอบ",
      ru: "Тестовый домен",
    });
    expect(newDomain.code).toBe("test_domain");
    expect(newDomain.is_active).toBe(true);
    expect(newDomain.is_locked).toBe(false);
    expect(newDomain.display_order).toBe(1);
    expect(newDomain.meta).toEqual({
      system_description: "Test domain description",
    });
  });

  test("should handle minimal FormData: required fields only → verify defaults", async () => {
    const formData = createMinimalFormData(false);

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain).not.toHaveProperty("id");
    expect(newDomain.name).toEqual({
      en: "Minimal Domain",
    });
    expect(newDomain.code).toBeNull();
    expect(newDomain.is_active).toBe(false);
    expect(newDomain.is_locked).toBe(false);
    expect(newDomain.display_order).toBeNull();
    expect(newDomain.meta).toBeNull();
  });

  test("should ignore id field: FormData with id → NewDomain without id", async () => {
    const formData = createBasicFormData(true); // includes id

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain).not.toHaveProperty("id");
    expect(newDomain.name?.en).toBe("Test Domain");
  });

  test("should handle empty FormData: no fields → default values with empty localized text", async () => {
    const formData = new FormData();

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain).not.toHaveProperty("id");
    expect(newDomain.name).toEqual({});
    expect(newDomain.code).toBeNull();
    expect(newDomain.is_active).toBe(false);
    expect(newDomain.is_locked).toBe(false);
    expect(newDomain.display_order).toBeNull();
    expect(newDomain.meta).toBeNull();
  });

  test("should handle special characters in localized text: unicode → preserved correctly", async () => {
    const formData = new FormData();
    formData.append("name[en]", "Special chars: @#$%^&*()");
    formData.append("name[th]", "ไทย: ก่อนหน้านี้");
    formData.append("name[ru]", "Русский: Привет мир");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain.name).toEqual({
      en: "Special chars: @#$%^&*()",
      th: "ไทย: ก่อนหน้านี้",
      ru: "Русский: Привет мир",
    });
  });

  test("should handle edge case display_order: zero value → preserved as zero", async () => {
    const formData = new FormData();
    formData.append("name[en]", "Zero Order Test");
    formData.append("display_order", "0");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain.display_order).toBe(0);
  });

  test("should handle edge case display_order: negative value → preserved as negative", async () => {
    const formData = new FormData();
    formData.append("name[en]", "Negative Order Test");
    formData.append("display_order", "-5");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain.display_order).toBe(-5);
  });

  test("should handle long text values: very long strings → preserved correctly", async () => {
    const longText = "A".repeat(1000);
    const formData = new FormData();
    formData.append("name[en]", longText);
    formData.append("code", "long_text_test");
    formData.append("meta[system_description]", longText);
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain.name?.en).toBe(longText);
    expect(newDomain.meta?.system_description).toBe(longText);
  });
});

describe("Edge Cases and Error Handling", () => {
  test("should handle FormData with duplicate keys: last value wins", async () => {
    const formData = new FormData();
    formData.append("name[en]", "First Value");
    formData.append("name[en]", "Second Value");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain.name?.en).toBe("Second Value");
  });

  test("should handle empty string values: empty strings → converted to null for code", async () => {
    const formData = new FormData();
    formData.append("code", "");
    formData.append("is_active", "false");
    formData.append("is_locked", "false");

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain.name).toEqual({});
    expect(newDomain.code).toBeNull(); // Empty string becomes null due to || null logic
  });

  test("should handle whitespace-only values: spaces preserved", async () => {
    const formData = new FormData();
    formData.append("name[en]", "   ");
    formData.append("code", "  test  ");
    formData.append("is_active", "true");
    formData.append("is_locked", "false");

    const newDomain = await convertFormDataToNewDomain(formData);

    expect(newDomain.name?.en).toBe("   ");
    expect(newDomain.code).toBe("  test  ");
  });
});
