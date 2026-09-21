import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, Compass, Sparkles } from "lucide-react";

import { AppShell } from "@/components/mb/app-shell";
import { PredictionSections } from "@/components/mb/prediction-sections";
import { Panel, SectionTitle, StatusPill } from "@/components/mb/primitives";
import { RadarChart } from "@/components/mb/radar-chart";
import { ScoreGauge } from "@/components/mb/score-gauge";
import { radarValues, scoreStatus } from "@/lib/mb";
import { loadPrediction, type SavedPrediction } from "@/lib/prediction";

export const Route = createFileRoute("/_authenticated/results")({
  head: () => ({
    meta: [
      { title: "My Results · VRITTACARE" },
      { name: "description", content: "Review your VRITTACARE assessment result from the prediction model." },
      { property: "og:title", content: "My Results · VRITTACARE" },
      { property: "og:description", content: "Review your wellness result from the prediction model." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const [saved, setSaved] = useState<SavedPrediction | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSaved(loadPrediction());
    setChecked(true);
  }, []);

  return (
    <AppShell>
      <Panel>
        <SectionTitle sub="Scored by your local prediction model from your latest assessment.">
          My Results
        </SectionTitle>

        {!checked ? null : saved ? (
          <div className="grid gap-4">
            <div className={saved.assessment ? "grid gap-4 lg:grid-cols-2" : "grid gap-4"}>
              <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-center sm:flex-row sm:gap-6">
                <div className="pointer-events-none absolute -left-12 top-10 h-40 w-40 rounded-full bg-mb-cyan/12 blur-3xl animate-pulse" />
                <ScoreGauge score={saved.result.score} />
                <div className="relative mt-3 sm:mt-0 sm:text-left">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Mental Health Score</p>
                  <p className="mt-2 text-2xl font-extrabold text-foreground">{saved.result.category}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Latest model category</p>
                  <StatusPill tone={saved.result.score >= 6.5 ? "good" : saved.result.score >= 5 ? "warn" : "bad"} className="mt-3">
                    {scoreStatus(saved.result.score).headline}
                  </StatusPill>
                </div>
              </div>

              {saved.assessment ? (
                <DynamicProfile score={saved.result.score} assessment={saved.assessment} />
              ) : null}
            </div>

            <PredictionSections result={saved.result} />

            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-center sm:flex-row sm:text-left">
              <div>
                <p className="text-sm font-bold">Ready to understand the result differently?</p>
                <p className="mt-1 text-xs text-muted-foreground">Results show the observations. Insights turns them into small actions.</p>
              </div>
              <Link to="/insights" className="inline-flex items-center gap-2 rounded-xl border border-mb-cyan/20 bg-mb-cyan/5 px-4 py-2.5 text-sm font-bold text-mb-cyan transition hover:bg-mb-cyan/10">
                Open Insights <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="text-center">
              <Link to="/assessment" className="text-sm font-medium text-mb-cyan underline-offset-4 hover:underline">
                Take the assessment again
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">No prediction result yet. Take the assessment and your real model result will appear here.</p>
            <div>
              <Link to="/assessment" className="inline-block rounded-xl bg-gradient-to-r from-mb-cyan to-mb-violet px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
                Take Assessment
              </Link>
            </div>
          </div>
        )}
      </Panel>
    </AppShell>
  );
}

function DynamicProfile({
  score,
  assessment,
}: {
  score: number;
  assessment: NonNullable<SavedPrediction["assessment"]>;
}) {
  const values = radarValues(assessment);

  if (score >= 8) {
    return (
      <div className="min-h-[300px] rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Your profile shape</p>
            <p className="text-xs text-muted-foreground">A balanced view of your current signals.</p>
          </div>
          <Sparkles className="h-4 w-4 text-mb-cyan" />
        </div>
        <RadarChart data={values} />
      </div>
    );
  }

  if (score >= 6.5) {
    return (
      <div className="min-h-[300px] rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-mb-cyan" />
          <div>
            <p className="text-sm font-bold">Your signal balance</p>
            <p className="text-xs text-muted-foreground">This view emphasizes where your routine currently sits.</p>
          </div>
        </div>

        <div className="mt-7 space-y-5">
          {values.map((item, index) => (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-semibold">{item.label}</span>
                <span className="text-muted-foreground">{Math.round(item.value * 100)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-black/25">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-mb-cyan to-mb-violet shadow-[0_0_16px_rgba(34,211,238,.25)] transition-all duration-1000"
                  style={{ width: Math.round(item.value * 100) + "%", transitionDelay: index * 100 + "ms" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const weakest = values.reduce((lowest, current) => (current.value < lowest.value ? current : lowest), values[0]);

  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-mb-violet/15 bg-gradient-to-br from-mb-violet/[0.08] to-mb-cyan/[0.04] p-5">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-mb-violet/15 blur-3xl animate-pulse" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-mb-violet" />
          <div>
            <p className="text-sm font-bold">Your focus map</p>
            <p className="text-xs text-muted-foreground">A simpler view for the areas that may need more care.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-5 gap-2">
          {values.map((item) => {
            const height = Math.max(22, Math.round(item.value * 100));
            return (
              <div key={item.label} className="flex h-36 flex-col items-center justify-end gap-2">
                <div className="flex h-28 w-full items-end rounded-xl bg-black/20 p-1">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-mb-violet to-mb-cyan shadow-[0_0_18px_rgba(34,211,238,.22)] transition-all duration-1000"
                    style={{ height: height + "%" }}
                  />
                </div>
                <span className="text-center text-[10px] text-muted-foreground">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3">
          <p className="text-xs text-muted-foreground">
            Current focus: <span className="font-bold text-foreground">{weakest.label}</span>. This does not define you — it simply shows one place where a small change may help.
          </p>
        </div>
      </div>
    </div>
  );
}
