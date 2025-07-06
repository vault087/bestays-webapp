import { useProperty } from "@/entities/properties-sale-rent";

export function usePropertyCodeField(id: string) {
  const property = useProperty(id);
  if (!property) return undefined;
}
