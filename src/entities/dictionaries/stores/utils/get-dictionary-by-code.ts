import { DBCode, Dictionary } from "@/entities/dictionaries";

export function getDictionaryByCode(dictionaries: Record<number, Dictionary>, code: DBCode): Dictionary | undefined {
  const dictionary = Object.values(dictionaries).find((dictionary) => dictionary.code === code);
  return dictionary;
}
