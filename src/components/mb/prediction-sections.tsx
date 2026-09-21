import { AlertTriangle, Eye, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PredictionResponse } from "@/lib/prediction";

const GROUPS = [
  {
    key: "needs_attention",
    label: "Needs Attention",
    empty: "No items were flagged as needing attention.",
    icon: AlertTriangle,
    className: "border-mb-pink/30 bg-mb-pink/8",
    iconClassName: "text-mb-pink",
  },
  {
    key: "watch",
    label: "Watch",
    empty: "No items were placed on watch.",
    icon: Eye,
    className: "border-mb-amber/30 bg-mb-amber/8",
    iconClassName: "text-mb-amber",
  },
  {
    key: "stable",
    label: "Stable",
    empty: "No items were marked stable.",
    icon: ShieldCheck,
    className: "border-mb-green/30 bg-mb-green/8",
    iconClassName: "text-mb-green",
  },
] as const;

export function PredictionSections({
  result,
  compact = false,
}: {
  result: PredictionResponse;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        !compact && "lg:grid-cols-3",
      )}
    >
      {GROUPS.map((group) => {
        const items = result[group.key];
        const Icon = group.icon;

        return (
          <section
            key={group.key}
            className={cn(
              "rounded-xl border p-4",
              group.className,
            )}
          >
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <Icon
                className={cn(
                  "h-4 w-4",
                  group.iconClassName,
                )}
              />

              {group.label}

              <span className="ml-auto text-xs font-medium text-muted-foreground">
                {items.length}
              </span>
            </h3>

            {items.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {items.map((item, index) => (
                  <li
                    key={`${group.key}-${index}-${item}`}
                    className="flex gap-2 text-sm leading-relaxed text-foreground/85"
                  >
                    <span
                      className={cn(
                        "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                        group.iconClassName,
                        "bg-current",
                      )}
                    />

                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">
                        {item.split(" — ")[0]}
                      </p>

                      <p className="mt-1 text-sm text-foreground/80">
                        {item
                          .split(" — ")
                          .slice(1)
                          .join(" — ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {group.empty}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
