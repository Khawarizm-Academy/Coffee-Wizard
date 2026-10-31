import type { MenuItem } from "@/content/menu";

export type OrderLine = {
  item: MenuItem;
  quantity: number;
  lineTotal: number | null;
};

export type MockPurchasePreview = {
  kind: "mock";
  lines: readonly OrderLine[];
  total: number | null;
  itemCount: number;
};

export function summarizeOrder(menuItems: readonly MenuItem[], quantities: Record<string, number>) {
  const lines: OrderLine[] = menuItems.flatMap((item) => {
    const quantity = Math.max(0, Math.floor(quantities[item.id] ?? 0));
    if (quantity === 0) return [];
    const verified = item.priceStatus === "verified" && typeof item.price === "number";
    return [{ item, quantity, lineTotal: verified ? item.price! * quantity : null }];
  });

  const unpricedCount = lines.filter((line) => line.lineTotal === null).length;
  const total =
    lines.length > 0 && unpricedCount === 0
      ? lines.reduce((sum, line) => sum + (line.lineTotal ?? 0), 0)
      : null;

  return { lines, total, unpricedCount };
}

/** Build a local display model only; this function never constructs an email or sends an order. */
export function buildMockPurchasePreview(
  lines: readonly OrderLine[],
  total: number | null,
): MockPurchasePreview | null {
  if (lines.length === 0) return null;
  return {
    kind: "mock",
    lines: [...lines],
    total,
    itemCount: lines.reduce((count, line) => count + line.quantity, 0),
  };
}
