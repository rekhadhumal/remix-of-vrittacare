import { Activity, BookOpen, MonitorSmartphone, Moon, Wind } from "lucide-react";

import { StatusPill } from "@/components/mb/primitives";
import { lifestyleCards, type AssessmentInput } from "@/lib/mb";

const ICONS = {
  sleep: Moon,
  study: BookOpen,
  screen: MonitorSmartphone,
  activity: Activity,
  stress: Wind,
} as const;

export function WellnessMetrics({ assessment }: { assessment: AssessmentInput }) {
  const cards = lifestyleCards(assessment);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = ICONS[card.key];

        return (
          <article key={card.key} className="min-h-[142px] rounded-xl border border-mb-line bg-mb-panel-2/55 p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-mb-line bg-background/25 text-mb-cyan">
                <Icon className="h-[18px] w-[18px] stroke-[1.8]" />
              </span>
              <StatusPill tone={card.tone}>{card.tag}</StatusPill>
            </div>
            <p className="mt-4 text-xl font-extrabold text-foreground">
              {card.value}
              {card.unit ? <span className="ml-1 text-xs font-medium text-muted-foreground">{card.unit}</span> : null}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
          </article>
        );
      })}
    </div>
  );
}