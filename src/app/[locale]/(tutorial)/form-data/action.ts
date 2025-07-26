"use server";
import qs from "qs";
import { FormState, ItemsWithTransform, ItemsWithTransformSchema } from "./types";

export async function updateFormData(prevState: FormState, formData: FormData): Promise<FormState> {
  const raw = new URLSearchParams(formData as unknown as string).toString();
  const parsed = qs.parse(raw);

  const items = (parsed.items as unknown[]) || [];
  let verified: ItemsWithTransform[] = [];

  try {
    verified = items.map((item) => {
      const directParse = ItemsWithTransformSchema.parse(item);
      return directParse;
    });
  } catch (error) {
    console.log("direct parse failed:", (error as Error).message);
  }

  // Flat arrays for external use
  // const flatItems = verified.map((item) => ({ id: item.id, name: item.name, type: item.type, number: item.number }));
  // const flatOptions = verified.flatMap((item) => item.options);

  // console.log("items:", flatItems, "options:", flatOptions);

  // console.log("verified:", verified);
  return { ...prevState, items: verified };
}
