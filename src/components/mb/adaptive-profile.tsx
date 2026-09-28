import { RadarChart } from "@/components/mb/radar-chart";
import { cn } from "@/lib/utils";

type Point = { label: string; value: number };

function variantFor(assessment: Record<string, unknown>) {
  const raw = Object.values(assessment).map((value) => String(value)).join("|");
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  return hash % 2;
}

export function AdaptiveProfile({ assessment, data }: { assessment: Record<string, unknown>; data: Point[] }) {
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

  return null;
}
