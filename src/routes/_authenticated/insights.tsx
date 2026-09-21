import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mb/app-shell";
import { Panel, SectionTitle } from "@/components/mb/primitives";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({ meta: [{ title: "Insights & Tips · MindBalance" }, { name: "description", content: "Explore guidance based on your saved MindBalance assessment." }, { property: "og:title", content: "Insights & Tips · MindBalance" }, { property: "og:description", content: "Personal guidance grounded in your assessment." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <AppShell><Panel><SectionTitle>Insights & Tips</SectionTitle><p className="text-sm text-muted-foreground">Complete an assessment to see guidance grounded in your own habits.</p></Panel></AppShell>,
});