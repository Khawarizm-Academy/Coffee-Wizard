import { createOpenAI } from "@ai-sdk/openai";
import { jsonSchema, NoObjectGeneratedError, Output, streamText } from "ai";
import { catalogLines, drinkCandidates, foodCandidates, sanitizeResult, type OracleInput, type OracleResult } from "@/lib/oracle";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export type OracleResponse =
  | { ok: true; result: OracleResult }
  | { ok: false; code: "credits" | "busy" | "config" | "refused" | "empty" | "failed"; message: string };

const schema = jsonSchema<unknown>({
  type: "object",
  additionalProperties: false,
  required: ["intro", "picks", "pairing"],
  properties: {
    intro: { type: "string" },
    picks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "reason", "fun"],
        properties: { id: { type: "string" }, reason: { type: "string" }, fun: { type: "string" } },
      },
    },
    pairing: {
      type: ["object", "null"],
      additionalProperties: false,
      required: ["id", "reason"],
      properties: { id: { type: "string" }, reason: { type: "string" } },
    },
  },
});

function instructions(lang: "en" | "ar") {
  return [
    "You are the Coffee Wizard, the witty in-house drink matchmaker at Coffee Wizard, a specialty coffee café in Mansoura, Egypt.",
    "Recommend exactly 3 drinks from the DRINKS list that best match the guest's flavor preferences, plus at most one food pairing from the FOOD list (or null).",
    "Only use ids that appear verbatim in the lists. Never invent drinks, never mention prices, calories or health claims.",
    "intro: one playful sentence (max 25 words) addressing the guest. reason: one clear sentence on why it matches their taste (max 25 words). fun: a short, light wizard-themed quip (max 12 words), clever not cringey.",
    lang === "ar"
      ? "Write intro, reason and fun in friendly Egyptian Arabic. Keep drink names in English."
      : "Write in English.",
  ].join("\n");
}

function statusOf(err: unknown): number | undefined {
  let e: unknown = err;
  for (let i = 0; i < 4 && e; i++) {
    const s = (e as { statusCode?: unknown }).statusCode;
    if (typeof s === "number") return s;
    e = (e as { cause?: unknown }).cause ?? (e as { lastError?: unknown }).lastError;
  }
  return undefined;
}

export async function runOracle(input: OracleInput, signal?: AbortSignal): Promise<OracleResponse> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { ok: false, code: "config", message: "The wizard's spellbook isn't set up yet." };

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const prompt = [
    `Guest flavors: ${input.flavors.join(", ") || "not specified"}`,
    `Temperature: ${input.temp}`,
    `Guest says: ${input.note || "(nothing extra)"}`,
    "",
    "DRINKS (id | name | category | temp | description):",
    catalogLines(drinkCandidates(input.temp)),
    "",
    "FOOD (id | name | category | temp | description):",
    catalogLines(foodCandidates()),
  ].join("\n");

  try {
    const result = streamText({
      model: provider.responses(MODEL),
      instructions: instructions(input.lang),
      messages: [{ role: "user", content: prompt }],
      output: Output.object({ schema }),
      maxRetries: 1,
      ...(signal ? { abortSignal: signal } : {}),
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const raw = await result.output;
    const clean = sanitizeResult(raw, input);
    if (clean.picks.length === 0)
      return { ok: false, code: "empty", message: "The wizard came up empty this time. Try different flavors." };
    return { ok: true, result: clean };
  } catch (err) {
    if (NoObjectGeneratedError.isInstance(err)) {
      const finish = (err as { finishReason?: string }).finishReason;
      if (finish === "content-filter")
        return { ok: false, code: "refused", message: "The wizard can't help with that request." };
      return { ok: false, code: "empty", message: "The wizard's answer got lost in the steam. Please try again." };
    }
    const status = statusOf(err);
    console.error("oracle failed", status, err);
    if (status === 402) return { ok: false, code: "credits", message: "The wizard is out of magic credits for now." };
    if (status === 429) return { ok: false, code: "busy", message: "The wizard is very popular right now. Try again in a minute." };
    if (status === 401) return { ok: false, code: "config", message: "The wizard's spellbook isn't set up correctly." };
    if (status === 403) return { ok: false, code: "refused", message: "The wizard isn't allowed to answer that right now." };
    return { ok: false, code: "failed", message: "Something spilled. Please try again." };
  }
}
