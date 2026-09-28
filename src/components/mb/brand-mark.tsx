import { cn } from "@/lib/utils";

export function BrandMark({ className, large = false }: { className?: string; large?: boolean }) {
  const size = large ? "h-[74px] w-[94px]" : "h-11 w-14";

  return (
    <span className={cn("relative inline-block shrink-0", size, className)} aria-hidden="true">
      <svg viewBox="0 0 96 64" className="h-full w-full overflow-visible" fill="none">
        <g stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M48 10C44 6 39 6 35 9C29 6 22 10 22 16C16 16 12 21 13 27C9 31 10 38 15 41C14 47 19 52 25 51C29 57 37 57 41 52C44 54 46 53 48 51"
            className="text-mb-cyan"
          />
          <path
            d="M48 10C52 6 57 6 61 9C67 6 74 10 74 16C80 16 84 21 83 27C87 31 86 38 81 41C82 47 77 52 71 51C67 57 59 57 55 52C52 54 50 53 48 51"
            className="text-mb-cyan"
          />
          <path d="M48 11V50" className="text-mb-cyan" />
          <path d="M29 21C34 19 38 22 39 27" className="text-mb-cyan/80" />
          <path d="M67 21C62 19 58 22 57 27" className="text-mb-cyan/80" />
          <path d="M25 34C31 31 36 34 39 39" className="text-mb-cyan/80" />
          <path d="M71 34C65 31 60 34 57 39" className="text-mb-cyan/80" />
        </g>
        <g stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M57 45C62 37 70 36 77 39C74 47 67 51 58 50Z" />
          <path d="M58 49C63 45 68 42 75 39" />
        </g>
      </svg>
    </span>
  );
}
