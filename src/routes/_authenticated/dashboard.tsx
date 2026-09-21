import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

import heroInclusive from "@/assets/mindbalance-hero-inclusive.jpg";
import iconActivity from "@/assets/icon-activity.png";
import iconScreen from "@/assets/icon-screen.png";
import iconSleep from "@/assets/icon-sleep.png";
import iconStress from "@/assets/icon-stress.png";
import iconStudy from "@/assets/icon-study.png";
import quoteArt from "@/assets/quote-art.jpg";
import { AppShell } from "@/components/mb/app-shell";
import { AssistantPanel } from "@/components/mb/assistant-panel";
import { PredictionSections } from "@/components/mb/prediction-sections";
import { Panel, SectionTitle, StatusPill } from "@/components/mb/primitives";
import { Radar3D, RadarChart } from "@/components/mb/radar-chart";
import { ScoreGauge } from "@/components/mb/score-gauge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/dashboard.functions";
import {
  buildInsights,
  lifestyleCards,
  prettyFeature,
  radarValues,
  scoreStatus,
  type DashboardData,
} from "@/lib/mb";
import { loadPrediction, type SavedPrediction } from "@/lib/prediction";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Wellness Dashboard · VRITTACARE" },
      {
        name: "description",
        content: "See your mental health score, wellness profile, lifestyle overview and personalized insights.",
      },
      { property: "og:title", content: "Your Wellness Dashboard · VRITTACARE" },
      { property: "og:description", content: "Your score, habits and personalized guidance in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const LIFESTYLE_ART = {
  sleep: iconSleep,
  study: iconStudy,
  screen: iconScreen,
  activity: iconActivity,
  stress: iconStress,
} as const;

function DashboardPage() {
  const fetchData = useServerFn(getDashboardData);
  const { data, isLoading } = useQuery<DashboardData>({ queryKey: ["dashboard"], queryFn: () => fetchData() });
  const [saved, setSaved] = useState<SavedPrediction | null>(null);

  useEffect(() => {
    setSaved(loadPrediction());
  }, []);

  return (
    <AppShell aside={<AssistantPanel />}>
      <Hero name={data?.displayName ?? null} />

      {isLoading ? (
        <Panel className="border-mb-cyan/15 bg-gradient-to-br from-mb-panel to-mb-panel-2/55">
          <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
        </Panel>
      ) : !saved?.assessment && !data?.assessment ? (
        <Panel>
          <SectionTitle sub="Take your first assessment to unlock your score, wellness profile and personalized insights.">
            Let's get started
          </SectionTitle>
          <Link
            to="/assessment"
            className="inline-flex rounded-xl bg-gradient-to-r from-mb-cyan to-mb-violet px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Take Assessment
          </Link>
        </Panel>
      ) : (
        <DashboardBody data={data} saved={saved} />
      )}

      <div className="xl:hidden">
        <Panel>
          <AssistantPanel compact />
        </Panel>
      </div>
    </AppShell>
  );
}

function Hero({ name }: { name: string | null }) {
  return (
    <section className="group relative isolate min-h-[248px] overflow-hidden rounded-2xl border border-mb-cyan/15 shadow-mb-card md:min-h-[278px]">
      <img src={heroInclusive} alt="A diverse group of students overlooking a mountain landscape at sunset" className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.015]" />
      <div className="absolute inset-0 bg-gradient-to-r from-mb-sidebar via-mb-sidebar/75 to-mb-sidebar/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-mb-sidebar/65 via-transparent to-transparent" />
      <div className="relative flex min-h-[248px] max-w-[520px] flex-col justify-center px-6 py-8 md:min-h-[278px] md:px-9">
        <p className="mb-2 text-[11px] font-bold uppercase text-mb-cyan">Your daily wellness space</p>
        <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">Hi{name ? ` ${name}` : " there"}!</h1>
        <p className="mt-3 max-w-[420px] text-sm leading-relaxed text-foreground/75">
          A quick check-in helps you understand how your habits shape how you feel.
        </p>
        <Link
          to="/assessment"
          className="mt-5 inline-flex w-fit items-center rounded-xl bg-gradient-to-r from-mb-cyan to-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_12px_34px_-16px_var(--mb-cyan)] transition hover:-translate-y-0.5 hover:brightness-110"
        >
          Take Assessment
        </Link>
      </div>
      <div className="absolute bottom-5 right-6 hidden max-w-[190px] text-right md:block">
        <p className="font-hand text-2xl font-bold leading-none text-foreground">
          Small changes make
          <span className="block text-mb-cyan">big differences</span>
        </p>
      </div>
    </section>
  );
}

export function DashboardBody({ data, saved = null }: { data: DashboardData; saved?: SavedPrediction | null }) {
  const [openThreeD, setOpenThreeD] = useState(false);
  const assessment = saved?.assessment ?? data.assessment;
  if (!assessment) return null;
  const storedResult = data.result;
  const score = saved?.result.score ?? storedResult?.score ?? null;
  const category = saved?.result.category ?? storedResult?.status_label ?? null;
  const status = score === null ? null : scoreStatus(score);
  const radar = radarValues(assessment);
  const cards = lifestyleCards(assessment);
  const derivedInsights = buildInsights(assessment);

  const maxImportance = Math.max(0.0001, ...(storedResult?.feature_importance ?? []).map((f) => f.importance));

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <Panel hover className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-16 top-12 h-44 w-44 rounded-full bg-mb-cyan/10 blur-3xl" />
        <SectionTitle sub="A clear view of your latest assessment.">Mental Health Score</SectionTitle>
        {score !== null && status ? (
          <div className="relative flex min-h-[278px] flex-col items-center gap-5 md:flex-row md:items-center">
            <ScoreGauge score={score} />
            <div className="flex-1 space-y-3 text-center md:text-left">
              <StatusPill tone={score >= 6.5 ? "good" : score >= 5 ? "warn" : "bad"}>
                {category ?? status.label}
              </StatusPill>
              <p className="text-lg font-bold leading-snug">
                {saved ? `Latest model category: ${saved.result.category}` : status.headline}
              </p>
              <p className="text-sm text-muted-foreground">
                This score comes from a trained Random Forest model using the answers from your latest assessment.
                {storedResult?.model_version && !saved ? ` Model ${storedResult.model_version}.` : ""}
              </p>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground/80">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mb-cyan" />
                <span>
                This is an educational estimate, not a medical diagnosis. If you are struggling, please reach out to a
                qualified professional.
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-mb-amber/30 bg-mb-amber/10 p-4 text-sm">
            <p className="font-semibold text-mb-amber">No score yet</p>
            <p className="mt-1 text-muted-foreground">
              Your answers are saved, but the prediction model service hasn't returned a score. Once the model service
              is connected, your score will appear here — nothing is ever estimated or made up.
            </p>
          </div>
        )}
      </Panel>

        <Panel hover className="relative overflow-hidden">
          <div className="mb-4 flex items-start justify-between">
            <SectionTitle sub="How your five key areas balance out.">Wellness Profile</SectionTitle>
            <Dialog open={openThreeD} onOpenChange={setOpenThreeD}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-full border-mb-line bg-mb-panel-2 px-3 text-xs hover:border-mb-cyan/60 hover:bg-mb-panel-2 hover:text-mb-cyan">
                  3D View
                </Button>
              </DialogTrigger>
              <DialogContent className="mb-theme max-w-xl border-mb-line bg-mb-panel text-foreground">
                <DialogHeader>
                  <DialogTitle>Wellness Profile · 3D</DialogTitle>
                </DialogHeader>
                <Radar3D data={radar} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative min-h-[278px]">
            <div className="pointer-events-none absolute inset-x-1/4 top-1/4 h-36 rounded-full bg-mb-cyan/10 blur-3xl" />
            <RadarChart data={radar} />
          </div>
        </Panel>
      </div>

        <Panel hover>
          <SectionTitle sub="Your latest daily rhythm at a glance.">Lifestyle Overview</SectionTitle>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {cards.map((c) => {
              const art = LIFESTYLE_ART[c.key];
              return (
                <div
                  key={c.key}
                  className="group relative min-h-[150px] overflow-hidden rounded-xl border border-mb-line bg-gradient-to-br from-mb-panel-2 to-mb-panel p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-mb-cyan/35 hover:shadow-mb-glow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <img src={art} alt="" width={72} height={72} loading="lazy" className="h-14 w-14 object-contain drop-shadow-lg transition duration-300 group-hover:scale-110 group-hover:-rotate-2" />
                    <StatusPill tone={c.tone}>{c.tag}</StatusPill>
                  </div>
                  <p className="mt-2 text-xl font-extrabold">
                    {c.value}
                    {c.unit ? <span className="ml-1 text-xs font-medium text-muted-foreground">{c.unit}</span> : null}
                  </p>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                </div>
              );
            })}
          </div>
        </Panel>

      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <Panel hover className="overflow-hidden">
        <SectionTitle sub="Importance values reported by the trained model for your prediction.">
          Key Factors Affecting Your Score
        </SectionTitle>
        {storedResult && !saved && storedResult.feature_importance.length > 0 ? (
          <div className="space-y-4">
            {storedResult.feature_importance.map((f, i) => (
              <div key={f.feature}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{prettyFeature(f.feature)}</span>
                  <span className="text-muted-foreground">{f.importance.toFixed(3)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full border border-mb-line bg-mb-sidebar/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-mb-cyan via-primary to-mb-violet shadow-[0_0_14px_var(--mb-cyan)]"
                    style={{
                      width: `${(f.importance / maxImportance) * 100}%`,
                      transition: `width 1.1s cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            The latest prediction did not include factor-importance values.
          </p>
        )}
      </Panel>

      <Panel hover>
        <SectionTitle sub="Guidance returned for your latest completed assessment.">
          Your Personalized Insights
        </SectionTitle>
        {saved ? (
          <PredictionSections result={saved.result} compact />
        ) : (
          <div className="grid gap-3">
          {derivedInsights.map((ins) => {
            const art = LIFESTYLE_ART[ins.key];
            return (
              <div
                key={ins.key}
                className="group flex items-center gap-3 rounded-xl border border-mb-line bg-gradient-to-r from-mb-panel-2 to-mb-panel p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-mb-cyan/40"
              >
                <img src={art} alt="" width={48} height={48} loading="lazy" className="h-10 w-10 shrink-0 object-contain" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{ins.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{ins.text}</span>
                </span>
              </div>
            );
          })}
          </div>
        )}
      </Panel>
      </div>

      <section className="relative isolate overflow-hidden rounded-2xl border border-mb-cyan/20 p-5 shadow-mb-card md:p-6">
        <img src={quoteArt} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-mb-sidebar via-mb-panel/95 to-mb-cyan/20" />
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="flex items-center gap-2 text-base font-bold">
              <Sparkles className="h-4 w-4" /> Remember
            </p>
            <p className="mt-1 max-w-xl text-sm text-foreground/80">
              You're not alone. Reaching out is a sign of strength — talking to someone you trust can make a real
              difference.
            </p>
          </div>
          <Link
            to="/insights"
            className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background shadow-mb-glow transition hover:-translate-y-0.5"
          >
            Get Support
          </Link>
        </div>
      </section>
    </>
  );
}
