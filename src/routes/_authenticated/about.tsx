import { createFileRoute } from "@tanstack/react-router";
import { Brain, Database, HeartHandshake, ShieldCheck, Sparkles, UserRound } from "lucide-react";

import { AppShell } from "@/components/mb/app-shell";
import { Panel, SectionTitle } from "@/components/mb/primitives";

export const Route = createFileRoute("/_authenticated/about")({
  head: () => ({
    meta: [
      { title: "About VRITTACARE" },
      { name: "description", content: "Learn about the idea, workflow and people behind the VRITTACARE Mental Health Prediction System." },
      { property: "og:title", content: "About VRITTACARE" },
      { property: "og:description", content: "The story, purpose and people behind VRITTACARE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-7 backdrop-blur-2xl md:p-9">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-mb-cyan/12 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-mb-violet/10 blur-3xl" />
          <div className="relative max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-mb-cyan/20 bg-mb-cyan/10 text-mb-cyan shadow-mb-glow">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-mb-cyan">The project behind the experience</p>
                <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">About VRITTACARE</h1>
              </div>
            </div>

            <p className="mt-6 text-base leading-8 text-foreground/80">
              VRITTACARE is a student-built Mental Health Prediction System created to explore how everyday digital habits and lifestyle patterns can be turned into understandable, personalized wellness insights. The project combines a trained machine-learning model with a calm, interactive frontend so that a student can move from <span className="font-semibold text-mb-cyan">answers → prediction → understanding → small actions</span> without feeling overwhelmed by technical data.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              The system is designed for educational use. Its prediction is not a medical diagnosis, and the interface intentionally presents the score as one piece of information rather than a label for a person.
            </p>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel hover>
            <SectionTitle sub="What happens after you submit the assessment.">How VRITTACARE works</SectionTitle>
            <div className="mt-4 space-y-3">
              {[
                ["01", "You share your current habits", "The assessment captures lifestyle and academic inputs such as sleep, study, activity, screen usage and stress."],
                ["02", "The trained model predicts a score", "Your answers are sent to the connected Random Forest prediction service. The frontend never invents a score."],
                ["03", "The result is explained", "Your result page separates observations into Needs Attention, Watch and Stable areas."],
                ["04", "Your next steps become practical", "Insights & Tips translates the observations into smaller, realistic actions you can choose from."],
              ].map(([number, title, text]) => (
                <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-mb-cyan/10 text-xs font-bold text-mb-cyan">{number}</span>
                    <div>
                      <p className="font-bold">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel hover>
            <SectionTitle sub="Built as a complete student project, not just a prediction screen.">What makes it VRITTACARE</SectionTitle>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                [ShieldCheck, "Model-grounded", "The displayed score comes from the connected trained model."],
                [Sparkles, "Personalized", "The dashboard and guidance adapt to the user's latest answers."],
                [Database, "Data-aware", "Assessment, prediction and assistant experiences work around the user's saved context."],
                [HeartHandshake, "Human-centered", "The interface focuses on clarity, encouragement and responsible wording."],
              ].map(([Icon, title, text]) => {
                const Component = Icon as typeof ShieldCheck;
                return (
                  <div key={title as string} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <Component className="h-5 w-5 text-mb-cyan" />
                    <p className="mt-3 font-bold">{title as string}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text as string}</p>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        <Panel>
          <SectionTitle sub="The people who turned the idea into a working project.">Dreamed into reality by</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-mb-cyan/15 bg-gradient-to-br from-mb-cyan/[0.08] to-transparent p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-mb-cyan/10 text-mb-cyan"><UserRound className="h-5 w-5" /></div>
                <div><h3 className="font-bold">Rutuja Dhumal</h3><p className="text-xs text-muted-foreground">Project development & experience</p></div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Rutuja shaped the project workflow, machine-learning pipeline integration and the student-facing experience, bringing together the technical work and the calm visual direction of VRITTACARE.
              </p>
            </article>

            <article className="rounded-2xl border border-mb-violet/15 bg-gradient-to-br from-mb-violet/[0.08] to-transparent p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-mb-violet/10 text-mb-violet"><UserRound className="h-5 w-5" /></div>
                <div><h3 className="font-bold">Vaibhav Solanke</h3><p className="text-xs text-muted-foreground">Project development & collaboration</p></div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Vaibhav contributed to the project journey and collaborative development, helping shape the system into a complete, presentation-ready student wellness application.
              </p>
            </article>
          </div>

          <p className="mt-6 text-center font-serif italic tracking-wide text-xl text-foreground/80">
            “Good technology should not make people feel smaller. It should help them understand themselves a little better.”
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
