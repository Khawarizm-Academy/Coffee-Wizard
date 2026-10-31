// Client-safe rules for the "Ask the Wizard" drink matcher.
// The AI only ever chooses from these menu ids; everything it returns is re-checked here.
import { menu, type MenuItem } from "@/content/menu";

export const FLAVORS = ["sweet", "nutty", "chocolatey", "fruity", "strong", "creamy", "light", "earthy"] as const;
export type Flavor = (typeof FLAVORS)[number];
export type TempPref = "hot" | "iced" | "any";
export type OracleInput = { flavors: Flavor[]; temp: TempPref; note: string; lang: "en" | "ar" };

export const MAX_NOTE = 280;
export const MAX_PICKS = 3;
const FOOD = new Set<MenuItem["category"]>(["bakery", "sandwiches"]);

export function parseOracleInput(raw: unknown): OracleInput {
  const r = (raw ?? {}) as Record<string, unknown>;
  const flavors = Array.isArray(r["flavors"])
    ? [...new Set(r["flavors"].filter((f): f is Flavor => FLAVORS.includes(f as Flavor)))]
    : [];
  const temp: TempPref = r["temp"] === "hot" || r["temp"] === "iced" ? r["temp"] : "any";
  const note = typeof r["note"] === "string" ? r["note"].trim().slice(0, MAX_NOTE) : "";
  const lang = r["lang"] === "ar" ? "ar" : "en";
  if (flavors.length === 0 && !note) throw new Error("Tell the wizard at least one flavor or a few words.");
  return { flavors, temp, note, lang };
}

const tempOk = (m: MenuItem, temp: TempPref) => temp === "any" || !m.temp || m.temp === temp;

export function drinkCandidates(temp: TempPref, items: MenuItem[] = menu) {
  return items.filter((m) => m.available && !FOOD.has(m.category) && tempOk(m, temp));
}
export function foodCandidates(items: MenuItem[] = menu) {
  return items.filter((m) => m.available && FOOD.has(m.category));
}

/** Compact catalog for the prompt. Prices are deliberately left out. */
export function catalogLines(list: MenuItem[]) {
  return list
    .map((m) => [m.id, m.nameEn, m.category, m.temp ?? "hot-or-iced", m.descriptionEn ?? ""].join(" | "))
    .join("\n");
}

export type OraclePick = { id: string; reason: string; fun: string };
export type OracleResult = { intro: string; picks: OraclePick[]; pairing: { id: string; reason: string } | null };

const clean = (s: unknown, max = 220) => (typeof s === "string" ? s.trim().slice(0, max) : "");

export function sanitizeResult(raw: unknown, input: OracleInput, items: MenuItem[] = menu): OracleResult {
  const r = (raw ?? {}) as Record<string, unknown>;
  const drinks = new Set(drinkCandidates(input.temp, items).map((m) => m.id));
  const foods = new Set(foodCandidates(items).map((m) => m.id));
  const seen = new Set<string>();
  const picks: OraclePick[] = [];
  for (const p of Array.isArray(r["picks"]) ? r["picks"] : []) {
    const id = clean((p as Record<string, unknown>)?.["id"], 60);
    if (!drinks.has(id) || seen.has(id)) continue;
    seen.add(id);
    picks.push({ id, reason: clean((p as Record<string, unknown>)["reason"]), fun: clean((p as Record<string, unknown>)["fun"], 140) });
    if (picks.length === MAX_PICKS) break;
  }
  const pr = r["pairing"] as Record<string, unknown> | null | undefined;
  const pid = clean(pr?.["id"], 60);
  return {
    intro: clean(r["intro"], 260),
    picks,
    pairing: pid && foods.has(pid) ? { id: pid, reason: clean(pr?.["reason"]) } : null,
  };
}
