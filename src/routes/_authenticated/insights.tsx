import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/mb/app-shell";
import { PredictionSections } from "@/components/mb/prediction-sections";
import { Panel, SectionTitle } from "@/components/mb/primitives";
import { loadPrediction, type SavedPrediction } from "@/lib/prediction";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({ meta: [{ title: "Insights & Tips · VRITTACARE" }, { name: "description", content: "Explore guidance based on your saved VRITTACARE assessment." }, { property: "og:title", content: "Insights & Tips · VRITTACARE" }, { property: "og:description", content: "Personal guidance grounded in your assessment." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: InsightsPage,
});

function InsightsPage() {
  const [saved, setSaved] = useState<SavedPrediction | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSaved(loadPrediction());
    setChecked(true);
  }, []);

  return (
    <AppShell>
      <Panel>
        <SectionTitle sub={saved ? `Latest model category: ${saved.result.category}` : undefined}>Insights & Tips</SectionTitle>
        {!checked ? null : saved ? (
          <PredictionSections result={saved.result} />
        ) : (
          <p className="text-sm text-muted-foreground">Complete an assessment to see guidance grounded in your own habits.</p>
        )}
      </Panel>
    </AppShell>
  );
}