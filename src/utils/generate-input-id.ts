export function generateInputId(
  entityType: string, // 'property', 'domain', 'group', etc.
  entityId: string, // UUID of the entity
  fieldName: string, // 'name', 'description', 'code', etc.
  variant: string = "", // For variant fields only
  locale?: string, // For localized fields only
): string {
  const suffix = variant.length > 0 ? `_${variant}` : "";
  const baseId = `${entityType}-${fieldName}-input-${entityId}${suffix}`;
  return locale ? `${baseId}-${locale}` : baseId;
}
