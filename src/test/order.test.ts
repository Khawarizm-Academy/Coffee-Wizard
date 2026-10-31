import { describe, expect, it } from "vitest";
import type { MenuItem } from "@/content/menu";
import { buildMockPurchasePreview, summarizeOrder } from "@/lib/order";

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
});

describe("mock purchase preview", () => {
  it("creates a local preview even when prices are unconfirmed without any email destination", () => {
    const summary = summarizeOrder([makeItem({ priceStatus: "unconfirmed" })], { latte: 2 });
    const preview = buildMockPurchasePreview(summary.lines, summary.total);

    expect(preview).toMatchObject({ kind: "mock", total: null, itemCount: 2 });
    expect(preview?.lines[0]?.lineTotal).toBeNull();
    expect(preview).not.toHaveProperty("email");
    expect(preview).not.toHaveProperty("recipient");
    expect(preview).not.toHaveProperty("href");
  });

  it("has no preview when the customer has not selected an item", () => {
    expect(buildMockPurchasePreview([], null)).toBeNull();
  });
});
