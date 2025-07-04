"use client";

import { useOptionLocaleTextDisplay, useOptionLocaleTextInput } from "./utils/use-locale-text";

export function useOptionNameDisplay(): string | undefined {
  return useOptionLocaleTextDisplay("name");
}

export function useOptionNameInput(variant = ""): {
  inputId: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
} {
  return useOptionLocaleTextInput("name", variant);
}
