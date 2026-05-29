import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border-2 border-sand bg-cream px-4 text-sm text-wood-950 placeholder:text-muted focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20",
        className
      )}
      {...props}
    />
  );
}
