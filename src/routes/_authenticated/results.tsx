import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/mb/app-shell";
import { PredictionSections } from "@/components/mb/prediction-sections";
import { Panel, SectionTitle } from "@/components/mb/primitives";
import { RadarChart } from "@/components/mb/radar-chart";
import { ScoreGauge } from "@/components/mb/score-gauge";
import { radarValues } from "@/lib/mb";
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
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-mb-line bg-mb-panel-2 p-6 text-center sm:flex-row sm:gap-6">
                <ScoreGauge score={saved.result.score} />
                <div className="mt-3 sm:mt-0 sm:text-left">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Mental Health Score</p>
                  <p className="mt-2 text-lg font-bold text-foreground">{saved.result.category}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Latest model category</p>
                </div>
              </div>
              {saved.assessment ? (
                <div className="min-h-[300px] rounded-2xl border border-mb-line bg-mb-panel-2 p-4">
                  <p className="text-sm font-bold">Latest Assessment Profile</p>
                  <RadarChart data={radarValues(saved.assessment)} />
                </div>
              ) : null}
            </div>

            <PredictionSections result={saved.result} />

            <div className="text-center">
              <Link
                to="/assessment"
                className="text-sm font-medium text-mb-cyan underline-offset-4 hover:underline"
              >
                Take the assessment again
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">
              No prediction result yet. Take the assessment and your real model result will appear here.
            </p>
            <div>
              <Link
                to="/assessment"
                className="inline-block rounded-xl bg-gradient-to-r from-mb-cyan to-mb-violet px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Take Assessment
              </Link>
            </div>
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
