// Client-side integration with the local Python FastAPI prediction backend.
// The request is made from the browser so that 127.0.0.1 resolves to the
// machine running the FastAPI server.

import type { AssessmentInput } from "./mb";

export const PREDICTION_URL = "http://127.0.0.1:8000/predict";

export type PredictionResponse = {
  score: number;
  category: string;
  needs_attention: string[];
  watch: string[];
  stable: string[];
};

export type SavedPrediction = {
  result: PredictionResponse;
  assessment: AssessmentInput | null;
};

export class PredictionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PredictionError";
  }
}

function toPayload(a: AssessmentInput) {
  return {
    Age: a.age,
    Gender: a.gender,
    Academic_Level: a.academic_level,
    Most_Used_Platform: a.most_used_platform,
    Purpose_Of_Use: a.purpose_of_use,
    Avg_Daily_Usage_Hours: a.avg_daily_usage_hours,
    Daily_Unlocks: a.daily_unlocks,
    Study_Hours: a.study_hours,
    Physical_Activity_Hours: a.physical_activity_hours,
    Sleep_Hours_Per_Night: a.sleep_hours_per_night,
    Stress_Level: a.stress_level,
    Country: a.country,
  };
}

function toItems(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export async function predictMentalHealth(a: AssessmentInput): Promise<PredictionResponse> {
  let response: Response;
  try {
    response = await fetch(PREDICTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(a)),
    });
  } catch {
    throw new PredictionError(
      "Could not reach the prediction server at 127.0.0.1:8000. Make sure your FastAPI server is running (with CORS enabled for this app) and try again.",
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new PredictionError(
      `The prediction server returned an error (${response.status}). ${body.slice(0, 200)}`.trim(),
    );
  }

  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    throw new PredictionError("The prediction server returned a response that was not valid JSON.");
  }

  const r = raw as Partial<Record<keyof PredictionResponse, unknown>>;
  if (typeof r.score !== "number" || Number.isNaN(r.score)) {
    throw new PredictionError("The prediction server response did not include a numeric score.");
  }

  return {
    score: r.score,
    category: typeof r.category === "string" ? r.category : "Unknown",
    needs_attention: toItems(r.needs_attention),
    watch: toItems(r.watch),
    stable: toItems(r.stable),
  };
}

const STORAGE_KEY = "vrittacare:lastPrediction";

export function savePrediction(result: PredictionResponse, assessment: AssessmentInput) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ result, assessment } satisfies SavedPrediction));
  } catch {
    // storage unavailable — results page will prompt to retake
  }
}

export function loadPrediction(): SavedPrediction | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;

    const saved = parsed as Partial<SavedPrediction> & Partial<PredictionResponse>;
    const result = saved.result ?? saved;
    if (typeof result.score !== "number" || Number.isNaN(result.score)) return null;

    return {
      result: {
        score: result.score,
        category: typeof result.category === "string" ? result.category : "Unknown",
        needs_attention: toItems(result.needs_attention),
        watch: toItems(result.watch),
        stable: toItems(result.stable),
      },
      assessment: saved.assessment && typeof saved.assessment === "object" ? saved.assessment : null,
    };
  } catch {
    return null;
  }
}
