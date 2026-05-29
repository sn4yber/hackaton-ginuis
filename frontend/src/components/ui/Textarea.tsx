import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-lg border-2 border-sand bg-cream px-4 py-3 text-sm text-wood-950 placeholder:text-muted focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20",
        className
      )}
      {...props}
    />
  );
}
