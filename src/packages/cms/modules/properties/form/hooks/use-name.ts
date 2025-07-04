"use client";

import { useLocaleTextDisplay, useLocaleTextInput } from "./utils/use-locale-text";

export function useNameDisplay(): string | undefined {
  return useLocaleTextDisplay("name");
}

export function useNameInput(variant = ""): {
  inputId: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
} {
  return useLocaleTextInput("name", variant);
}
