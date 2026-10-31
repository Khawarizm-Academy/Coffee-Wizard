import { describe, expect, it } from "vitest";
import type { MenuItem } from "@/content/menu";
import { buildOrderMailto, summarizeOrder } from "@/lib/order";

const makeItem = (overrides: Partial<MenuItem> = {}): MenuItem => ({
  id: "latte",
  nameEn: "Latte",
  category: "hot-coffee",
  temp: "hot",
  price: 60,
  currency: "EGP",
  priceStatus: "verified",
  available: true,
  source: "verified café menu",
  ...overrides,
});

describe("order summary", () => {
  it("totals selected items only when every selected price is verified", () => {
    const menu = [makeItem(), makeItem({ id: "americano", nameEn: "Americano", price: 45 })];
    const result = summarizeOrder(menu, { latte: 2, americano: 1, missing: 7 });

    expect(result.lines).toHaveLength(2);
    expect(result.total).toBe(165);
    expect(result.unpricedCount).toBe(0);
  });

  it("does not calculate or expose a total while a selected price is unconfirmed", () => {
    const menu = [makeItem(), makeItem({ id: "mocha", priceStatus: "unconfirmed" })];
    const result = summarizeOrder(menu, { latte: 1, mocha: 2 });

    expect(result.total).toBeNull();
    expect(result.unpricedCount).toBe(1);
    expect(result.lines[1]?.lineTotal).toBeNull();
  });

  it("omits zero and negative quantities", () => {
    const result = summarizeOrder([makeItem()], { latte: -2 });

    expect(result.lines).toHaveLength(0);
    expect(result.total).toBeNull();
  });

  it("builds a percent-encoded email draft only for complete priced orders", () => {
    const summary = summarizeOrder([makeItem()], { latte: 2 });
    const href = buildOrderMailto("orders@example.com", summary.lines, summary.total!);

    expect(href).toContain("mailto:orders@example.com");
    expect(decodeURIComponent(href ?? "")).toContain("Latte x 2");
    expect(buildOrderMailto("", summary.lines, summary.total!)).toBeNull();
    expect(buildOrderMailto("orders@example.com", [], 0)).toBeNull();
  });
});
