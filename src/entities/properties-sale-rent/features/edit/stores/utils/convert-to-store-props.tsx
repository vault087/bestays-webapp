import { Property } from "@/entities/properties-sale-rent/core/types";

export const convertToPropertyStore = (properties: Property[]) => {
  return properties.reduce(
    (acc, property) => {
      acc[property.id] = {
        ...property,
        is_new: false,
      };
      return acc;
    },
    {} as Record<string, Property>,
  );
};
