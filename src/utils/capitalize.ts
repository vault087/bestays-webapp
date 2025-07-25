/**
 * Capitalizes the first letter of a string and makes the rest lowercase
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalizes each word in a string (Title Case)
 * @param str - The string to convert to title case
 * @returns The title cased string
 */
export function toTitleCase(str: string): string {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}
