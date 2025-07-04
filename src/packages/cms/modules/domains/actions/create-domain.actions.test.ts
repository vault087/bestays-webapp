// Mock dependencies first
jest.mock("@cms-data/modules/domains/domain.libs");
jest.mock("next/navigation");

// Mock crypto.randomUUID for Node.js test environment
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "123e4567-e89b-12d3-a456-426614174000"),
  },
});

import { createDomain } from "@cms-data/modules/domains/domain.libs";
import { createMockDomainFormData, mockDomain } from "@cms/modules/domains/components/new-domain.mock";
import { NewDomainState } from "@cms/modules/domains/components/new-domain.types";
import { createDomainAction } from './create-domain.actions';

const mockCreateDomainLib = createDomain as jest.MockedFunction<typeof createDomain>;

describe("createDomainAction action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateDomainLib.mockResolvedValue(mockDomain);
  });

  test("should create domain successfully: FormData → domain creation → redirect", async () => {
    const initialState: NewDomainState = {
      domain: null,
      error: null,
    };

    const mockFormData = createMockDomainFormData(mockDomain);

    const result = await createDomainAction(initialState, mockFormData);

    expect(result.domain).toBeDefined();
    expect(result.error).toBeNull();

    expect(mockCreateDomainLib).toHaveBeenCalledTimes(1);
    const [domainArg] = mockCreateDomainLib.mock.calls[0];
    expect(domainArg.code).toBe(mockDomain.code);
    expect(domainArg.name).toEqual(mockDomain.name);
    expect(domainArg.is_active).toBe(mockDomain.is_active);
  });

  test("should handle database errors: dbCreateDomain fails → return error state", async () => {
    const initialState: NewDomainState = {
      domain: null,
      error: null,
    };

    const mockFormData = createMockDomainFormData(mockDomain);
    const errorMessage = "Database connection failed";
    mockCreateDomainLib.mockRejectedValue(new Error(errorMessage));

    const result = await createDomainAction(initialState, mockFormData);

    expect(result.error).toBe(errorMessage);
    expect(result.domain).toBeNull();
  });

  test("should transform FormData correctly: localized fields → domain object → verify structure", async () => {
    const initialState: NewDomainState = {
      domain: null,
      error: null,
    };

    const simpleFormData = new FormData();
    simpleFormData.append("name[en]", "Test Domain");
    simpleFormData.append("name[th]", "");
    simpleFormData.append("name[ru]", "");
    simpleFormData.append("code", "test-domain");
    simpleFormData.append("is_active", "true");

    const result = await createDomainAction(initialState, simpleFormData);

    expect(result.domain).toBeDefined();
    expect(result.error).toBeNull();

    expect(mockCreateDomainLib).toHaveBeenCalledTimes(1);
    const [domainArg] = mockCreateDomainLib.mock.calls[0];
    expect(domainArg.name).toEqual({ en: "Test Domain", th: "", ru: "" });
    expect(domainArg.code).toBe("test-domain");
    expect(domainArg.is_active).toBe(true);
  });

  test("should handle empty language fields: user deletes text → empty strings preserved", async () => {
    const initialState: NewDomainState = {
      domain: null,
      error: null,
    };

    const formDataPartialEmpty = new FormData();
    formDataPartialEmpty.append("name[en]", "Domain Name");
    formDataPartialEmpty.append("name[th]", "");
    formDataPartialEmpty.append("name[ru]", "");
    formDataPartialEmpty.append("code", "domain-code");
    formDataPartialEmpty.append("is_active", "false");

    const result = await createDomainAction(initialState, formDataPartialEmpty);

    expect(result.domain).toBeDefined();
    expect(result.error).toBeNull();

    expect(mockCreateDomainLib).toHaveBeenCalledTimes(1);
    let [domainArg] = mockCreateDomainLib.mock.calls[0];
    expect(domainArg.name).toEqual({ en: "Domain Name", th: "", ru: "" });

    mockCreateDomainLib.mockClear();

    const formDataAllEmpty = new FormData();
    formDataAllEmpty.append("name[en]", "");
    formDataAllEmpty.append("name[th]", "");
    formDataAllEmpty.append("name[ru]", "");
    formDataAllEmpty.append("code", "domain-code-2");
    formDataAllEmpty.append("is_active", "true");

    const result2 = await createDomainAction(initialState, formDataAllEmpty);

    expect(result2.domain).toBeDefined();
    expect(result2.error).toBeNull();

    expect(mockCreateDomainLib).toHaveBeenCalledTimes(1);
    [domainArg] = mockCreateDomainLib.mock.calls[0];
    expect(domainArg.name).toEqual({ en: "", th: "", ru: "" });
    expect(domainArg.code).toBe("domain-code-2");
    expect(domainArg.is_active).toBe(true);
  });

  test("should handle constraint violations: duplicate code → return error without redirect", async () => {
    const initialState: NewDomainState = {
      domain: null,
      error: null,
    };

    const constraintError = new Error("Domain code already exists");
    mockCreateDomainLib.mockRejectedValue(constraintError);

    const validFormData = new FormData();
    validFormData.append("name[en]", "Test Domain");
    validFormData.append("name[th]", "");
    validFormData.append("name[ru]", "");
    validFormData.append("code", "existing-code");
    validFormData.append("is_active", "true");

    const result = await createDomainAction(initialState, validFormData);

    expect(result.error).toBe("Domain code already exists");
    expect(result.domain).toBeNull();
    expect(mockCreateDomainLib).toHaveBeenCalledTimes(1);
  });
});
