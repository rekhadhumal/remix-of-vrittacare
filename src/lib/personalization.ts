import type { AssessmentInput } from "./mb";

export const WELLNESS_QUOTES = [
  "You are not behind. You are becoming — one brave, quiet step at a time.",
  "Small changes are still changes. Let today count for something gentle.",
  "You do not need a perfect routine. You need one that can hold you on ordinary days.",
  "Your pace is allowed to be human. Keep moving in the direction that feels kind.",
  "A better day can begin with one small decision you make for yourself.",
  "Rest is not a reward for finishing everything. Rest is part of how you continue.",
  "You can care about your goals without being hard on yourself.",
  "Some progress is visible. Some progress is simply choosing not to give up.",
  "Your habits are information, not a verdict on who you are.",
  "Make room for the version of you that needs patience today.",
  "One calmer hour can change the shape of an entire evening.",
  "You are allowed to start again without calling the earlier attempt a failure.",
  "The strongest routine is often the one you can return to after a difficult day.",
  "You do not have to carry tomorrow while you are still living today.",
  "Let consistency be quieter than pressure and stronger than perfection.",
  "There is nothing weak about slowing down long enough to understand what you need.",
  "Your future self is built through ordinary choices no one else gets to see.",
  "A little more sleep, a little more movement, a little less pressure — it all matters.",
  "You deserve tools that help you understand yourself, not labels that define you.",
  "Keep one promise to yourself today. Let that be enough to begin.",
  "You are more than a score. The useful part is what the score helps you notice.",
  "Even when progress feels invisible, choosing a healthier next step still matters.",
  "Your mind deserves the same patience you would give someone you care about.",
  "The goal is not to control every day. It is to build a life you can keep returning to.",
  "Quiet progress is still progress. Give it time to become visible."
] as const;

const HERO_QUOTES = [
  "You do not need to have it all figured out to take the next meaningful step.",
  "The life you want is often shaped by the small choices you repeat when nobody is watching.",
  "Give yourself permission to grow at a pace that still lets you breathe.",
  "A difficult season does not get to write the whole story of who you become.",
  "Your next chapter does not need a dramatic beginning — it needs an honest one.",
  "Keep choosing the things that make tomorrow a little kinder to meet.",
  "You can be ambitious about your future and gentle with yourself at the same time.",
  "What you notice today can become the change you are grateful for later.",
  "There is strength in knowing when to pause, reflect, and begin again.",
  "Your direction matters more than the speed at which you get there.",
  "A healthier rhythm is built one ordinary day at a time.",
  "You are allowed to make progress without turning your life into a race."
] as const;

const HERO_LINES = [
  "Your patterns are not a verdict — they are a starting point for a more intentional day.",
  "Today does not need a complete reset. It only needs one next step that feels possible.",
  "Use this space to notice what is working, understand what is asking for attention, and move gently.",
  "Your latest check-in gives you a snapshot. What matters next is how you choose to respond to it.",
  "Think of this as a pause between where you are and where you want to go.",
  "You bring the experience; VRITTACARE simply helps make the patterns easier to see."
] as const;

const INSIGHT_OPENERS = [
  "Your result is a starting point, not the whole story.",
  "This space turns your latest check-in into a few realistic choices.",
  "There is no checklist to finish here — just a few options shaped around your routine.",
  "Use these ideas as a menu, not a set of rules.",
  "Your answers give us a direction; you decide which step belongs in your day."
] as const;

const RESULT_LINES = [
  "Here is the model's latest snapshot, with the context needed to read it responsibly.",
  "Your score is one signal. The useful part is understanding the pattern behind it.",
  "Take a moment with the result before deciding what you want to change.",
  "This page is for understanding the prediction clearly — not for judging yourself.",
  "Your latest result is ready. Look for patterns, not perfection."
] as const;

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function pickForUser<T>(seed: string, values: readonly T[], salt = 0): T {
  const index = (hashSeed(seed + ":" + salt) % values.length + values.length) % values.length;
  return values[index];
}

export function getWellnessQuote(seed: string, salt = 0): string {
  return pickForUser(seed || "vrittacare", WELLNESS_QUOTES, salt);
}

export function getHeroQuote(seed: string, salt = 0): string {
  return pickForUser(seed || "vrittacare", HERO_QUOTES, salt);
}

export function getHeroLine(seed: string, salt = 0): string {
  return pickForUser(seed || "vrittacare", HERO_LINES, salt);
}

export function getInsightOpener(seed: string, salt = 0): string {
  return pickForUser(seed || "vrittacare", INSIGHT_OPENERS, salt);
}

export function getResultLine(seed: string, salt = 0): string {
  return pickForUser(seed || "vrittacare", RESULT_LINES, salt);
}

export function getUserSeed(name: string | null | undefined, assessment?: AssessmentInput | null): string {
  const assessmentSeed = assessment
    ? [
        assessment.age,
        assessment.gender,
        assessment.academic_level,
        assessment.most_used_platform,
        assessment.purpose_of_use,
        assessment.avg_daily_usage_hours,
        assessment.daily_unlocks,
        assessment.study_hours,
        assessment.physical_activity_hours,
        assessment.sleep_hours_per_night,
        assessment.stress_level,
        assessment.country,
      ].join("|")
    : "";

  return [name ?? "", assessmentSeed].join("::").trim() || "vrittacare";
}
