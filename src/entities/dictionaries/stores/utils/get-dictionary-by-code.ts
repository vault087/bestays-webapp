import { DBCode, MutableDictionary } from "@/entities/dictionaries";

export function getDictionaryByCode(
  dictionaries: Record<number, MutableDictionary>,
  code: DBCode,
): MutableDictionary | undefined {
  const dictionary = Object.values(dictionaries).find((dictionary) => dictionary.code === code);
  return dictionary;
}
