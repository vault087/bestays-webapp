"use client";

import { useTextInput, useTextDisplay } from "./utils/use-text";

export function useCodeDisplay(): string | undefined {
  return useTextDisplay("code");
}

export function useCodeInput(variant?: string): {
  inputId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  return useTextInput("code", variant);
}
