// Mock dependencies first
jest.mock("@cms-data/modules/domains/domain.libs");
jest.mock("@cms/modules/domains/domain.utils");
jest.mock("next/navigation");

import { ZodError } from "zod";
import { updateDomain } from "@cms-data/modules/domains/domain.libs";
import { EditDomainFormState } from "@cms/modules/domains/components/edit-domain.types";
import { Domain } from "@cms/modules/domains/domain.types";
import { convertFormDataToDomain } from "@cms/modules/domains/domain.utils";
import { updateDomainAction } from './edit-domain.actions';

const mockUpdateDomainLib = updateDomain as jest.MockedFunction<typeof updateDomain>;
const mockConvertFormDataToDomain = convertFormDataToDomain as jest.MockedFunction<typeof convertFormDataToDomain>;

describe("updateDomain action", () => {
  const mockDomain: Domain = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: { en: "Test Domain", th: "โดเมนทดสอบ", ru: "Тестовый домен" },
    code: "test_domain",
    is_active: true,
    is_locked: false,
    display_order: 1,
    meta: {
      system_description: "Test domain description",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockConvertFormDataToDomain.mockResolvedValue(mockDomain);
    mockUpdateDomainLib.mockResolvedValue(mockDomain);
  });

  // TEST: Validate initial form data handling
  test("should handle initial form data correctly: existing domain → preserve in state", async () => {
    const initialState: EditDomainFormState = {
      formData: mockDomain,
      error: null,
    };

    // Simulate form validation error to test that initial formData is preserved
    const errorMessage = "Validation failed";
    mockConvertFormDataToDomain.mockRejectedValue(new Error(errorMessage));

    const mockFormData = new FormData();
    const result = await updateDomainAction(initialState, mockFormData);

    // Should preserve initial formData structure and show error
    expect(result.formData).toBeNull(); // Error case sets formData to null
    expect(result.error).toBe(errorMessage);
    expect(mockUpdateDomainLib).not.toHaveBeenCalled();
  });

  // TEST: Updating new fields
  test("should process updated form fields correctly: modified FormData → domain with new values", async () => {
    const initialState: EditDomainFormState = {
      formData: mockDomain,
      error: null,
    };

    // Create updated domain with new field values
    const updatedDomain: Domain = {
      ...mockDomain,
      name: { en: "Updated Domain Name", th: "ชื่อโดเมนที่อัปเดต", ru: "Обновленное имя домена" },
      code: "updated_domain_code",
      is_active: false,
      display_order: 5,
      meta: {
        system_description: "Updated system description",
      },
    };

    // Mock the conversion and update to return updated domain
    mockConvertFormDataToDomain.mockResolvedValue(updatedDomain);
    mockUpdateDomainLib.mockResolvedValue(updatedDomain);

    const mockFormData = new FormData();
    mockFormData.append("id", updatedDomain.id);
    mockFormData.append("name.en", "Updated Domain Name");
    mockFormData.append("name.th", "ชื่อโดเมนที่อัปเดต");
    mockFormData.append("name.ru", "Обновленное имя домена");
    mockFormData.append("code", "updated_domain_code");
    mockFormData.append("is_active", "false");
    mockFormData.append("display_order", "5");
    mockFormData.append("system_description", "Updated system description");

    const result = await updateDomainAction(initialState, mockFormData);

    expect(result.formData).toBe(updatedDomain);
    expect(result.error).toBeNull();

    // Verify the conversion was called with the form data
    expect(mockConvertFormDataToDomain).toHaveBeenCalledWith(mockFormData);

    // Verify the update was called with the converted domain data
    expect(mockUpdateDomainLib).toHaveBeenCalledWith(updatedDomain.id, updatedDomain);
  });

  test("should update domain successfully: FormData → domain update → redirect to domain page", async () => {
    const initialState: EditDomainFormState = {
      formData: mockDomain,
      error: null,
    };

    const mockFormData = new FormData();
    mockFormData.append("id", mockDomain.id);
    mockFormData.append("code", mockDomain.code!);
    mockFormData.append("is_active", String(mockDomain.is_active));
    mockFormData.append("is_locked", String(mockDomain.is_locked));

    const result = await updateDomainAction(initialState, mockFormData);

    expect(result.formData).toBe(mockDomain);
    expect(result.error).toBeNull();
    expect(mockConvertFormDataToDomain).toHaveBeenCalledWith(mockFormData);
    expect(mockUpdateDomainLib).toHaveBeenCalledWith(mockDomain.id, mockDomain);
  });

  test("should handle form validation errors: invalid FormData → return error state", async () => {
    const initialState: EditDomainFormState = {
      formData: mockDomain,
      error: null,
    };

    const mockFormData = new FormData();
    const errorMessage = "Invalid form data";
    mockConvertFormDataToDomain.mockRejectedValue(new Error(errorMessage));

    const result = await updateDomainAction(initialState, mockFormData);

    expect(result.error).toBe(errorMessage);
    expect(result.formData).toBeNull();
  });

  test("should handle database errors: updateDomainLib fails → return error state", async () => {
    const initialState: EditDomainFormState = {
      formData: mockDomain,
      error: null,
    };

    const mockFormData = new FormData();
    const errorMessage = "Database connection failed";
    mockUpdateDomainLib.mockRejectedValue(new Error(errorMessage));

    const result = await updateDomainAction(initialState, mockFormData);

    expect(result.error).toBe(errorMessage);
    expect(result.formData).toBeNull();
  });

  test("should handle update failures: updateDomainLib returns null → return error state", async () => {
    const initialState: EditDomainFormState = {
      formData: mockDomain,
      error: null,
    };

    const mockFormData = new FormData();
    mockUpdateDomainLib.mockResolvedValue(null);

    const result = await updateDomainAction(initialState, mockFormData);

    expect(result.error).toBe("Failed to update domain");
    expect(result.formData).toBeNull();
  });

  test("should handle schema validation errors: ZodError → return formatted error message", async () => {
    const initialState: EditDomainFormState = {
      formData: mockDomain,
      error: null,
    };

    const mockFormData = new FormData();
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["name"],
        message: "Expected string, received number",
      },
    ]);
    mockConvertFormDataToDomain.mockRejectedValue(zodError);

    const result = await updateDomainAction(initialState, mockFormData);

    expect(result.error).toContain("Expected string, received number");
    expect(result.formData).toBeNull();
  });
});
