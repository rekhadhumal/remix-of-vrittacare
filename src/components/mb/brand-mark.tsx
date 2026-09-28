import { useId } from "react";

import { cn } from "@/lib/utils";

export function BrandMark({ className, large = false }: { className?: string; large?: boolean }) {
  const size = large ? "h-[82px] w-[102px]" : "h-11 w-14";
  const gradientId = useId().replaceAll(":", "");

  return (
    <span className={cn("brand-symbol relative inline-block shrink-0", size, className)} aria-hidden="true">
      <svg viewBox="0 0 104 76" className="h-full w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="15" y1="11" x2="91" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--mb-cyan)" />
            <stop offset="1" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
        <g stroke={`url(#${gradientId})`} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 13C36 8 30 8 26 12C20 9 14 14 15 21C10 22 7 29 10 34C6 39 8 47 14 49C13 57 19 62 26 59C30 65 37 62 40 57V13Z" />
          <path d="M42 13C46 8 52 8 56 12C62 9 68 14 67 21C72 22 75 29 72 34C76 39 74 47 68 49C69 57 63 62 56 59C52 65 45 62 42 57V13Z" />
          <path d="M40 17C35 15 31 18 31 23M40 30C35 27 30 30 30 35M40 44C35 40 30 43 30 49" />
          <path d="M42 17C47 15 51 18 51 23M42 30C47 27 52 30 52 35M42 44C47 40 52 43 52 49M58 19C55 21 54 25 56 29M24 20C27 22 28 26 26 30M17 35C22 34 26 37 26 42M65 35C60 34 56 37 56 42M18 49C22 46 27 48 29 53M64 49C60 46 55 48 53 53" />
          <path d="M41 13V58" />
          <path d="M49 59C58 46 70 42 91 44C87 58 74 66 51 63Z" />
          <path d="M51 63C62 55 75 49 89 45" />
          <path d="M52 57C53 47 48 40 41 37C39 47 43 54 52 57Z" />
        </g>
      </svg>
    </span>
  );
}

export function BrandLockup({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <div className={cn("brand-lockup flex items-center gap-2.5", className)} aria-label="VRITTACARE">
        <BrandMark className="h-9 w-12" />
        <span className="brand-wordmark text-[15px] font-bold leading-none text-foreground">VRITTACARE</span>
      </div>
    );
  }

  return (
    <div className={cn("brand-lockup flex flex-col items-center text-center", className)} aria-label="VRITTACARE — Student's Mental Wellness Companion">
      <BrandMark large />
      <span className="brand-wordmark mt-3 text-[27px] font-bold leading-none text-foreground sm:text-[34px]">VRITTACARE</span>
      <span className="brand-subtitle mt-2 text-[13px] font-medium text-foreground/90 sm:text-[16px]">Student&apos;s Mental Wellness Companion</span>
    </div>
  );
}
