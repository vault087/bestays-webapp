import { MutableDictionary, MutableEntry } from "@/entities/dictionaries/features/edit";

// Enhanced mock dictionaries covering all property fields
export const enhancedMockDictionaries: MutableDictionary[] = [
  // Areas
  {
    id: 1,
    code: "areas",
    name: { en: "Areas", th: "พื้นที่", ru: "Области" },
    description: { en: "Property areas", th: "พื้นที่อสังหาริมทรัพย์" },
    is_new: false,
  },
  // Property Types
  {
    id: 2,
    code: "property_types",
    name: { en: "Property Types", th: "ประเภทอสังหาริมทรัพย์", ru: "Типы недвижимости" },
    description: { en: "Types of properties", th: "ประเภทของอสังหาริมทรัพย์" },
    is_new: false,
  },
  // Ownership Types
  {
    id: 3,
    code: "ownership_types",
    name: { en: "Ownership Types", th: "ประเภทการครอบครอง", ru: "Типы владения" },
    description: { en: "Types of ownership", th: "ประเภทของการครอบครอง" },
    is_new: false,
  },
  // Divisible Sale Types
  {
    id: 4,
    code: "divisible_sale_types",
    name: { en: "Divisible Sale", th: "การขายแบ่งแยก", ru: "Делимая продажа" },
    description: { en: "Can property be sold in parts", th: "สามารถขายแยกส่วนได้หรือไม่" },
    is_new: false,
  },
  // Location Strengths
  {
    id: 5,
    code: "location_strengths",
    name: { en: "Location Strengths", th: "จุดแข็งของทำเล", ru: "Преимущества местоположения" },
    description: { en: "Location advantages", th: "ข้อดีของทำเล" },
    is_new: false,
  },
  // Highlights
  {
    id: 6,
    code: "highlights",
    name: { en: "Highlights", th: "จุดเด่น", ru: "Особенности" },
    description: { en: "Property highlights", th: "จุดเด่นของอสังหาริมทรัพย์" },
    is_new: false,
  },
  // Transaction Types
  {
    id: 7,
    code: "transaction_types",
    name: { en: "Transaction Types", th: "ประเภทการทำธุรกรรม", ru: "Типы сделок" },
    description: { en: "Types of transactions", th: "ประเภทของการทำธุรกรรม" },
    is_new: false,
  },
  // Land Features
  {
    id: 8,
    code: "land_features",
    name: { en: "Land Features", th: "ลักษณะที่ดิน", ru: "Особенности земли" },
    description: { en: "Features of the land", th: "ลักษณะของที่ดิน" },
    is_new: false,
  },
  // Nearby Attractions
  {
    id: 9,
    code: "nearby_attractions",
    name: { en: "Nearby Attractions", th: "สถานที่ใกล้เคียง", ru: "Близлежащие достопримечательности" },
    description: { en: "Attractions near property", th: "สถานที่น่าสนใจใกล้อสังหาริมทรัพย์" },
    is_new: false,
  },
  // Land and Construction
  {
    id: 10,
    code: "land_and_construction",
    name: { en: "Land & Construction", th: "ที่ดินและการก่อสร้าง", ru: "Земля и строительство" },
    description: { en: "Land and construction details", th: "รายละเอียดที่ดินและการก่อสร้าง" },
    is_new: false,
  },
];

// Enhanced mock dictionary entries covering all property fields
export const enhancedMockEntries: MutableEntry[] = [
  // Areas (id: 1)
  {
    id: 101,
    dictionary_id: 1,
    name: { en: "Bangkok", th: "กรุงเทพ", ru: "Бангкок" },
    is_new: false,
    is_active: true,
  },
  {
    id: 102,
    dictionary_id: 1,
    name: { en: "Phuket", th: "ภูเก็ต", ru: "Пхукет" },
    is_new: false,
    is_active: true,
  },
  {
    id: 103,
    dictionary_id: 1,
    name: { en: "Chiang Mai", th: "เชียงใหม่", ru: "Чиангмай" },
    is_new: false,
    is_active: true,
  },

  // Property Types (id: 2)
  {
    id: 201,
    dictionary_id: 2,
    name: { en: "House", th: "บ้าน", ru: "Дом" },
    is_new: false,
    is_active: true,
  },
  {
    id: 202,
    dictionary_id: 2,
    name: { en: "Condominium", th: "คอนโดมิเนียม", ru: "Кондоминиум" },
    is_new: false,
    is_active: true,
  },
  {
    id: 203,
    dictionary_id: 2,
    name: { en: "Villa", th: "วิลล่า", ru: "Вилла" },
    is_new: false,
    is_active: true,
  },

  // Ownership Types (id: 3)
  {
    id: 301,
    dictionary_id: 3,
    name: { en: "Freehold", th: "โฉนดที่ดิน", ru: "Частная собственность" },
    is_new: false,
    is_active: true,
  },
  {
    id: 302,
    dictionary_id: 3,
    name: { en: "Leasehold", th: "สิทธิการเช่า", ru: "Арендная собственность" },
    is_new: false,
    is_active: true,
  },

  // Divisible Sale Types (id: 4)
  {
    id: 401,
    dictionary_id: 4,
    name: { en: "Yes", th: "ได้", ru: "Да" },
    is_new: false,
    is_active: true,
  },
  {
    id: 402,
    dictionary_id: 4,
    name: { en: "No", th: "ไม่ได้", ru: "Нет" },
    is_new: false,
    is_active: true,
  },

  // Location Strengths (id: 5)
  {
    id: 501,
    dictionary_id: 5,
    name: { en: "Near Beach", th: "ใกล้ชายหาด", ru: "Рядом с пляжем" },
    is_new: false,
    is_active: true,
  },
  {
    id: 502,
    dictionary_id: 5,
    name: { en: "City Center", th: "ใจกลางเมือง", ru: "Центр города" },
    is_new: false,
    is_active: true,
  },
  {
    id: 503,
    dictionary_id: 5,
    name: { en: "Mountain View", th: "วิวภูเขา", ru: "Вид на горы" },
    is_new: false,
    is_active: true,
  },

  // Highlights (id: 6)
  {
    id: 601,
    dictionary_id: 6,
    name: { en: "Swimming Pool", th: "สระว่ายน้ำ", ru: "Бассейн" },
    is_new: false,
    is_active: true,
  },
  {
    id: 602,
    dictionary_id: 6,
    name: { en: "Garden", th: "สวน", ru: "Сад" },
    is_new: false,
    is_active: true,
  },
  {
    id: 603,
    dictionary_id: 6,
    name: { en: "Sea View", th: "วิวทะเล", ru: "Вид на море" },
    is_new: false,
    is_active: true,
  },

  // Transaction Types (id: 7)
  {
    id: 701,
    dictionary_id: 7,
    name: { en: "Sale", th: "ขาย", ru: "Продажа" },
    is_new: false,
    is_active: true,
  },
  {
    id: 702,
    dictionary_id: 7,
    name: { en: "Rent", th: "เช่า", ru: "Аренда" },
    is_new: false,
    is_active: true,
  },

  // Land Features (id: 8)
  {
    id: 801,
    dictionary_id: 8,
    name: { en: "Flat Land", th: "ที่ดินเรียบ", ru: "Ровная земля" },
    is_new: false,
    is_active: true,
  },
  {
    id: 802,
    dictionary_id: 8,
    name: { en: "Corner Plot", th: "ที่ดินหัวมุม", ru: "Угловой участок" },
    is_new: false,
    is_active: true,
  },

  // Nearby Attractions (id: 9)
  {
    id: 901,
    dictionary_id: 9,
    name: { en: "Beach", th: "ชายหาด", ru: "Пляж" },
    is_new: false,
    is_active: true,
  },
  {
    id: 902,
    dictionary_id: 9,
    name: { en: "Shopping Mall", th: "ห้างสรรพสินค้า", ru: "Торговый центр" },
    is_new: false,
    is_active: true,
  },

  // Land and Construction (id: 10)
  {
    id: 1001,
    dictionary_id: 10,
    name: { en: "New Construction", th: "ก่อสร้างใหม่", ru: "Новое строительство" },
    is_new: false,
    is_active: true,
  },
  {
    id: 1002,
    dictionary_id: 10,
    name: { en: "Modern Style", th: "สไตล์โมเดิร์น", ru: "Современный стиль" },
    is_new: false,
    is_active: true,
  },
];
