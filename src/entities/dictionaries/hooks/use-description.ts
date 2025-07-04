"use client";

import { useLocaleTextInput, useLocaleTextDisplay } from "./utils/use-locale-text";

export function useDescriptionDisplay(): string | undefined {
  return useLocaleTextDisplay("description");
}

export function useDescriptionInput(variant = ""): {
  inputId: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
} {
  return useLocaleTextInput("description", variant);
}
