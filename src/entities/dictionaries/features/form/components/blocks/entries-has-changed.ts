import { DBDictionaryEntry } from "@/entities/dictionaries";

export function entriesHasChanged(initial: DBDictionaryEntry[] | undefined, current: DBDictionaryEntry[]): boolean {
  if (!initial) return true;
  if (!current) return true;
  if (initial.length !== current.length) return true;
  return initial.some((entry, index) => entryHasChanged(entry, current[index]));
}

export function entryHasChanged(initial: DBDictionaryEntry | undefined, current: DBDictionaryEntry): boolean {
  if (!initial) return true;

  const initialComparable = { ...initial };
  const currentComparable = { ...current };

  return shallowDiff(initialComparable, currentComparable);
}

function shallowDiff(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return true;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return true;
    }
  }

  return false;
}
