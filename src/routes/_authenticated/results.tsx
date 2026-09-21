import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mb/app-shell";
import { Panel, SectionTitle } from "@/components/mb/primitives";

export const Route = createFileRoute("/_authenticated/results")({
  head: () => ({ meta: [{ title: "My Results · MindBalance" }, { name: "description", content: "Review your saved MindBalance assessment results." }, { property: "og:title", content: "My Results · MindBalance" }, { property: "og:description", content: "Review your saved wellness results." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <AppShell><Panel><SectionTitle>My Results</SectionTitle><p className="text-sm text-muted-foreground">Your saved assessment history will appear here. The dashboard always shows your latest real model result.</p></Panel></AppShell>,
});