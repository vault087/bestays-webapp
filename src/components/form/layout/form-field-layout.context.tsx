"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";

export type FormFieldLayoutContextType = {
  focused: boolean;
  setFocused: (focused: boolean) => void;
};

// Create context with proper type safety
export const FormFieldLayoutContext = createContext<FormFieldLayoutContextType | null>(null);

// Store Provider props
export interface FormFieldLayoutProviderProps {
  children: ReactNode;
  focused: boolean;
  setFocused: (focused: boolean) => void;
}

// Store Provider component
export const FormFieldLayoutProvider = ({ children, focused, setFocused }: FormFieldLayoutProviderProps) => {
  const contextValue = useMemo(() => {
    return {
      focused,
      setFocused,
    };
  }, [focused, setFocused]);

  return <FormFieldLayoutContext.Provider value={contextValue}>{children}</FormFieldLayoutContext.Provider>;
};

// Context hook
export function useFormFieldLayout(): FormFieldLayoutContextType {
  const context = useContext(FormFieldLayoutContext);
  return context || { focused: false, setFocused: () => {} };
}
