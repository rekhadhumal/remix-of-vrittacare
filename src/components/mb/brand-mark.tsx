import { Brain, Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandMark({ className, large = false }: { className?: string; large?: boolean }) {
  return (
    <span
      className={cn("relative inline-block shrink-0 text-mb-cyan", large ? "h-[74px] w-[94px]" : "h-11 w-14", className)}
      aria-hidden="true"
    >
      <Brain className={cn("absolute left-0 top-0 stroke-[1.8]", large ? "h-[68px] w-[68px]" : "h-10 w-10")} />
      <Leaf className={cn("absolute bottom-0 right-0 -rotate-12 stroke-[1.8] text-primary", large ? "h-11 w-11" : "h-7 w-7")} />
      <span className={cn("absolute bottom-1 w-px -rotate-[27deg] bg-mb-cyan", large ? "left-[58px] h-7" : "left-[35px] h-5")} />
    </span>
  );
}