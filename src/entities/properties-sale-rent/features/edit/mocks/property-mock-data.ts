import { Property } from "@/entities/properties-sale-rent/features/edit/types/property-field.types";

// Helper function to create a mock property
export function createMockProperty(id: string, overrides?: Partial<Property>): Property {
  const defaultProperty: Property = {
    id,
    title: { en: "Test Property", th: "ทรัพย์สินทดสอบ" },
    description: { en: "Test description", th: "คำอธิบายทดสอบ" },
    ownership_type: "freehold",
    property_type: "house",
    area: "bangkok",
    location_strengths: ["near_beach", "city_center"],
    highlights: ["pool", "garden"],
    transaction_types: ["sale", "rent"],
    size: {
      value: 100,
      unit: "sqm",
    },
    price: {
      currency: "thb",
      total: 5000000,
      sale: 4500000,
      rai: 2000000,
    },
    divisible_sale: "yes",
    notes: "Test notes",
    land_features: ["flat", "corner"],
    room_counts: {
      bedrooms: 3,
      bathrooms: 2,
      living_rooms: 1,
    },
    nearby_attractions: ["beach", "mall"],
    land_and_construction: ["new_construction", "modern"],
    additional_info: "Additional test info",
    images: [],
    is_published: false,
    is_new: false,
  };

  return { ...defaultProperty, ...overrides };
}

// Test properties
export const mockProperties: Record<string, Property> = {
  "prop-1": createMockProperty("prop-1"),
  "prop-2": createMockProperty("prop-2", {
    area: "phuket",
    highlights: ["sea_view"],
    location_strengths: [],
  }),
  "prop-3": createMockProperty("prop-3", {
    property_type: "condo",
    ownership_type: "leasehold",
    highlights: [],
  }),
};

export const testProperty = createMockProperty("test-property-id");
