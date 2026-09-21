import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-mb-line bg-mb-panel/92 p-5 shadow-mb-card backdrop-blur-xl transition-all duration-300",
        hover && "hover:-translate-y-0.5 hover:border-mb-cyan/25 hover:shadow-mb-glow",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <header className="mb-4">
      <h2 className="text-[15px] font-bold text-foreground">{children}</h2>
      {sub ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{sub}</p> : null}
    </header>
  );
}

export function StatusPill({ tone, children }: { tone: "good" | "warn" | "bad"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tone === "good" && "bg-mb-green/15 text-mb-green",
        tone === "warn" && "bg-mb-amber/15 text-mb-amber",
        tone === "bad" && "bg-mb-pink/15 text-mb-pink",
      )}
    >
      {children}
    </span>
  );
}
