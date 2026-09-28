import { cn } from "@/lib/utils";

export function BrandMark({ className, large = false }: { className?: string; large?: boolean }) {
  const size = large ? "h-[82px] w-[102px]" : "h-11 w-14";

  return (
    <span className={cn("brand-symbol relative inline-block shrink-0", size, className)} aria-hidden="true">
      <svg viewBox="0 0 104 76" className="h-full w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="vritta-mark-gradient" x1="18" y1="12" x2="87" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--mb-cyan)" />
            <stop offset="1" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
        <g stroke="url(#vritta-mark-gradient)" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50 13C46 8 39 8 35 12C28 9 21 14 22 21C16 22 13 29 16 34C11 39 13 47 19 49C18 57 25 62 32 59C37 65 46 62 50 57V13Z" />
          <path d="M54 13C58 8 65 8 69 12C76 9 83 14 82 21C88 22 91 29 88 34C92 37 92 42 90 46" />
          <path d="M50 17C44 15 40 18 40 23M50 30C44 27 39 30 39 35M50 44C44 40 38 43 38 49" />
          <path d="M54 17C60 15 64 18 64 23M54 30C60 27 65 30 65 35M72 19C68 21 67 25 69 29M32 20C36 22 37 26 35 30M24 35C30 34 34 37 34 42M80 34C74 33 70 36 70 41M24 49C29 46 35 48 37 53" />
          <path d="M52 13V58" />
          <path d="M56 58C63 47 72 43 87 45C84 56 74 63 58 62Z" />
          <path d="M58 61C66 55 75 50 85 46" />
          <path d="M58 57C59 48 55 43 49 39C47 48 50 54 58 57Z" />
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
