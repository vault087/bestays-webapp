import { Dictionary, DictionaryEntry } from "@/entities/dictionaries";

// Mock dictionaries
export const mockDictionaries: Record<number, Dictionary> = {
  1: {
    id: 1,
    code: "areas",
    name: { en: "Area", th: "พื้นที่", ru: "Район" },
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
export const mockEntries: Record<number, Record<number, DictionaryEntry>> = {
  // Areas
  1: {
    101: {
      id: 101,
      dictionary_id: 1,
      code: "bangkok",
      name: { en: "Bangkok", th: "กรุงเทพ", ru: "Бангкок" },
      is_new: false,
    },
    102: {
      id: 102,
      dictionary_id: 1,
      code: "phuket",
      name: { en: "Phuket", th: "ภูเก็ต", ru: "Пхукет" },
      is_new: false,
    },
    103: {
      id: 103,
      dictionary_id: 1,
      code: "chiang_mai",
      name: { en: "Chiang Mai", th: "เชียงใหม่", ru: "Чиангмай" },
      is_new: false,
    },
  },

  // Location Strengths
  2: {
    201: {
      id: 201,
      dictionary_id: 2,
      code: "near_beach",
      name: { en: "Near Beach", th: "ใกล้ชายหาด", ru: "Рядом с пляжем" },
      is_new: false,
    },
    202: {
      id: 202,
      dictionary_id: 2,
      code: "city_center",
      name: { en: "City Center", th: "ใจกลางเมือง", ru: "Центр города" },
      is_new: false,
    },
  },

  // Highlights
  3: {
    301: {
      id: 301,
      dictionary_id: 3,
      code: "pool",
      name: { en: "Swimming Pool", th: "สระว่ายน้ำ", ru: "Бассейн" },
      is_new: false,
    },
    302: {
      id: 302,
      dictionary_id: 3,
      code: "garden",
      name: { en: "Garden", th: "สวน", ru: "Сад" },
      is_new: false,
    },
  },
};

// Helper function to create a new dictionary
export function createMockDictionary(id: number, code: string, name: Record<string, string>): Dictionary {
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
  code: string,
  name: Record<string, string>,
): DictionaryEntry {
  return {
    id,
    dictionary_id: dictionaryId,
    code,
    name,
    is_new: true,
  };
}
