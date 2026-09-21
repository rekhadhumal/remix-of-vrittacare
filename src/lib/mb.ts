// Shared, client-safe types and presentation helpers for VRITTACARE.
// NOTE: nothing here predicts a score — the score always comes from the
// external scikit-learn Random Forest service (see PREDICTION_API.md).

export const GENDERS = ["Male", "Female", "Other"] as const;
export const ACADEMIC_LEVELS = ["High School", "Undergraduate", "Graduate"] as const;
export const PLATFORMS = [
  "Instagram",
  "TikTok",
  "Facebook",
  "YouTube",
  "WhatsApp",
  "Twitter",
  "Snapchat",
  "LinkedIn",
  "Reddit",
  "Other",
] as const;
export const PURPOSES = [
  "Entertainment",
  "Socializing",
  "Academic",
  "Professional",
  "Other",
] as const;
/** Ordinal order used by the model's preprocessor. Do not reorder. */
export const STRESS_LEVELS = ["Low", "Medium", "High", "Very High"] as const;

export const COUNTRIES = [
  "India",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Brazil",
  "Mexico",
  "Japan",
  "South Korea",
  "China",
  "Nigeria",
  "South Africa",
  "Egypt",
  "UAE",
  "Other",
] as const;

export type AssessmentInput = {
  age: number;
  gender: string;
  country: string;
  academic_level: string;
  most_used_platform: string;
  purpose_of_use: string;
  avg_daily_usage_hours: number;
  daily_unlocks: number;
  study_hours: number;
  physical_activity_hours: number;
  sleep_hours_per_night: number;
  stress_level: string;
};

export type Assessment = AssessmentInput & {
  id: string;
  user_id: string;
  created_at: string;
};

export type FactorImportance = { feature: string; importance: number };

export type PredictionResult = {
  id: string;
  assessment_id: string;
  score: number;
  status_label: string;
  feature_importance: FactorImportance[];
  model_version: string | null;
  created_at: string;
};

export type DashboardData = {
  assessment: Assessment | null;
  result: PredictionResult | null;
  history: { assessment: Assessment; result: PredictionResult | null }[];
  displayName: string | null;
  predictionServiceConfigured: boolean;
};

export function scoreStatus(score: number) {
  if (score >= 8) return { label: "Thriving", headline: "Your current pattern looks strong!" };
  if (score >= 6.5)
    return { label: "Stable", headline: "Your current pattern looks relatively stable!" };
  if (score >= 5)
    return { label: "Mixed", headline: "Your current pattern shows some strain." };
  return { label: "Needs Care", headline: "Your current pattern suggests you need support." };
}

export type LifestyleCard = {
  label: string;
  value: string;
  unit: string;
  tag: string;
  tone: "good" | "warn" | "bad";
  key: "sleep" | "study" | "screen" | "activity" | "stress";
};

export function lifestyleCards(a: AssessmentInput): LifestyleCard[] {
  const sleepTag =
    a.sleep_hours_per_night >= 7 ? "Good" : a.sleep_hours_per_night >= 6 ? "Could Improve" : "Needs Attention";
  const studyTag = a.study_hours >= 3 ? "Balanced" : "Could Improve";
  const screenTag =
    a.avg_daily_usage_hours <= 3 ? "Healthy" : a.avg_daily_usage_hours <= 5 ? "Could Improve" : "Needs Attention";
  const activityTag =
    a.physical_activity_hours >= 1.5 ? "Good" : a.physical_activity_hours >= 0.75 ? "Could Improve" : "Needs Attention";
  const stressTag =
    a.stress_level === "Low" ? "Good" : a.stress_level === "Medium" ? "Pay Attention" : "Needs Attention";

  const tone = (t: string): LifestyleCard["tone"] =>
    t === "Good" || t === "Balanced" || t === "Healthy" ? "good" : t === "Could Improve" || t === "Pay Attention" ? "warn" : "bad";

  return [
    { key: "sleep", label: "Sleep", value: a.sleep_hours_per_night.toFixed(1), unit: "hrs", tag: sleepTag, tone: tone(sleepTag) },
    { key: "study", label: "Study", value: a.study_hours.toFixed(1), unit: "hrs", tag: studyTag, tone: tone(studyTag) },
    { key: "screen", label: "Screen Usage", value: a.avg_daily_usage_hours.toFixed(1), unit: "hrs", tag: screenTag, tone: tone(screenTag) },
    { key: "activity", label: "Activity", value: a.physical_activity_hours.toFixed(1), unit: "hrs", tag: activityTag, tone: tone(activityTag) },
    { key: "stress", label: "Stress", value: a.stress_level, unit: "", tag: stressTag, tone: tone(stressTag) },
  ];
}

/** 0..1 values for the radar chart, derived from the raw inputs only. */
export function radarValues(a: AssessmentInput) {
  const clamp = (n: number) => Math.max(0.12, Math.min(1, n));
  const stressIdx = STRESS_LEVELS.indexOf(a.stress_level as (typeof STRESS_LEVELS)[number]);
  return [
    { label: "Sleep", value: clamp(a.sleep_hours_per_night / 9) },
    { label: "Study", value: clamp(a.study_hours / 8) },
    { label: "Activity", value: clamp(a.physical_activity_hours / 3) },
    { label: "Screen Usage", value: clamp(1 - a.avg_daily_usage_hours / 10) },
    { label: "Stress", value: clamp(1 - (stressIdx < 0 ? 1 : stressIdx) / 3) },
  ];
}

export type Insight = { title: string; text: string; key: LifestyleCard["key"] };

export function buildInsights(a: AssessmentInput): Insight[] {
  const out: Insight[] = [];
  out.push({
    key: "sleep",
    title: "Sleep",
    text:
      a.sleep_hours_per_night >= 7
        ? "Your sleep duration is in a healthy range."
        : "You are sleeping less than most people need. Try shifting bedtime 30 minutes earlier.",
  });
  out.push({
    key: "study",
    title: "Study",
    text:
      a.study_hours >= 3
        ? "Your study hours are reasonable."
        : "Short, regular study blocks may help you feel more in control of your workload.",
  });
  out.push({
    key: "screen",
    title: "Screen Usage",
    text:
      a.avg_daily_usage_hours <= 3
        ? "Your daily social-media usage looks well balanced."
        : `About ${a.avg_daily_usage_hours} hours a day on ${a.most_used_platform} is on the higher side. Reducing unnecessary usage may help maintain better balance.`,
  });
  out.push({
    key: "activity",
    title: "Physical Activity",
    text:
      a.physical_activity_hours >= 1.5
        ? "Your activity level supports your overall routine nicely."
        : "Adding a little more physical activity could support your overall routine.",
  });
  if (a.stress_level !== "Low") {
    out.push({
      key: "stress",
      title: "Stress",
      text: `You reported ${a.stress_level.toLowerCase()} stress. Short breaks, breathing exercises or talking to someone you trust can help.`,
    });
  }
  return out;
}

export function prettyFeature(name: string) {
  return name
    .replace(/_/g, " ")
    .replace(/\bnum\b|\bcat\b/gi, "")
    .trim();
}
