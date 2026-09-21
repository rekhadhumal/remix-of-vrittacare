import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/mb/app-shell";
import { Panel, SectionTitle } from "@/components/mb/primitives";
import { predictMentalHealth, PredictionError, savePrediction } from "@/lib/prediction";
import {
  ACADEMIC_LEVELS,
  COUNTRIES,
  GENDERS,
  PLATFORMS,
  PURPOSES,
  STRESS_LEVELS,
  type AssessmentInput,
} from "@/lib/mb";

export const Route = createFileRoute("/_authenticated/assessment")({
  head: () => ({
    meta: [
      { title: "Take Assessment · VRITTACARE" },
      {
        name: "description",
        content: "Answer twelve quick questions about your routine and social media use to get your wellness score.",
      },
      { property: "og:title", content: "Take Assessment · VRITTACARE" },
      { property: "og:description", content: "Twelve quick questions about your daily routine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessmentPage,
});

const DEFAULTS: AssessmentInput = {
  age: 20,
  gender: "Female",
  country: "India",
  academic_level: "Undergraduate",
  most_used_platform: "Instagram",
  purpose_of_use: "Entertainment",
  avg_daily_usage_hours: 4,
  daily_unlocks: 60,
  study_hours: 4,
  physical_activity_hours: 1,
  sleep_hours_per_night: 7,
  stress_level: "Medium",
};

function AssessmentPage() {
  const [form, setForm] = useState<AssessmentInput>(DEFAULTS);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => predictMentalHealth(form),
    onSuccess: (result) => {
      savePrediction(result, form);
      toast.success("Your assessment was scored by the model.");
      navigate({ to: "/results" });
    },
    onError: (error: Error) => {
      toast.error(error instanceof PredictionError ? error.message : `Prediction failed: ${error.message}`);
    },
  });

  function set<K extends keyof AssessmentInput>(key: K, value: AssessmentInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <AppShell>
      <Panel>
        <SectionTitle sub="All twelve answers are sent to the trained model exactly as you enter them.">
          Take Assessment
        </SectionTitle>

        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <Num label="Age" value={form.age} min={10} max={100} step={1} onChange={(v) => set("age", v)} />
          <Sel label="Gender" value={form.gender} options={GENDERS} onChange={(v) => set("gender", v)} />
          <Sel label="Country" value={form.country} options={COUNTRIES} onChange={(v) => set("country", v)} />
          <Sel
            label="Academic Level"
            value={form.academic_level}
            options={ACADEMIC_LEVELS}
            onChange={(v) => set("academic_level", v)}
          />
          <Sel
            label="Most Used Platform"
            value={form.most_used_platform}
            options={PLATFORMS}
            onChange={(v) => set("most_used_platform", v)}
          />
          <Sel
            label="Purpose Of Use"
            value={form.purpose_of_use}
            options={PURPOSES}
            onChange={(v) => set("purpose_of_use", v)}
          />
          <Num
            label="Average Daily Usage (hours)"
            value={form.avg_daily_usage_hours}
            min={0}
            max={24}
            step={0.5}
            onChange={(v) => set("avg_daily_usage_hours", v)}
          />
          <Num
            label="Daily Unlocks"
            value={form.daily_unlocks}
            min={0}
            max={1000}
            step={1}
            onChange={(v) => set("daily_unlocks", v)}
          />
          <Num label="Study Hours" value={form.study_hours} min={0} max={24} step={0.5} onChange={(v) => set("study_hours", v)} />
          <Num
            label="Physical Activity (hours)"
            value={form.physical_activity_hours}
            min={0}
            max={24}
            step={0.25}
            onChange={(v) => set("physical_activity_hours", v)}
          />
          <Num
            label="Sleep Hours Per Night"
            value={form.sleep_hours_per_night}
            min={0}
            max={24}
            step={0.5}
            onChange={(v) => set("sleep_hours_per_night", v)}
          />
          <Sel
            label="Stress Level"
            value={form.stress_level}
            options={STRESS_LEVELS}
            onChange={(v) => set("stress_level", v)}
          />

          <div className="sm:col-span-2">
            {mutation.isError && (
              <p className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {mutation.error instanceof Error ? mutation.error.message : "The prediction request failed. Please try again."}
              </p>
            )}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl bg-gradient-to-r from-mb-cyan to-mb-violet px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
            >
              {mutation.isPending ? "Scoring with the model…" : "Get my score"}
            </button>
          </div>
        </form>
      </Panel>
    </AppShell>
  );
}

function Num({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        required
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-white/12 bg-mb-panel-2 px-3 py-2.5 text-sm outline-none transition focus:border-mb-cyan/60"
      />
    </label>
  );
}

function Sel({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/12 bg-mb-panel-2 px-3 py-2.5 text-sm outline-none transition focus:border-mb-cyan/60"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[oklch(0.24_0.05_272)]">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
