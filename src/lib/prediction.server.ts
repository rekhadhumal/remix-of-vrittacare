// Integration boundary for the external scikit-learn prediction service.
// See PREDICTION_API.md for the exact contract this expects.

import type { AssessmentInput, FactorImportance } from "./mb";

export type PredictionServiceResponse = {
  score: number;
  feature_importance: FactorImportance[];
  model_version: string | null;
  raw: unknown;
};

export class PredictionServiceError extends Error {
  readonly configured: boolean;
  constructor(message: string, configured = true) {
    super(message);
    this.name = "PredictionServiceError";
    this.configured = configured;
  }
}

export function isPredictionServiceConfigured() {
  return Boolean(process.env["PREDICTION_API_URL"]);
}

function toPayload(a: AssessmentInput) {
  return {
    Age: a.age,
    Gender: a.gender,
    Country: a.country,
    Academic_Level: a.academic_level,
    Most_Used_Platform: a.most_used_platform,
    Purpose_Of_Use: a.purpose_of_use,
    Avg_Daily_Usage_Hours: a.avg_daily_usage_hours,
    Daily_Unlocks: a.daily_unlocks,
    Study_Hours: a.study_hours,
    Physical_Activity_Hours: a.physical_activity_hours,
    Sleep_Hours_Per_Night: a.sleep_hours_per_night,
    Stress_Level: a.stress_level,
  };
}

export async function predict(a: AssessmentInput): Promise<PredictionServiceResponse> {
  const baseUrl = process.env["PREDICTION_API_URL"];
  const apiKey = process.env["PREDICTION_API_KEY"];

  if (!baseUrl) {
    throw new PredictionServiceError(
      "The prediction service is not connected yet. Your answers were saved and can be scored as soon as the model service is online.",
      false,
    );
  }

  const url = `${baseUrl.replace(/\/$/, "")}/predict`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "X-API-Key": apiKey } : {}),
      },
      body: JSON.stringify(toPayload(a)),
    });
  } catch (error) {
    throw new PredictionServiceError(
      `Could not reach the prediction service: ${(error as Error).message}`,
    );
  }

  if (!response.ok) {
    const body = await response.text();
    throw new PredictionServiceError(
      `The prediction service returned ${response.status}: ${body.slice(0, 300)}`,
    );
  }

  const raw = (await response.json()) as {
    mental_health_score?: number;
    score?: number;
    feature_importance?: FactorImportance[];
    model_version?: string;
  };

  const score = raw.mental_health_score ?? raw.score;
  if (typeof score !== "number" || Number.isNaN(score)) {
    throw new PredictionServiceError(
      "The prediction service response did not include a numeric mental_health_score.",
    );
  }

  const importance = Array.isArray(raw.feature_importance)
    ? raw.feature_importance
        .filter((f) => typeof f?.feature === "string" && typeof f?.importance === "number")
        .sort((a2, b) => b.importance - a2.importance)
        .slice(0, 8)
    : [];

  return {
    score,
    feature_importance: importance,
    model_version: raw.model_version ?? null,
    raw,
  };
}
