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
          <SectionTitle sub="Two contributors, different strengths, one complete student project.">Project Team & Contributions</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-mb-cyan/15 bg-gradient-to-br from-mb-cyan/[0.08] to-transparent p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-mb-cyan/10 text-mb-cyan"><UserRound className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-extrabold tracking-wide">RUTUJA DHUMAL</h3>
                  <p className="text-xs text-muted-foreground">ML workflow, backend integration & product experience</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Rutuja led the core data-science workflow from understanding and cleaning the student dataset through EDA, feature engineering, model building and tuning. She also carried the prediction workflow into a FastAPI service and helped shape the student-facing VRITTACARE experience so that model output becomes understandable guidance rather than a raw number.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-mb-cyan">
                <span className="rounded-full border border-mb-cyan/15 bg-mb-cyan/5 px-3 py-1">Data Science</span>
                <span className="rounded-full border border-mb-cyan/15 bg-mb-cyan/5 px-3 py-1">Machine Learning</span>
                <span className="rounded-full border border-mb-cyan/15 bg-mb-cyan/5 px-3 py-1">FastAPI</span>
                <span className="rounded-full border border-mb-cyan/15 bg-mb-cyan/5 px-3 py-1">Product UX</span>
              </div>
              <a href="https://github.com/rutuu0228" target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-bold text-mb-cyan hover:underline">
                View GitHub profile →
              </a>
            </article>

            <article className="rounded-2xl border border-mb-violet/15 bg-gradient-to-br from-mb-violet/[0.08] to-transparent p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-mb-violet/10 text-mb-violet"><UserRound className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-extrabold tracking-wide">VAIBHAV SOLANKE</h3>
                  <p className="text-xs text-muted-foreground">Project foundation, data understanding & collaboration</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Vaibhav played an important collaborative role in establishing the project's technical foundation and early direction. His work included understanding the initial dataset and project requirements, setting up the development dependencies and working environment, and contributing to early technical discussions around how the data-science work could become a usable student-facing application. He also remained part of the product-development collaboration, helping shape the project direction and giving the later modeling, API and frontend work a clearer foundation to build on.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-mb-violet">
                <span className="rounded-full border border-mb-violet/15 bg-mb-violet/5 px-3 py-1">Technical Foundation</span>
                <span className="rounded-full border border-mb-violet/15 bg-mb-violet/5 px-3 py-1">Dataset Understanding</span>
                <span className="rounded-full border border-mb-violet/15 bg-mb-violet/5 px-3 py-1">Environment & Dependencies</span>
                <span className="rounded-full border border-mb-violet/15 bg-mb-violet/5 px-3 py-1">Product Collaboration</span>
              </div>
              <a href="https://github.com/vaibhavvsolanke" target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-bold text-mb-violet hover:underline">
                View GitHub profile →
              </a>
            </article>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mb-cyan">Why the project matters</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              VRITTACARE brings together a complete student-project lifecycle: a real dataset, a regression model, preprocessing and evaluation, a Python prediction API, persistent application data, authentication, and a user interface that explains the result in simple language. The goal is not to replace professional mental-health care, but to demonstrate how data science can be translated into a responsible, understandable digital experience.
            </p>
          </div>

          <p className="mt-6 text-center font-serif italic tracking-wide text-xl text-foreground/80">
            “Good technology should not make people feel smaller. It should help them understand themselves a little better.”
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
