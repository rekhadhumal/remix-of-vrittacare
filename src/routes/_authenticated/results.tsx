import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/mb/app-shell";
import { Panel, SectionTitle } from "@/components/mb/primitives";
import { loadPrediction, type PredictionResponse } from "@/lib/prediction";

export const Route = createFileRoute("/_authenticated/results")({
  head: () => ({
    meta: [
      { title: "My Results · MindBalance" },
      { name: "description", content: "Review your MindBalance assessment result from the prediction model." },
      { property: "og:title", content: "My Results · MindBalance" },
      { property: "og:description", content: "Review your wellness result from the prediction model." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setResult(loadPrediction());
    setChecked(true);
  }, []);

  return (
    <AppShell>
      <Panel>
        <SectionTitle sub="Scored by your local prediction model from your latest assessment.">
          My Results
        </SectionTitle>

        {!checked ? null : result ? (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/12 bg-mb-panel-2 p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Mental Health Score
              </p>
              <p className="mt-2 bg-gradient-to-r from-mb-cyan to-mb-violet bg-clip-text text-5xl font-bold text-transparent">
                {result.score}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Category: <span className="font-semibold text-foreground">{result.category}</span>
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatusChip label="Needs Attention" active={result.needs_attention} tone="bad" />
              <StatusChip label="Watch" active={result.watch} tone="warn" />
              <StatusChip label="Stable" active={result.stable} tone="good" />
            </div>

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

function StatusChip({
  label,
  active,
  tone,
}: {
  label: string;
  active: boolean;
  tone: "good" | "warn" | "bad";
}) {
  const tones = {
    good: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
    warn: "border-amber-400/40 bg-amber-500/10 text-amber-200",
    bad: "border-red-400/40 bg-red-500/10 text-red-200",
  } as const;

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-center text-sm font-medium transition ${
        active ? tones[tone] : "border-white/12 bg-mb-panel-2 text-muted-foreground opacity-50"
      }`}
    >
      {label}
      {active && <span className="ml-1.5">●</span>}
    </div>
  );
}
