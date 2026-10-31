import { describe, expect, it } from "vitest";
import { catalogLines, drinkCandidates, parseOracleInput, sanitizeResult } from "@/lib/oracle";
import { menu } from "@/content/menu";

const iced = parseOracleInput({ flavors: ["sweet"], temp: "iced", note: "", lang: "en" });

describe("wizard drink matcher", () => {
  it("rejects a request with no flavors and no note", () => {
    expect(() => parseOracleInput({ flavors: [], note: "  " })).toThrow();
  });

  it("only keeps drinks that exist on the menu", () => {
    const r = sanitizeResult({ intro: "hi", picks: [{ id: "unicorn-frappe", reason: "x", fun: "y" }, { id: "iced-latte", reason: "a", fun: "b" }], pairing: null }, iced);
    expect(r.picks.map((p) => p.id)).toEqual(["iced-latte"]);
  });

  it("never recommends a hot drink when the guest asked for iced", () => {
    const r = sanitizeResult({ picks: [{ id: "espresso", reason: "", fun: "" }, { id: "iced-mocha", reason: "", fun: "" }] }, iced);
    expect(r.picks.map((p) => p.id)).toEqual(["iced-mocha"]);
    expect(drinkCandidates("iced").some((m) => m.temp === "hot")).toBe(false);
  });

  it("returns at most 3 drinks, without duplicates", () => {
    const ids = ["iced-latte", "iced-latte", "iced-mocha", "iced-americano", "iced-cortado"];
    const r = sanitizeResult({ picks: ids.map((id) => ({ id, reason: "", fun: "" })) }, iced);
    expect(r.picks.map((p) => p.id)).toEqual(["iced-latte", "iced-mocha", "iced-americano"]);
  });

  it("pairs only bakery or sandwiches, never a drink", () => {
    expect(sanitizeResult({ picks: [{ id: "iced-latte" }], pairing: { id: "latte", reason: "" } }, iced).pairing).toBeNull();
    expect(sanitizeResult({ picks: [{ id: "iced-latte" }], pairing: { id: "chimney-bites", reason: "yum" } }, iced).pairing?.id).toBe("chimney-bites");
  });

  it("never sends prices to the AI", () => {
    const text = catalogLines(menu);
    expect(text).not.toMatch(/\b(43|57|61|70|75)\b/);
    expect(text).not.toContain("EGP");
  });
});
