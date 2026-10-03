import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Heart, Lightbulb, Moon, Sparkles, Wind } from "lucide-react";

import { AppShell } from "@/components/mb/app-shell";
import { Panel, SectionTitle, StatusPill } from "@/components/mb/primitives";
import { loadPrediction, type PredictionItem, type SavedPrediction } from "@/lib/prediction";
import { radarValues, scoreStatus } from "@/lib/mb";
import { supabase } from "@/integrations/supabase/client";
import { getInsightOpener, getUserSeed, getWellnessQuote } from "@/lib/personalization";

export const Route = createFileRoute("/_authenticated/insights")({
  errorComponent: () => (
    <AppShell>
      <Panel>
        <SectionTitle sub="Your assessment data is still safe.">Insights could not load</SectionTitle>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Please return to the dashboard and open Insights & Tips again.
        </p>
        <Link to="/dashboard" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-mb-cyan to-primary px-5 py-3 text-sm font-bold text-primary-foreground">
          Back to Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </Panel>
    </AppShell>
  ),
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
  const [userSeed, setUserSeed] = useState("vrittacare");

  useEffect(() => {
    const current = loadPrediction();
    setSaved(current);
    supabase.auth.getUser().then(({ data }) => {
      const seed = getUserSeed(data.user?.id ?? data.user?.email, current?.assessment);
      setUserSeed(seed);
    });
    setChecked(true);
  }, []);

  const assessment = saved?.assessment ?? null;
  const status = saved ? scoreStatus(saved.result.score) : null;

  const signals = useMemo(() => {
    if (!assessment) return [];
    try {
      return radarValues(assessment).filter((item) => Number.isFinite(item.value));
    } catch {
      return [];
    }
  }, [assessment]);

  const strongest = useMemo(() => {
    if (!signals.length) return null;
    return signals.reduce((best, item) => (item.value > best.value ? item : best), signals[0] ?? { label: "", value: 0 });
  }, [signals]);

  const focus = useMemo(() => {
    if (!signals.length) return null;
    return signals.reduce((lowest, item) => (item.value < lowest.value ? item : lowest), signals[0] ?? { label: "", value: 0 });
  }, [signals]);

  const actionItems = Array.isArray(saved?.result.needs_attention) ? saved.result.needs_attention : [];
  const watchItems = Array.isArray(saved?.result.watch) ? saved.result.watch : [];
  const stableItems = Array.isArray(saved?.result.stable) ? saved.result.stable : [];
  const opportunityItems = [...actionItems, ...watchItems]
    .filter((item) => typeof item.estimated_score_change === "number" && Number.isFinite(item.estimated_score_change))
    .sort((a, b) => (b.estimated_score_change ?? 0) - (a.estimated_score_change ?? 0))
    .slice(0, 4);

  const insightCard = (item: PredictionItem, tone: "cyan" | "violet") => (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-start gap-3">
        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone === "violet" ? "bg-mb-violet/10 text-mb-violet" : "bg-mb-cyan/10 text-mb-cyan"}`}>
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold">{item.area}</h3>
            <span className="text-[11px] text-muted-foreground">{String(item.current_value)}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.message}</p>
        </div>
      </div>
    </article>
  );

  return (
    <AppShell>
      <div className="space-y-4">
        <section className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-2xl md:p-8">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-mb-cyan/12 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-mb-violet/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-mb-cyan">Your personal action space</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{getInsightOpener(userSeed, saved?.result.score ? Math.round(saved.result.score * 10) : 2)}</h1>

            {!checked ? null : saved && status ? (
              <>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <StatusPill tone={saved.result.score >= 6.5 ? "good" : saved.result.score >= 5 ? "warn" : "bad"}>{saved.result.category}</StatusPill>
                  <span className="text-sm text-muted-foreground">
                    Your latest check-in score is {saved.result.score.toFixed(1)}/10.
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Your result is a snapshot of your current habits. Here, we turn it into a few simple ideas you can try in everyday life.
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
                <SectionTitle sub="A simple snapshot of the habits you shared.">What shaped your result</SectionTitle>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-mb-cyan/15 bg-mb-cyan/[0.05] p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-mb-cyan">Strongest signal</p>
                    <p className="mt-2 text-2xl font-extrabold">{strongest?.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {strongest ? `${strongest.label} currently sits highest in your personal profile at ${Math.round(strongest.value)}%.` : "Your profile will appear after an assessment."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-mb-violet/15 bg-mb-violet/[0.05] p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-mb-violet">Area to notice</p>
                    <p className="mt-2 text-2xl font-extrabold">{focus?.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {focus ? `${focus.label} currently sits lowest in your personal profile at ${Math.round(focus.value)}%.` : "Your profile will appear after an assessment."}
                    </p>
                  </div>
                </div>
                <p className="mt-5 border-l-2 border-mb-cyan/40 pl-4 text-lg font-medium leading-relaxed text-foreground/90">
                  “{getWellnessQuote(userSeed, 11)}”
                </p>
              </Panel>

              <Panel hover>
                <SectionTitle sub="A quick look at what you shared in your latest check-in.">Your latest signals</SectionTitle>
                <div className="mt-3 space-y-2">
                  {assessment ? (
                    <>
                      {[
                        ["Sleep", `${assessment.sleep_hours_per_night} hrs`],
                        ["Study", `${assessment.study_hours} hrs`],
                        ["Screen Usage", `${assessment.avg_daily_usage_hours} hrs`],
                        ["Activity", `${assessment.physical_activity_hours} hrs`],
                        ["Stress", assessment.stress_level],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
                          <span className="text-sm font-semibold">{label}</span>
                          <span className="text-sm text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </>
                  ) : null}
                </div>
              </Panel>
            </div>

            <Panel hover>
              <SectionTitle sub="These areas may be worth giving a little more attention.">
                A little more attention
              </SectionTitle>
              {opportunityItems.length ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {opportunityItems.map((item, index) => {
                    const width = Math.max(28, 92 - index * 18);
                    return (
                      <div key={`opportunity-${item.area}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold">{item.area}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{item.interpretation}</p>
                          </div>
                          <span className="text-xs font-semibold text-mb-cyan">{index === 0 ? "Start here" : "Worth noticing"}</span>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-mb-cyan to-mb-violet"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Your latest result does not include estimated improvement values yet.
                </p>
              )}
              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                This is based on your latest check-in and is meant for reflection, not diagnosis.
              </p>
            </Panel>

            <Panel>
              <SectionTitle sub="Here are the few areas worth acting on, keeping an eye on, or maintaining.">What to focus on</SectionTitle>
              <div className="mt-3 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-mb-cyan/20 bg-mb-cyan/[0.045] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-mb-cyan">Act</p>
                  <p className="mt-2 text-lg font-extrabold">{actionItems.length} area{actionItems.length === 1 ? "" : "s"} to focus on</p>
                  <div className="mt-4 space-y-3">
                    {actionItems.length ? actionItems.map((item) => <div key={item.area}>{insightCard(item, "cyan")}</div>) : <p className="text-sm text-muted-foreground">No areas are currently flagged for attention.</p>}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Watch</p>
                  <p className="mt-2 text-lg font-extrabold">{watchItems.length} area{watchItems.length === 1 ? "" : "s"} could improve</p>
                  <div className="mt-4 space-y-3">
                    {watchItems.length ? watchItems.map((item) => <div key={item.area}>{insightCard(item, "violet")}</div>) : <p className="text-sm text-muted-foreground">Nothing is currently in the watch group.</p>}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-mb-cyan">Keep</p>
                  <p className="mt-2 text-lg font-extrabold">{stableItems.length} area{stableItems.length === 1 ? "" : "s"} are going well</p>
                  <div className="mt-4 space-y-3">
                    {stableItems.length ? stableItems.map((item) => <div key={item.area}>{insightCard(item, "cyan")}</div>) : <p className="text-sm text-muted-foreground">No stable areas were returned for this assessment.</p>}
                  </div>
                </div>
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
