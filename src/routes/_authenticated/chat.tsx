import { createFileRoute } from "@tanstack/react-router";
import { AssistantPanel } from "@/components/mb/assistant-panel";
import { AppShell } from "@/components/mb/app-shell";
import { Panel } from "@/components/mb/primitives";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "Wellness Assistant · VRITTACARE" }, { name: "description", content: "Chat with your data-grounded VRITTACARE wellness assistant." }, { property: "og:title", content: "Wellness Assistant · VRITTACARE" }, { property: "og:description", content: "Ask questions about your saved wellness data." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <AppShell><Panel className="h-[calc(100vh-3rem)]"><AssistantPanel compact /></Panel></AppShell>,
});