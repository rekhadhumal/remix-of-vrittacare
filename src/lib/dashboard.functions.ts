import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  ACADEMIC_LEVELS,
  GENDERS,
  PLATFORMS,
  PURPOSES,
  STRESS_LEVELS,
  scoreStatus,
  type Assessment,
  type DashboardData,
  type FactorImportance,
  type PredictionResult,
} from "./mb";

const assessmentSchema = z.object({
  age: z.number().int().min(10).max(100),
  gender: z.enum(GENDERS),
  country: z.string().min(1).max(80),
  academic_level: z.enum(ACADEMIC_LEVELS),
  most_used_platform: z.enum(PLATFORMS),
  purpose_of_use: z.enum(PURPOSES),
  avg_daily_usage_hours: z.number().min(0).max(24),
  daily_unlocks: z.number().int().min(0).max(1000),
  study_hours: z.number().min(0).max(24),
  physical_activity_hours: z.number().min(0).max(24),
  sleep_hours_per_night: z.number().min(0).max(24),
  stress_level: z.enum(STRESS_LEVELS),
});

type Row = Record<string, unknown>;

function toAssessment(row: Row): Assessment {
  return {
    id: row["id"] as string,
    user_id: row["user_id"] as string,
    created_at: row["created_at"] as string,
    age: Number(row["age"]),
    gender: row["gender"] as string,
    country: row["country"] as string,
    academic_level: row["academic_level"] as string,
    most_used_platform: row["most_used_platform"] as string,
    purpose_of_use: row["purpose_of_use"] as string,
    avg_daily_usage_hours: Number(row["avg_daily_usage_hours"]),
    daily_unlocks: Number(row["daily_unlocks"]),
    study_hours: Number(row["study_hours"]),
    physical_activity_hours: Number(row["physical_activity_hours"]),
    sleep_hours_per_night: Number(row["sleep_hours_per_night"]),
    stress_level: row["stress_level"] as string,
  };
}

function toResult(row: Row): PredictionResult {
  return {
    id: row["id"] as string,
    assessment_id: row["assessment_id"] as string,
    score: Number(row["score"]),
    status_label: row["status_label"] as string,
    feature_importance: (row["feature_importance"] as FactorImportance[]) ?? [],
    model_version: (row["model_version"] as string | null) ?? null,
    created_at: row["created_at"] as string,
  };
}

export const getDashboardData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardData> => {
    const { supabase, userId } = context;

    const [{ data: assessments }, { data: results }, { data: profile }] = await Promise.all([
      supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("prediction_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(40),
      supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
    ]);

    const assessmentRows = (assessments ?? []).map((r) => toAssessment(r as Row));
    const resultRows = (results ?? []).map((r) => toResult(r as Row));

    const history = assessmentRows.map((assessment) => ({
      assessment,
      result: resultRows.find((r) => r.assessment_id === assessment.id) ?? null,
    }));

    const { isPredictionServiceConfigured } = await import("./prediction.server");

    return {
      assessment: assessmentRows[0] ?? null,
      result: history[0]?.result ?? null,
      history,
      displayName: ((profile as Row | null)?.["display_name"] as string | null) ?? null,
      predictionServiceConfigured: isPredictionServiceConfigured(),
    };
  });

export const submitAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => assessmentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: inserted, error } = await supabase
      .from("assessments")
      .insert({ ...data, user_id: userId })
      .select("*")
      .single();

    if (error || !inserted) {
      throw new Error(`Could not save your assessment: ${error?.message ?? "unknown error"}`);
    }

    const assessment = toAssessment(inserted as Row);

    const { predict, PredictionServiceError } = await import("./prediction.server");

    try {
      const prediction = await predict(assessment);
      const status = scoreStatus(prediction.score);

      const { error: resultError } = await supabase.from("prediction_results").insert({
        user_id: userId,
        assessment_id: assessment.id,
        score: prediction.score,
        status_label: status.label,
        feature_importance: prediction.feature_importance,
        insights: [],
        model_version: prediction.model_version,
        raw_response: prediction.raw as never,
      });

      if (resultError) {
        throw new Error(`Could not save the prediction: ${resultError.message}`);
      }

      return { ok: true as const, assessmentId: assessment.id, score: prediction.score };
    } catch (error) {
      if (error instanceof PredictionServiceError) {
        return {
          ok: false as const,
          assessmentId: assessment.id,
          predictionConfigured: error.configured,
          message: error.message,
        };
      }
      throw error;
    }
  });
