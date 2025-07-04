/**
 * @fileoverview Test data generators for property form components
 * Provides arrays of test values with validity indicators
 */

import { Property } from "@cms/modules/properties/property.types";

// Type for validity pairs - [value, isValid]
export type ValidityPair<T> = [T, boolean];

// Generator options
export interface PropertyGeneratorOptions {
  onlyValid?: boolean;
  onlyInvalid?: boolean;
  singleField?: boolean; // Return just one invalid field, rest valid
}

/**
 * Test values for property names - [value, isValid]
 */
export const nameValues: ValidityPair<string>[] = [
  // Valid names
  ["Property Name", true],
  ["Valid Name", true],
  ["Name123", true],
  ["Name with spaces", true],
  ["Property-Name", true],
  ["Property_Name", true],

  // Invalid names (empty, too long, etc.)
  ["", false],
  ["   ", false],
  ["A".repeat(256), false], // Too long
];

/**
 * Test values for property descriptions - [value, isValid]
 */
export const descriptionValues: ValidityPair<string>[] = [
  // Valid descriptions
  ["This is a description", true],
  ["Short desc", true],
  ["Description with numbers 123", true],
  ["Multi-line\ndescription", true],

  // Invalid descriptions
  ["", false],
  ["   ", false],
  ["A".repeat(1001), false], // Too long
];

/**
 * Test values for property codes - [value, isValid]
 */
export const codeValues: ValidityPair<string>[] = [
  // Valid codes
  ["VALID_CODE", true],
  ["property_code", true],
  ["code123", true],
  ["CODE", true],

  // Invalid codes
  ["", false],
  ["   ", false],
  ["invalid code", false], // Contains space
  ["invalid-code", false], // Contains dash
  ["123invalid", false], // Starts with number
  ["A".repeat(65), false], // Too long
];

// Property Test Generator class
export class PropertyTestGenerator {
  private nameIndex = 0;
  private codeIndex = 0;
  private descriptionIndex = 0;

  reset(): void {
    this.nameIndex = 0;
    this.codeIndex = 0;
    this.descriptionIndex = 0;
  }

  getNextName(options?: { onlyValid?: boolean; onlyInvalid?: boolean }): ValidityPair<string> {
    return this.getNextValue(nameValues, this.nameIndex++, options);
  }

  getNextCode(options?: { onlyValid?: boolean; onlyInvalid?: boolean }): ValidityPair<string> {
    return this.getNextValue(codeValues, this.codeIndex++, options);
  }

  getNextDescription(options?: { onlyValid?: boolean; onlyInvalid?: boolean }): ValidityPair<string> {
    return this.getNextValue(descriptionValues, this.descriptionIndex++, options);
  }

  private getNextValue<T>(
    values: ValidityPair<T>[],
    index: number,
    options?: { onlyValid?: boolean; onlyInvalid?: boolean },
  ): ValidityPair<T> {
    const normalizedIndex = index % values.length;

    if (options?.onlyValid) {
      // Filter for valid values only
      const validValues = values.filter(([, isValid]) => isValid);
      return validValues[normalizedIndex % validValues.length];
    }

    if (options?.onlyInvalid) {
      // Filter for invalid values only
      const invalidValues = values.filter(([, isValid]) => !isValid);
      return invalidValues[normalizedIndex % invalidValues.length];
    }

    return values[normalizedIndex];
  }

  // Field indices for tracking rotation
  private fieldIndices = {
    name: 0,
    code: 0,
    description: 0,
  };

  generateProperty(options?: PropertyGeneratorOptions): {
    property: Partial<Property>;
    isValid: boolean;
    invalidFields: string[];
    errorMessages: Record<string, string>;
  } {
    const getValidityFiltered = (
      getter: () => ValidityPair<string>,
      fieldName: string,
      opts?: PropertyGeneratorOptions,
    ): ValidityPair<string> => {
      if (opts?.onlyValid) return getter();
      if (opts?.onlyInvalid) return getter();
      if (opts?.singleField) {
        // (Single field invalid logic could be implemented here if needed)
        return getter();
      }
      return getter();
    };

    // Use typed functions instead of generic function
    const getNextNameWithOptions = (): ValidityPair<string> => this.getNextName(options);

    const getNextCodeWithOptions = (): ValidityPair<string> => this.getNextCode(options);

    const getNextDescriptionWithOptions = (): ValidityPair<string> => this.getNextDescription(options);

    const [name, nameValid] = getValidityFiltered(getNextNameWithOptions, "name", options);
    const [code, codeValid] = getValidityFiltered(getNextCodeWithOptions, "code", options);
    const [description, descValid] = getValidityFiltered(getNextDescriptionWithOptions, "description", options);

    const invalidFields = [
      !nameValid ? "name" : null,
      !codeValid ? "code" : null,
      !descValid ? "description" : null,
    ].filter(Boolean) as string[];

    const errorMessages: Record<string, string> = {};
    if (!nameValid) errorMessages.name = "Name is invalid";
    if (!codeValid) errorMessages.code = "Code is invalid";
    if (!descValid) errorMessages.description = "Description is invalid";

    return {
      property: {
        name: { en: name },
        code,
        description: { en: description },
      },
      isValid: nameValid && codeValid && descValid,
      invalidFields,
      errorMessages,
    };
  }

  // Generate all possible combinations
  generateAllCombinations(): Array<{
    property: Partial<Property>;
    isValid: boolean;
    invalidFields: string[];
    errorMessages: Record<string, string>;
  }> {
    const results = [];
    const totalCombinations = nameValues.length * codeValues.length * descriptionValues.length;

    this.reset();

    for (let i = 0; i < totalCombinations; i++) {
      results.push(this.generateProperty());

      // Cycle through all combinations systematically
      this.nameIndex++;
      if (this.nameIndex % nameValues.length === 0) {
        this.codeIndex++;
        if (this.codeIndex % codeValues.length === 0) {
          this.descriptionIndex++;
        }
      }
    }

    return results;
  }

  // Generate n properties with options
  generateProperties(
    count: number,
    options?: PropertyGeneratorOptions,
  ): Array<{
    property: Partial<Property>;
    isValid: boolean;
    invalidFields: string[];
    errorMessages: Record<string, string>;
  }> {
    const properties = [];
    for (let i = 0; i < count; i++) {
      properties.push(this.generateProperty(options));
    }
    return properties;
  }

  /**
   * Generate name test values
   */
  static getNameValues(): ValidityPair<string>[] {
    return nameValues;
  }

  /**
   * Generate code test values
   */
  static getCodeValues(): ValidityPair<string>[] {
    return codeValues;
  }

  /**
   * Generate description test values
   */
  static getDescriptionValues(): ValidityPair<string>[] {
    return descriptionValues;
  }

  /**
   * Get only valid values for a specific field type
   */
  static getValidValues(fieldType: "name" | "code" | "description"): string[] {
    const values = fieldType === "name" ? nameValues : fieldType === "code" ? codeValues : descriptionValues;

    return values.filter((item) => item[1]).map((item) => item[0]);
  }

  /**
   * Get only invalid values for a specific field type
   */
  static getInvalidValues(fieldType: "name" | "code" | "description"): string[] {
    const values = fieldType === "name" ? nameValues : fieldType === "code" ? codeValues : descriptionValues;

    return values.filter((item) => !item[1]).map((item) => item[0]);
  }
}

export default PropertyTestGenerator;
