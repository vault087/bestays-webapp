"use client";

import { useRef, useEffect } from "react";

export function useDebugRender(componentName: string): void {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (process.env.NODE_ENV === "development") {
      console.log(`${componentName} rendered (${renderCount.current})`);
    }
  });
}
