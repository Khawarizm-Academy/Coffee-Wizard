import { describe, expect, it } from "vitest";
import { menu, searchMenu } from "@/content/menu";

describe("menu", () => {
  it("filters by category", () => {
    const r = searchMenu(menu, "", "pour-over");
    expect(r.map((m) => m.nameEn)).toEqual(["V60", "Chemex", "AeroPress", "Syphon", "French Press"]);
  });
  it("searches by name case-insensitively", () => {
    expect(searchMenu(menu, "chemex", "all").map((m) => m.id)).toEqual(["chemex"]);
  });
  it("never marks a price as verified without confirmation", () => {
    expect(menu.filter((m) => m.priceStatus === "verified")).toHaveLength(0);
  });
});
