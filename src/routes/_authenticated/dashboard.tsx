import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Heart, Moon, Sparkles, Target, Wind } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import heroInclusive from "@/assets/mindbalance-hero-inclusive.jpg";
import iconActivity from "@/assets/icon-activity.png";
import iconScreen from "@/assets/icon-screen.png";
import iconSleep from "@/assets/icon-sleep.png";
import iconStress from "@/assets/icon-stress.png";
import iconStudy from "@/assets/icon-study.png";
import quoteArt from "@/assets/quote-art.jpg";
import { AppShell } from "@/components/mb/app-shell";
import { AssistantPanel } from "@/components/mb/assistant-panel";
import { Panel, SectionTitle, StatusPill } from "@/components/mb/primitives";
import { Radar3D } from "@/components/mb/radar-chart";
import { AdaptiveProfile } from "@/components/mb/adaptive-profile";
import { ScoreGauge } from "@/components/mb/score-gauge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getDashboardData } from "@/lib/dashboard.functions";
import { lifestyleCards, radarValues, scoreStatus, type DashboardData } from "@/lib/mb";
import { loadPrediction, type SavedPrediction } from "@/lib/prediction";
import { supabase } from "@/integrations/supabase/client";
import { getHeroLine, getUserSeed, getWellnessQuote } from "@/lib/personalization";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Wellness Space · VRITTACARE" },
      { name: "description", content: "A calm, personalized overview of your latest VRITTACARE wellness assessment." },
      { property: "og:title", content: "Your Wellness Space · VRITTACARE" },
      { property: "og:description", content: "Your current wellness snapshot and next small step." },
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

const FOCUS_COPY: Record<string, { title: string; text: string; icon: typeof Target }> = {
  Sleep: {
    title: "Protect your rest",
    text: "Give your body a consistent wind-down window tonight. Rest is part of progress, not time away from it.",
    icon: Moon,
  },
  Study: {
    title: "Make study feel lighter",
    text: "Try one focused block, then take a real break. A calm rhythm is often easier to sustain than a perfect schedule.",
    icon: Target,
  },
  Activity: {
    title: "Add a little movement",
    text: "A short walk, stretch, or a few minutes outside can be a gentle reset between long periods of sitting.",
    icon: Heart,
  },
  "Screen Usage": {
    title: "Create a screen-free pocket",
    text: "Choose one small part of the day to be screen-free, especially near bedtime, and let your attention breathe.",
    icon: Sparkles,
  },
  Stress: {
    title: "Give your mind a pause",
    text: "Slow your breathing, step away for a few minutes, or talk to someone you trust. You do not have to carry everything at once.",
    icon: Wind,
  },
};

function DashboardPage() {
  const fetchData = useServerFn(getDashboardData);
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => fetchData(),
  });
  const [saved, setSaved] = useState<SavedPrediction | null>(null);
  const [authName, setAuthName] = useState<string | null>(null);
  const [authSeed, setAuthSeed] = useState<string | null>(null);

  useEffect(() => {
    setSaved(loadPrediction());
    supabase.auth.getUser().then(({ data: authData }) => {
      const user = authData.user;
      const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
      const metadataName =
        typeof metadata.display_name === "string" ? metadata.display_name.trim() :
        typeof metadata.full_name === "string" ? metadata.full_name.trim() :
        typeof metadata.name === "string" ? metadata.name.trim() : null;
      const fallbackName =
        metadataName ||
        user?.email?.split("@")[0]?.replace(/[._-]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) ||
        null;
      setAuthName(fallbackName);
      setAuthSeed(user?.id ?? fallbackName);
    });
  }, []);

  const latestAssessment = saved?.assessment ?? data?.assessment ?? null;
  const displayName = authName ?? data?.displayName ?? null;
  const userSeed = getUserSeed(authSeed ?? displayName, latestAssessment);

  return (
    <AppShell aside={<AssistantPanel />}>
      <Hero
        name={displayName}
        score={saved?.result.score ?? data?.result?.score ?? null}
        seed={userSeed}
      />

      {isLoading ? (
        <Panel>
          <p className="text-sm text-muted-foreground">Loading your wellness space…</p>
        </Panel>
      ) : !saved?.assessment && !data?.assessment ? (
        <Panel className="relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-mb-cyan/15 blur-3xl" />
          <SectionTitle sub="Your first check-in becomes the starting point for a more personal experience.">
            Begin your wellness journey
          </SectionTitle>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            There is no perfect score to chase here. VRITTACARE is designed to help you notice patterns,
            understand them, and choose one small step at a time.
          </p>
          <Link to="/assessment" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-mb-cyan to-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-mb-glow transition hover:-translate-y-0.5 hover:brightness-110">
            Take Assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </Panel>
      ) : (
        <DashboardBody data={data} saved={saved} seed={userSeed} />
      )}

      <div className="xl:hidden">
        <Panel>
          <AssistantPanel compact />
        </Panel>
      </div>
    </AppShell>
  );
}

function Hero({
  name,
  score,
  seed,
}: {
  name: string | null;
  score: number | null;
  seed: string;
}) {
  const status = score === null ? null : scoreStatus(score);
  const quote = getWellnessQuote(seed, 0);
  const heroLine = getHeroLine(seed, score === null ? 1 : Math.round(score * 10));

  return (
    <section className="group relative isolate min-h-[290px] overflow-hidden rounded-[26px] border border-white/15 shadow-[0_30px_90px_-50px_rgba(34,211,238,.55)]">
      <img src={heroInclusive} alt="Students sharing a peaceful mountain view" className="absolute inset-0 h-full w-full object-cover object-center transition duration-[1400ms] group-hover:scale-[1.025]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,.18),transparent_30%),linear-gradient(90deg,rgba(2,10,25,.96)_0%,rgba(3,15,35,.78)_42%,rgba(3,15,35,.12)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
      <div className="absolute right-10 top-8 hidden md:block">
        <div className="relative h-28 w-28 rounded-full border border-mb-cyan/20 bg-white/[0.035] shadow-[0_0_45px_-18px_rgba(34,211,238,.8)] backdrop-blur-md animate-[spin_16s_linear_infinite]">
          <div className="absolute inset-5 rounded-full border border-white/15" />
          <div className="absolute left-1/2 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-mb-cyan shadow-[0_0_18px_rgba(34,211,238,.9)]" />
          <div className="absolute inset-8 rounded-full bg-mb-cyan/10 blur-md" />
        </div>
      </div>

      <div className="relative flex min-h-[290px] max-w-[650px] flex-col justify-center px-6 py-10 md:px-9">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-mb-cyan">Your daily wellness space</p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          {name ? `Welcome back, ${name}.` : "Welcome back."}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
          {status ? status.headline + " " : ""}
          {heroLine}
        </p>
        <div className="mt-5 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 backdrop-blur-md shadow-[0_16px_40px_-28px_rgba(34,211,238,.6)]">
          <p className="text-lg font-serif font-semibold italic leading-relaxed tracking-[0.01em] text-white/95 md:text-xl">“{quote}”</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/assessment" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-mb-cyan to-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-mb-glow transition hover:-translate-y-0.5 hover:brightness-110">
            {score === null ? "Take Assessment" : "Check in again"} <ArrowRight className="h-4 w-4" />
          </Link>
          {score !== null ? (
            <Link to="/insights" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15">
              See my next step
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function DashboardBody({ data, saved = null, seed = "vrittacare" }: { data: DashboardData | undefined; saved?: SavedPrediction | null; seed?: string }) {
  const [openThreeD, setOpenThreeD] = useState(false);
  const assessment = saved?.assessment ?? data?.assessment;
  if (!assessment) return null;

  const score = saved?.result.score ?? data?.result?.score ?? null;
  const category = saved?.result.category ?? data?.result?.status_label ?? null;
  const status = score === null ? null : scoreStatus(score);
  const radar = radarValues(assessment);
  const cards = lifestyleCards(assessment);

  const focus = useMemo(
    () => radar.reduce((lowest, current) => (current.value < lowest.value ? current : lowest), radar[0]),
    [radar],
  );

  const focusInfo = FOCUS_COPY[focus.label] ?? FOCUS_COPY.Stress;
  const FocusIcon = focusInfo.icon;
  const balance = Math.round((radar.reduce((sum, item) => sum + item.value, 0) / radar.length) * 100);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1.06fr_0.94fr]">
        <Panel hover className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-mb-cyan/12 blur-3xl" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-mb-cyan/20 blur-2xl animate-pulse" />
              <ScoreGauge score={score ?? 0} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mb-cyan">Your latest model result</p>
              <h2 className="mt-2 text-2xl font-extrabold">{category ?? status?.label ?? "Ready when you are"}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {status?.headline ?? "Complete an assessment to see your personalized score."}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {score !== null ? (
                  <StatusPill tone={score >= 6.5 ? "good" : score >= 5 ? "warn" : "bad"}>{category ?? status?.label}</StatusPill>
                ) : null}
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-muted-foreground">
                  Educational estimate · not a diagnosis
                </span>
              </div>
            </div>
          </div>

          <div className="relative mt-5 rounded-2xl border border-white/10 bg-black/15 p-4 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-mb-cyan" />
              <div>
                <p className="text-sm font-bold">Your balance right now: {balance}%</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  This is a visual balance indicator from your five lifestyle inputs, not a second prediction score.
                </p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel hover className="relative overflow-hidden">
          <div className="mb-2 flex items-start justify-between gap-3">
            <SectionTitle sub="Five everyday signals, shaped by your latest answers.">Wellness Profile</SectionTitle>
            <Dialog open={openThreeD} onOpenChange={setOpenThreeD}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-full border-white/15 bg-white/5 px-3 text-xs backdrop-blur-md hover:border-mb-cyan/50 hover:bg-white/10 hover:text-mb-cyan">
                  3D View
                </Button>
              </DialogTrigger>
              <DialogContent className="mb-theme max-w-xl border-white/15 bg-mb-panel/95 text-foreground backdrop-blur-2xl">
                <DialogHeader><DialogTitle>Wellness Profile · 3D</DialogTitle></DialogHeader>
                <Radar3D data={radar} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative min-h-[250px]">
            <div className="pointer-events-none absolute inset-x-1/4 top-1/4 h-36 rounded-full bg-mb-cyan/10 blur-3xl" />
            <AdaptiveProfile assessment={assessment} data={radar} />
          </div>
        </Panel>
      </div>

      <Panel hover className="overflow-hidden">
        <SectionTitle sub="Your everyday rhythm — not a judgment, just a snapshot.">Your Wellness Rhythm</SectionTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {cards.map((card) => {
            const art = LIFESTYLE_ART[card.key];
            return (
              <div key={card.key} className="group relative min-h-[155px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-3.5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-mb-cyan/30 hover:bg-white/[0.07] hover:shadow-mb-glow">
                <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-mb-cyan/8 blur-2xl transition group-hover:bg-mb-cyan/15" />
                <div className="relative flex items-start justify-between gap-2">
                  <img src={art} alt="" width={72} height={72} loading="lazy" className="h-14 w-14 object-contain drop-shadow-lg transition duration-500 group-hover:scale-110 group-hover:-rotate-3" />
                  <StatusPill tone={card.tone}>{card.tag}</StatusPill>
                </div>
                <p className="relative mt-2 text-xl font-extrabold">
                  {card.value}{card.unit ? <span className="ml-1 text-xs font-medium text-muted-foreground">{card.unit}</span> : null}
                </p>
                <p className="relative text-xs text-muted-foreground">{card.label}</p>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <Panel hover>
          <SectionTitle sub="This map changes with your own answers. Lower bars simply show where more care may help.">Your Personal Focus Map</SectionTitle>
          <div className="space-y-4">
            {radar.map((item, index) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{Math.round(item.value * 100)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-black/20">
                  <div className="h-full rounded-full bg-gradient-to-r from-mb-cyan via-primary to-mb-violet shadow-[0_0_18px_rgba(34,211,238,.3)] transition-all duration-1000" style={{ width: Math.round(item.value * 100) + "%", transitionDelay: index * 90 + "ms" }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel hover className="relative overflow-hidden">
          <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-mb-violet/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-mb-cyan">
              <FocusIcon className="h-4 w-4" /> Gentle focus
            </div>
            <h3 className="mt-3 text-2xl font-extrabold">{focusInfo.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{focusInfo.text}</p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-md">
              <p className="font-serif italic tracking-wide text-xl leading-relaxed text-foreground/90">“{getWellnessQuote(seed, 17)}”</p>
            </div>
            <Link to="/insights" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-mb-cyan transition hover:gap-3">
              Turn this into a plan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Panel>
      </div>

      <section className="relative isolate overflow-hidden rounded-[26px] border border-white/10 shadow-mb-card">
        <img src={quoteArt} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,10,25,.96),rgba(8,24,45,.88),rgba(16,32,58,.45))]" />
        <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-7">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-base font-bold"><Heart className="h-4 w-4 text-mb-cyan" /> Keep this close</p>
            <p className="mt-2 text-lg leading-relaxed text-white/85">“{getWellnessQuote(seed, 23)}”</p>
          </div>
          <Link to="/chat" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/15">
            Talk it through <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
