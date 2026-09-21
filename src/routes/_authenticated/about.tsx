import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mb/app-shell";
import { Panel, SectionTitle } from "@/components/mb/primitives";

export const Route = createFileRoute("/_authenticated/about")({
  head: () => ({ meta: [{ title: "About · MindBalance" }, { name: "description", content: "Learn how MindBalance turns assessments into educational wellness insights." }, { property: "og:title", content: "About · MindBalance" }, { property: "og:description", content: "Learn about the MindBalance wellness project." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <AppShell><Panel><SectionTitle>About MindBalance</SectionTitle><p className="text-sm leading-relaxed text-muted-foreground">MindBalance is an educational student-wellness project. Scores come only from the connected trained model and are not medical diagnoses.</p></Panel></AppShell>,
});