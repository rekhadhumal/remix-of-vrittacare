import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { buildInsights, lifestyleCards, prettyFeature, type AssessmentInput } from "./mb";

export type ChatMessage = { id: string; role: "user" | "assistant"; content: string; created_at: string };

type Row = Record<string, unknown>;

function toMessage(row: Row): ChatMessage {
  return {
    id: row["id"] as string,
    role: row["role"] as "user" | "assistant",
    content: row["content"] as string,
    created_at: row["created_at"] as string,
  };
}

export const getChatMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ChatMessage[]> => {
    const { data } = await context.supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(200);
    return (data ?? []).map((r) => toMessage(r as Row));
  });

export const clearChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase.from("chat_messages").delete().eq("user_id", context.userId);
    return { ok: true };
  });

function buildContext(assessment: AssessmentInput | null, result: Row | null) {
  if (!assessment) {
    return "The user has not completed an assessment yet. Encourage them to take one; do not invent any score.";
  }
  const cards = lifestyleCards(assessment)
    .map((c) => `${c.label}: ${c.value}${c.unit ? " " + c.unit : ""} (${c.tag})`)
    .join("; ");
  const insights = buildInsights(assessment)
    .map((i) => `${i.title}: ${i.text}`)
    .join(" | ");

  const factors = Array.isArray(result?.["feature_importance"])
    ? (result["feature_importance"] as { feature: string; importance: number }[])
        .map((f) => `${prettyFeature(f.feature)} (${f.importance.toFixed(3)})`)
        .join(", ")
    : "not available";

  return [
    `Latest assessment inputs: age ${assessment.age}, gender ${assessment.gender}, country ${assessment.country}, academic level ${assessment.academic_level}, most used platform ${assessment.most_used_platform}, purpose ${assessment.purpose_of_use}, average daily usage ${assessment.avg_daily_usage_hours}h, daily unlocks ${assessment.daily_unlocks}, study ${assessment.study_hours}h, physical activity ${assessment.physical_activity_hours}h, sleep ${assessment.sleep_hours_per_night}h, self-reported stress ${assessment.stress_level}.`,
    result
      ? `Model output: mental health score ${Number(result["score"]).toFixed(1)}/10, status "${result["status_label"]}". Top model factors by importance: ${factors}.`
      : "No model score is available for this assessment yet — the prediction service has not returned a score. Never guess or estimate a score.",
    `Lifestyle summary: ${cards}.`,
    `Guidance already shown in the app: ${insights}`,
  ].join("\n");
}

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ message: z.string().min(1).max(2000) }).parse(input))
  .handler(async ({ data, context }): Promise<{ reply: ChatMessage }> => {
    const { supabase, userId } = context;

    const [{ data: assessments }, { data: results }, { data: history }] = await Promise.all([
      supabase.from("assessments").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(2),
      supabase
        .from("prediction_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(2),
      supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(40),
    ]);

    const latest = (assessments?.[0] as unknown as AssessmentInput | undefined) ?? null;
    const latestResult = (results?.[0] as Row | undefined) ?? null;
    const previousResult = (results?.[1] as Row | undefined) ?? null;

    const comparison = previousResult
      ? `Previous model score: ${Number(previousResult["score"]).toFixed(1)}/10 on ${String(previousResult["created_at"]).slice(0, 10)}.`
      : "There is no earlier result to compare with.";

    const system = [
      "You are the VRITTACARE Wellness Assistant inside a student mental-health dashboard.",
      "Answer only from the user's saved data below. Be warm, concrete and brief (max ~120 words).",
      "Never invent, estimate or recalculate a mental health score — scores come only from the trained model.",
      "You are not a clinician; for signs of crisis, gently suggest reaching out to a professional or trusted person.",
      "",
      buildContext(latest, latestResult),
      comparison,
    ].join("\n");

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("The assistant is not configured (missing AI key).");

    const priorMessages = (history ?? []).map((r) => ({
      role: (r as Row)["role"] as "user" | "assistant",
      content: (r as Row)["content"] as string,
    }));

    const { streamText } = await import("ai");
    const { createOpenAI } = await import("@ai-sdk/openai");

    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    let text: string;
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        system,
        messages: [...priorMessages, { role: "user" as const, content: data.message }],
        providerOptions: {
          openai: { forceReasoning: true, reasoningEffort: "low", store: false },
        },
      });
      text = (await result.text).trim();
    } catch (error) {
      const message = (error as Error).message ?? "";
      if (message.includes("402")) throw new Error("The assistant is out of AI credits. Please add credits to continue.");
      if (message.includes("429")) throw new Error("The assistant is busy right now. Please try again in a moment.");
      throw new Error(`The assistant could not respond: ${message}`);
    }

    if (!text) text = "I couldn't put that into words just now — could you rephrase your question?";

    const { data: inserted, error } = await supabase
      .from("chat_messages")
      .insert([
        { user_id: userId, role: "user", content: data.message },
        { user_id: userId, role: "assistant", content: text },
      ])
      .select("*");

    if (error) throw new Error(`Could not save the conversation: ${error.message}`);

    const assistantRow = (inserted ?? []).find((r) => (r as Row)["role"] === "assistant");
    return {
      reply: assistantRow
        ? toMessage(assistantRow as Row)
        : { id: crypto.randomUUID(), role: "assistant", content: text, created_at: new Date().toISOString() },
    };
  });
