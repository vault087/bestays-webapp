"use server";

import {
  getBaseDomainProperties,
  getBaseDomainPropertyOptions,
  batchUpdateProperties as coreBatchUpdateProperties,
} from "@cms-data/modules/properties/property.libs";
import { Property, PropertySchema, PropertyOption } from './property.types';

export async function getDomainProperties(domainId: string): Promise<Property[]> {
  const [properties, options] = await Promise.all([
    getBaseDomainProperties(domainId),
    getBaseDomainPropertyOptions(domainId),
  ]);
  return properties.map((property) =>
    PropertySchema.parse({
      ...property,
      options: options
        .filter((option) => option.property_id === property.id)
        .map((option) => ({
          ...option,
          is_new: false,
        })),
      is_new: false,
    }),
  );
}

export async function batchUpdateProperties(
  userId: string,
  domainId: string,
  allProperties: Property[],
  allOptions: PropertyOption[],
  deletedPropertyIds: string[],
  deletedOptionIds: string[],
): Promise<void> {
  return coreBatchUpdateProperties(userId, domainId, allProperties, allOptions, deletedPropertyIds, deletedOptionIds);
}
