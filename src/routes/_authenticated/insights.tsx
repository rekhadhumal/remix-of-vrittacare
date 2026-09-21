import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Heart, Lightbulb, Moon, Sparkles, Wind } from "lucide-react";

import { AppShell } from "@/components/mb/app-shell";
import { Panel, SectionTitle, StatusPill } from "@/components/mb/primitives";
import { loadPrediction, type SavedPrediction } from "@/lib/prediction";
import { radarValues, scoreStatus } from "@/lib/mb";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({
    meta: [
      { title: "Your Next Steps · VRITTACARE" },
      { name: "description", content: "Turn your VRITTACARE assessment into small, practical wellness actions." },
      { property: "og:title", content: "Your Next Steps · VRITTACARE" },
      { property: "og:description", content: "Practical, personalized guidance from your latest assessment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const [saved, setSaved] = useState<SavedPrediction | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSaved(loadPrediction());
    setChecked(true);
  }, []);

  const assessment = saved?.assessment ?? null;
  const status = saved ? scoreStatus(saved.result.score) : null;

  const plan = useMemo(() => {
    if (!assessment) return [];

    const items: Array<{
      icon: typeof Heart;
      title: string;
      detail: string;
      tone: "cyan" | "violet";
    }> = [];

    if (assessment.physical_activity_hours < 1.5) {
      items.push({
        icon: Heart,
        title: "Move for a few minutes",
        detail: "Try a 15–30 minute walk, gentle stretching, or any movement you genuinely enjoy. Consistency matters more than intensity.",
        tone: "cyan",
      });
    }

    if (assessment.avg_daily_usage_hours > 3) {
      items.push({
        icon: Sparkles,
        title: "Create one screen-free pocket",
        detail: "Choose one small window — during a meal, before bed, or while walking — where your phone stays out of reach.",
        tone: "violet",
      });
    }

    if (assessment.sleep_hours_per_night < 7) {
      items.push({
        icon: Moon,
        title: "Protect your sleep window",
        detail: "Try moving bedtime slightly earlier and keeping your wind-down routine predictable for a few nights.",
        tone: "cyan",
      });
    }

    if (assessment.stress_level !== "Low") {
      items.push({
        icon: Wind,
        title: "Give stress somewhere to go",
        detail: "Take a slow breathing break, step outside, write down what is weighing on you, or talk with someone you trust.",
        tone: "violet",
      });
    }

    if (assessment.study_hours < 3) {
      items.push({
        icon: Lightbulb,
        title: "Use one focused study block",
        detail: "Pick one small task, work without distractions for a short block, then take a proper break. Smaller starts can feel easier.",
        tone: "cyan",
      });
    }

    if (items.length === 0) {
      items.push({
        icon: CheckCircle2,
        title: "Protect what is already working",
        detail: "Your current habits look fairly balanced. Keep the routines that feel sustainable and make room for rest and connection.",
        tone: "cyan",
      });
    }

    return items.slice(0, 4);
  }, [assessment]);

  const strongest = useMemo(() => {
    if (!assessment) return null;
    const values = radarValues(assessment);
    return values.reduce((best, item) => (item.value > best.value ? item : best), values[0]);
  }, [assessment]);

  return (
    <AppShell>
      <div className="space-y-4">
        <section className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-2xl md:p-8">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-mb-cyan/12 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-mb-violet/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-mb-cyan">Your personal action space</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Insights that become small steps.</h1>

            {!checked ? null : saved && status ? (
              <>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <StatusPill tone={saved.result.score >= 6.5 ? "good" : saved.result.score >= 5 ? "warn" : "bad"}>{saved.result.category}</StatusPill>
                  <span className="text-sm text-muted-foreground">
                    Your latest model score is {saved.result.score.toFixed(1)}/10.
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Results tell you what the model noticed. This page is different: it turns those observations into practical, gentle actions you can actually try.
                </p>
              </>
            ) : (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Complete an assessment first. Then this page becomes your personal space for practical next steps.
              </p>
            )}
          </div>
        </section>

        {!checked ? null : !saved || !assessment ? (
          <Panel>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <SectionTitle sub="Your guidance is built from your own assessment answers.">Your plan is waiting</SectionTitle>
                <p className="text-sm text-muted-foreground">Take the assessment to unlock personalized actions instead of generic advice.</p>
              </div>
              <Link to="/assessment" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-mb-cyan to-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-mb-glow">
                Take Assessment <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Panel>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
              <Panel hover className="relative overflow-hidden">
                <SectionTitle sub="Start with one thing. You do not need to fix everything today.">Your 3-minute starting point</SectionTitle>
                <div className="mt-2 rounded-2xl border border-mb-cyan/15 bg-mb-cyan/[0.05] p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mb-cyan/10 text-mb-cyan">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{plan[0]?.title ?? "Take one quiet pause"}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {plan[0]?.detail ?? "Take three slow breaths, notice how you feel, and choose one kind action for yourself."}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-5 font-hand text-xl leading-relaxed text-foreground/90">“You do not have to become a different person to deserve a better day.”</p>
              </Panel>

              <Panel hover>
                <SectionTitle sub="A simple reading of your five lifestyle signals.">What is supporting you</SectionTitle>
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-mb-cyan">Strongest signal</p>
                  <p className="mt-2 text-2xl font-extrabold">{strongest?.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    This area currently sits highest in your personal wellness profile. Keep the habit sustainable rather than trying to make it perfect.
                  </p>
                </div>
              </Panel>
            </div>

            <Panel>
              <SectionTitle sub="These are actions, not rules. Pick the ones that fit your real life.">Your small-step plan</SectionTitle>
              <div className="grid gap-3 md:grid-cols-2">
                {plan.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-mb-cyan/25 hover:bg-white/[0.055]">
                      <div className="flex items-start gap-3">
                        <div className={"grid h-10 w-10 shrink-0 place-items-center rounded-xl " + (item.tone === "violet" ? "bg-mb-violet/10 text-mb-violet" : "bg-mb-cyan/10 text-mb-cyan")}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Step {index + 1}</p>
                          <h3 className="mt-1 text-base font-bold">{item.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </Panel>

            <section className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] backdrop-blur-2xl">
              <div className="grid md:grid-cols-[1fr_auto] md:items-center">
                <div className="p-6 md:p-7">
                  <div className="flex items-center gap-2 text-sm font-bold"><Lightbulb className="h-4 w-4 text-mb-cyan" /> A gentle reminder</div>
                  <p className="mt-3 max-w-2xl text-lg leading-relaxed text-foreground/85">
                    Your result is information, not identity. If something feels difficult, reaching out to a trusted person or qualified professional is a strength.
                  </p>
                </div>
                <div className="border-t border-white/10 p-5 md:border-l md:border-t-0">
                  <Link to="/chat" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-white/10">
                    Talk with your assistant <ArrowRight className="h-4 w-4 text-mb-cyan" />
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
