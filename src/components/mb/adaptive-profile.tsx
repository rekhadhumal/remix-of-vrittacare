import { RadarChart } from "@/components/mb/radar-chart";
import { cn } from "@/lib/utils";

type Point = { label: string; value: number };

function variantFor(assessment: Record<string, unknown>) {
  const raw = Object.values(assessment).map((value) => String(value)).join("|");
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  return hash % 4;
}

export function AdaptiveProfile({ assessment }: { assessment: Record<string, unknown> }) {
  const data = assessment.__profile as Point[] | undefined;
  if (!data?.length) return null;
  const variant = variantFor(assessment);

  if (variant === 0) return <RadarChart data={data} />;

  if (variant === 1) {
    return (
      <div className="space-y-4 px-3 py-5">
        {data.map((item, index) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold">{item.label}</span>
              <span className="text-muted-foreground">{Math.round(item.value * 100)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-black/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mb-cyan via-primary to-mb-violet shadow-[0_0_16px_rgba(34,211,238,.28)] transition-all duration-1000"
                style={{ width: Math.round(item.value * 100) + "%", transitionDelay: index * 90 + "ms" }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 2) {
    return (
      <div className="flex min-h-[245px] items-center justify-center">
        <div className="relative h-56 w-56">
          {[0, 1, 2, 3, 4].map((ring) => {
            const item = data[ring % data.length];
            const size = 100 - ring * 16;
            const angle = Math.round(item.value * 260 + ring * 20);
            const distance = Math.max(14, size / 5);
            return (
              <div
                key={item.label + ring}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-mb-cyan/20 bg-mb-cyan/[0.025]"
                style={{ width: size + "%", height: size + "%", boxShadow: "inset 0 0 28px rgba(34,211,238,.05)" }}
              >
                <div
                  className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mb-cyan shadow-[0_0_18px_rgba(34,211,238,.8)]"
                  style={{ transform: "translateX(-50%) rotate(" + angle + "deg) translateY(-" + distance + "px)" }}
                />
              </div>
            );
          })}
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-2xl font-extrabold text-mb-cyan">
                {Math.round((data.reduce((sum, item) => sum + item.value, 0) / data.length) * 100)}%
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">balance</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[245px] grid-cols-5 items-end gap-2 px-2 pb-6 pt-5">
      {data.map((item, index) => (
        <div key={item.label} className="flex h-full flex-col items-center justify-end gap-2">
          <div className="flex h-44 w-full items-end rounded-2xl border border-white/10 bg-black/15 p-1.5">
            <div
              className={cn("w-full rounded-xl bg-gradient-to-t from-mb-violet via-primary to-mb-cyan shadow-[0_0_20px_rgba(34,211,238,.22)] transition-all duration-1000")}
              style={{ height: Math.max(18, Math.round(item.value * 100)) + "%", transitionDelay: index * 100 + "ms" }}
            />
          </div>
          <span className="max-w-[64px] text-center text-[9px] leading-tight text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
