import logoAsset from "@/assets/vrittacare-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function BrandMark({ className, large = false }: { className?: string; large?: boolean }) {
  return (
    <img
      src={logoAsset.url}
      alt=""
      width={680}
      height={530}
      className={cn("block h-auto shrink-0 object-contain", large ? "w-[176px] sm:w-[209px]" : "w-[47px]", className)}
      aria-hidden="true"
    />
  );
}

export function BrandLockup({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <div className={cn("brand-lockup flex items-center gap-2.5", className)} aria-label="VRITTACARE">
        <BrandMark />
        <span className="brand-wordmark text-[15px] font-bold leading-none text-foreground">VRITTACARE</span>
      </div>
    );
  }

  return (
    <div className={cn("brand-lockup flex flex-col items-center text-center", className)} aria-label="VRITTACARE — Student's Mental Wellness Companion">
      <BrandMark large />
      <span className="brand-wordmark mt-2.5 text-[24px] font-bold leading-none text-foreground sm:text-[30px]">VRITTACARE</span>
      <span className="brand-subtitle mt-1.5 text-[11.5px] font-medium text-foreground/90 sm:text-[14px]">Student&apos;s Mental Wellness Companion</span>
    </div>
  );
}
