"use client";

import { useOptionTextInput, useOptionTextDisplay } from "./utils/use-text";

export function useOptionCodeDisplay(): string | undefined {
  return useOptionTextDisplay("code");
}

export function useOptionCodeInput(variant?: string): {
  inputId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  return useOptionTextInput("code", variant);
}
