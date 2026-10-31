import type { MenuItem } from "@/content/menu";

export type OrderLine = {
  item: MenuItem;
  quantity: number;
  lineTotal: number | null;
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

export function buildOrderMailto(email: string, lines: OrderLine[], total: number): string | null {
  const recipient = email.trim();
  if (!recipient || lines.length === 0 || lines.some((line) => line.lineTotal === null))
    return null;

  const body = [
    "Hello Coffee Wizard,",
    "",
    "I would like to place this order:",
    ...lines.map((line) => `- ${line.item.nameEn} x ${line.quantity} — EGP ${line.lineTotal}`),
    "",
    `Total: EGP ${total}`,
  ].join("\n");

  return `mailto:${recipient}?subject=${encodeURIComponent("Coffee Wizard order")}&body=${encodeURIComponent(body)}`;
}
