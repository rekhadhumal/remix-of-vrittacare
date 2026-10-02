import { RadarChart } from "@/components/mb/radar-chart";

type Point = { label: string; value: number };

function variantFor(assessment: Record<string, unknown>) {
  const raw = Object.values(assessment).map((value) => String(value)).join("|");
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  return hash % 2;
}

function signalLabel(value: number) {
  if (value >= 0.78) return "Strong signal";
  if (value >= 0.55) return "Balanced";
  if (value >= 0.38) return "Could improve";
  return "Needs attention";
}

function rawValue(label: string, assessment: Record<string, unknown>) {
  if (label === "Sleep") return typeof assessment.sleep_hours_per_night === "number" ? `${assessment.sleep_hours_per_night.toFixed(1)} hrs` : "";
  if (label === "Study") return typeof assessment.study_hours === "number" ? `${assessment.study_hours.toFixed(1)} hrs` : "";
  if (label === "Activity") return typeof assessment.physical_activity_hours === "number" ? `${assessment.physical_activity_hours.toFixed(1)} hrs` : "";
  if (label === "Screen Usage") return typeof assessment.avg_daily_usage_hours === "number" ? `${assessment.avg_daily_usage_hours.toFixed(1)} hrs` : "";
  if (label === "Stress") return typeof assessment.stress_level === "string" ? assessment.stress_level : "";
  return "";
}

export function AdaptiveProfile({ assessment, data }: { assessment: Record<string, unknown>; data: Point[] }) {
  if (!data?.length) return null;
  const variant = variantFor(assessment);

  if (variant === 0) {
    const strongest = data.reduce((best, item) => (item.value > best.value ? item : best), data[0]);
    const focus = data.reduce((lowest, item) => (item.value < lowest.value ? item : lowest), data[0]);

    return (
      <div className="space-y-3 px-1 py-2">
        <RadarChart data={data} />
        <div className="grid grid-cols-2 gap-2 px-2">
          <div className="rounded-xl border border-mb-cyan/15 bg-mb-cyan/[0.045] px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-mb-cyan">Strongest</p>
            <div className="mt-1 flex items-end justify-between gap-2">
              <span className="text-sm font-bold">{strongest.label}</span>
              <span className="text-xs font-semibold text-foreground/70">{Math.round(strongest.value * 100)}%</span>
            </div>
          </div>
          <div className="rounded-xl border border-mb-violet/15 bg-mb-violet/[0.045] px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-mb-violet">Notice</p>
            <div className="mt-1 flex items-end justify-between gap-2">
              <span className="text-sm font-bold">{focus.label}</span>
              <span className="text-xs font-semibold text-foreground/70">{Math.round(focus.value * 100)}%</span>
            </div>
          </div>
        </div>
        <p className="px-2 text-center text-[9px] leading-relaxed text-muted-foreground">
          Profile percentages are relative signals from your assessment, not medical ratings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-1 py-3">
      {data.map((item, index) => {
        const percent = Math.round(item.value * 100);
        const label = signalLabel(item.value);
        const raw = rawValue(item.label, assessment);
        const isStrong = item.label === data.reduce((best, current) => (current.value > best.value ? current : best), data[0]).label;
        const isFocus = item.label === data.reduce((lowest, current) => (current.value < lowest.value ? current : lowest), data[0]).label;

        return (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.025] px-3.5 py-3 transition hover:border-mb-cyan/20 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{item.label}</span>
                  {isStrong ? <span className="rounded-full border border-mb-cyan/20 bg-mb-cyan/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-mb-cyan">Strongest</span> : null}
                  {isFocus ? <span className="rounded-full border border-mb-violet/20 bg-mb-violet/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-mb-violet">Notice</span> : null}
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{raw || "Assessment signal"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{percent}%</p>
                <p className="text-[9px] font-medium text-muted-foreground">{label}</p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full border border-white/10 bg-black/25">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-mb-cyan via-primary to-mb-violet shadow-[0_0_14px_rgba(34,211,238,.22)] transition-[width] duration-1000 ease-out"
                  style={{ width: `${percent}%`, transitionDelay: `${index * 90}ms` }}
                />
              </div>
              <span className="w-9 text-right text-[9px] font-semibold text-muted-foreground">signal</span>
            </div>
          </div>
        );
      })}
      <p className="px-2 pt-1 text-center text-[9px] leading-relaxed text-muted-foreground">
        Higher profile percentages indicate a stronger relative signal in this visualization. They are not clinical scores.
      </p>
    </div>
  );
}
