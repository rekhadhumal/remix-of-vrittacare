import { Brain, Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative inline-block h-11 w-14 shrink-0 text-mb-cyan", className)}
      aria-hidden="true"
    >
      <Brain className="absolute left-0 top-0 h-10 w-10 stroke-[1.8]" />
      <Leaf className="absolute bottom-0 right-0 h-7 w-7 -rotate-12 stroke-[1.8] text-primary" />
      <span className="absolute bottom-1 left-[35px] h-5 w-px -rotate-[27deg] bg-mb-cyan" />
    </span>
  );
}