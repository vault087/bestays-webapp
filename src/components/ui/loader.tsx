import React from "react";
import { cn } from "@/modules/shadcn";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoaderOne({ className, size = "md" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("animate-spin", sizeClasses[size], className)}>
      <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          className="animate-[dash_1.5s_ease-in-out_infinite]"
        />
      </svg>
    </div>
  );
}

export function ShimmerLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-[shimmer_2s_infinite] animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
        className,
      )}
    />
  );
}

export function CompactLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
    </div>
  );
}
