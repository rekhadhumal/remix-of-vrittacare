import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

import { AppShell } from "@/components/mb/app-shell";
import { PredictionSections } from "@/components/mb/prediction-sections";
import { Panel, SectionTitle, StatusPill } from "@/components/mb/primitives";
import { AdaptiveProfile } from "@/components/mb/adaptive-profile";
import { ScoreGauge } from "@/components/mb/score-gauge";
import { WellnessMetrics } from "@/components/mb/wellness-metrics";
import { Button } from "@/components/ui/button";
import { radarValues, scoreStatus } from "@/lib/mb";
import { loadPrediction, type SavedPrediction } from "@/lib/prediction";
import { supabase } from "@/integrations/supabase/client";
import { getResultLine, getUserSeed } from "@/lib/personalization";

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
  const [userSeed, setUserSeed] = useState("vrittacare");

  useEffect(() => {
    const current = loadPrediction();
    setSaved(current);
    supabase.auth.getUser().then(({ data }) => {
      setUserSeed(getUserSeed(data.user?.id ?? data.user?.email, current?.assessment));
    });
    setChecked(true);
  }, []);

  return (
    <AppShell>
      <Panel>
        <SectionTitle sub={saved ? getResultLine(userSeed, Math.round(saved.result.score * 10)) : "Scored by your connected prediction model from your latest assessment."}>
          My Results
        </SectionTitle>

        {!checked ? null : saved ? (
          <div className="grid gap-5">
            <div className={saved.assessment ? "grid gap-5 lg:grid-cols-2" : "grid gap-5"}>
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-mb-line bg-mb-panel-2/45 p-5 text-center sm:flex-row sm:gap-6">
                  <ScoreGauge score={saved.result.score} />
                  <div className="mt-3 sm:mt-0 sm:text-left">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Mental Health Score</p>
                    <p className="mt-2 text-2xl font-extrabold text-foreground">{saved.result.category}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Latest model category</p>
                    <StatusPill tone={saved.result.score >= 6.5 ? "good" : saved.result.score >= 5 ? "warn" : "bad"} className="mt-3">
                      {scoreStatus(saved.result.score).headline}
                    </StatusPill>
                  </div>
                </div>

                <div className="rounded-2xl border border-mb-line bg-mb-panel-2/45 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-mb-cyan">Next useful focus</p>
                  <p className="mt-2 text-lg font-extrabold">
                    {saved.result.needs_attention?.[0]?.area ?? saved.result.watch?.[0]?.area ?? "Keep checking in"}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {saved.result.needs_attention?.[0]?.message ?? saved.result.watch?.[0]?.message ?? "Use your result as a guide and choose one small, realistic step."}
                  </p>
                  <Link to="/insights" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-mb-cyan">
                    Explore this in Insights <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {saved.assessment ? (
                <div className="rounded-2xl border border-mb-line bg-mb-panel-2/45 p-4">
                  <p className="text-sm font-bold">Wellness profile</p>
                  <p className="mt-1 text-xs text-muted-foreground">Five signals from your latest answers.</p>
                  <AdaptiveProfile assessment={saved.assessment} data={radarValues(saved.assessment)} />
                </div>
              ) : null}
            </div>

            {saved.assessment ? (
              <div>
                <SectionTitle sub="Your submitted values, shown once for quick reference.">Latest assessment values</SectionTitle>
                <WellnessMetrics assessment={saved.assessment} />
              </div>
            ) : null}

            <PredictionSections result={saved.result} />

            <div className="flex flex-col items-center justify-between gap-4 border-t border-mb-line pt-5 text-center sm:flex-row sm:text-left">
              <div>
                <p className="text-sm font-bold">Ready to understand the result differently?</p>
                <p className="mt-1 text-xs text-muted-foreground">Results show the observations. Insights turns them into small actions.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="h-10 rounded-xl bg-primary px-4 font-bold text-primary-foreground hover:bg-primary/90">
                  <Link to="/insights">Open Insights <ArrowRight /></Link>
                </Button>
                <Button asChild variant="outline" className="h-10 rounded-xl border-mb-cyan/25 bg-transparent px-4 text-mb-cyan hover:bg-mb-cyan/10 hover:text-mb-cyan">
                  <Link to="/assessment"><RotateCcw /> Take again</Link>
                </Button>
              </div>
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
