import { Code, Dictionary } from "@/entities/dictionaries";

export function getDictionaryByCode(dictionaries: Record<number, Dictionary>, code: Code): Dictionary | undefined {
  const dictionary = Object.values(dictionaries).find((dictionary) => dictionary.code === code);
  return dictionary;
}
