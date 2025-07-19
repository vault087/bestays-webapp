import { MutableDictionary, MutableEntry } from "@/entities/dictionaries";

// Mock dictionaries
export const mockDictionaries: Record<number, MutableDictionary> = {
  1: {
    id: 1,
    code: "PROPERTY_TYPES",
    name: { en: "MutableProperty Types", th: "ประเภทอสังหาริมทรัพย์", ru: "Типы недвижимости" },
    is_new: false,
  },
  2: {
    id: 2,
    code: "location_strengths",
    name: { en: "Location Strength", th: "ทำเล/จุดแข็ง", ru: "Преимущество Местоположения" },
    is_new: false,
  },
  3: {
    id: 3,
    code: "highlights",
    name: { en: "Highlights", th: "จุดเด่น", ru: "Особенности" },
    is_new: false,
  },
};

// Mock dictionary entries
export const mockEntries: Record<number, Record<number, MutableEntry>> = {
  // Areas
  1: {
    101: {
      id: 101,
      dictionary_id: 1,
      name: { en: "Bangkok", th: "กรุงเทพ", ru: "Бангкок" },
      is_new: false,
      is_active: true,
    },
    102: {
      id: 102,
      dictionary_id: 1,
      name: { en: "Phuket", th: "ภูเก็ต", ru: "Пхукет" },
      is_new: false,
      is_active: true,
    },
    103: {
      id: 103,
      dictionary_id: 1,
      name: { en: "Chiang Mai", th: "เชียงใหม่", ru: "Чиангмай" },
      is_new: false,
      is_active: true,
    },
  },

  // Location Strengths
  2: {
    201: {
      id: 201,
      dictionary_id: 2,
      name: { en: "Near Beach", th: "ใกล้ชายหาด", ru: "Рядом с пляжем" },
      is_new: false,
      is_active: true,
    },
    202: {
      id: 202,
      dictionary_id: 2,
      name: { en: "City Center", th: "ใจกลางเมือง", ru: "Центр города" },
      is_new: false,
      is_active: true,
    },
  },

  // Highlights
  3: {
    301: {
      id: 301,
      dictionary_id: 3,
      name: { en: "Swimming Pool", th: "สระว่ายน้ำ", ru: "Бассейн" },
      is_new: false,
      is_active: true,
    },
    302: {
      id: 302,
      dictionary_id: 3,
      name: { en: "Garden", th: "สวน", ru: "Сад" },
      is_new: false,
      is_active: true,
    },
  },
};

// Helper function to create a new dictionary
export function createMockDictionary(id: number, code: string, name: Record<string, string>): MutableDictionary {
  return {
    id,
    code,
    name,
    is_new: true,
  };
}

// Helper function to create a new dictionary entry
export function createMockDictionaryEntry(
  id: number,
  dictionaryId: number,
  name: Record<string, string>,
): MutableEntry {
  return {
    id,
    dictionary_id: dictionaryId,
    name,
    is_new: true,
    is_active: true,
  };
}
