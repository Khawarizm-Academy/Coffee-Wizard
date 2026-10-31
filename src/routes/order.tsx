import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Search, Send, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { business } from "@/content/business";
import { categories, menu, type CategoryId, type MenuItem } from "@/content/menu";
import { buildOrderMailto, summarizeOrder } from "@/lib/order";
import { Reveal } from "@/components/cw/Motion";

const drinkCategoryIds: CategoryId[] = [
  "hot-coffee",
  "pour-over",
  "iced-coffee",
  "signature",
  "matcha",
  "non-coffee",
];
const drinkCategories = categories.filter((category) => drinkCategoryIds.includes(category.id));
const drinks = menu.filter((item) => drinkCategoryIds.includes(item.category) && item.available);

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order — Coffee Wizard Mansoura (Concept)" },
      {
        name: "description",
        content:
          "Choose drinks from the Coffee Wizard menu, adjust quantities, and prepare an email order.",
      },
      { property: "og:title", content: "Order from Coffee Wizard" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: OrderPage,
});

function itemName(item: MenuItem, lang: "en" | "ar") {
  return lang === "ar" && item.nameAr ? item.nameAr : item.nameEn;
}

function OrderPage() {
  const { t, lang } = useLang();
  const o = t.order;
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredDrinks = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return drinks.filter((item) => {
      const inCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !search ||
        item.nameEn.toLocaleLowerCase().includes(search) ||
        (item.nameAr ?? "").includes(query.trim());
      return inCategory && matchesSearch;
    });
  }, [activeCategory, query]);

  const summary = useMemo(() => summarizeOrder(drinks, quantities), [quantities]);
  const mailto =
    summary.total === null
      ? null
      : buildOrderMailto(business.orderEmail, summary.lines, summary.total);
  const itemCount = summary.lines.reduce((sum, line) => sum + line.quantity, 0);
  const money = (amount: number) =>
    new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(amount);

  function adjust(itemId: string, amount: number) {
    setQuantities((current) => {
      const nextQuantity = Math.max(0, (current[itemId] ?? 0) + amount);
      const next = { ...current };
      if (nextQuantity === 0) delete next[itemId];
      else next[itemId] = nextQuantity;
      return next;
    });
  }

  return (
    <div className="container-cw py-14 md:py-20">
      <Reveal>
        <p className="eyebrow">{o.eyebrow}</p>
        <h1 className="font-display mt-3 text-4xl font-bold leading-tight md:text-6xl">
          {o.title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{o.subtitle}</p>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)]">
        <section aria-label={o.allDrinks}>
          <label className="relative block max-w-xl">
            <span className="sr-only">{o.search}</span>
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={o.search}
              className="w-full rounded-full border border-input bg-card py-3 ps-11 pe-4 text-sm focus:border-ring focus:outline-none"
            />
          </label>

          <div
            className="mt-4 flex gap-2 overflow-x-auto pb-2"
            role="tablist"
            aria-label={o.allDrinks}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${activeCategory === "all" ? "border-charcoal bg-charcoal text-cream" : "border-border hover:border-charcoal"}`}
            >
              {o.allDrinks}
            </button>
            {drinkCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${activeCategory === category.id ? "border-charcoal bg-charcoal text-cream" : "border-border hover:border-charcoal"}`}
              >
                {lang === "ar" ? category.nameAr : category.nameEn}
              </button>
            ))}
          </div>

          {filteredDrinks.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">{o.empty}</p>
          ) : (
            <Reveal delay={80} className="mt-5 grid gap-3 sm:grid-cols-2">
              {filteredDrinks.map((item) => {
                const quantity = quantities[item.id] ?? 0;
                const verifiedPrice =
                  item.priceStatus === "verified" && typeof item.price === "number";
                return (
                  <article
                    key={item.id}
                    className="flex min-h-32 flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="eyebrow !text-[0.65rem]">
                          {lang === "ar"
                            ? categories.find((category) => category.id === item.category)?.nameAr
                            : categories.find((category) => category.id === item.category)?.nameEn}
                        </p>
                        <h2 className="font-display mt-1 text-lg font-semibold" dir="auto">
                          {itemName(item, lang)}
                        </h2>
                      </div>
                      <span className="shrink-0 text-end text-sm font-semibold" dir="ltr">
                        {verifiedPrice ? (
                          money(item.price!)
                        ) : (
                          <span
                            className="text-xs font-normal text-muted-foreground"
                            dir={lang === "ar" ? "rtl" : "ltr"}
                          >
                            {o.pricePending}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">{o.quantity}</span>
                      <div className="inline-flex items-center gap-3 rounded-full border border-border px-2 py-1">
                        <button
                          type="button"
                          onClick={() => adjust(item.id, -1)}
                          disabled={quantity === 0}
                          aria-label={`${o.removeOne}: ${itemName(item, lang)}`}
                          className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <output
                          className="min-w-5 text-center text-sm font-bold"
                          aria-live="polite"
                        >
                          {quantity}
                        </output>
                        <button
                          type="button"
                          onClick={() => adjust(item.id, 1)}
                          aria-label={`${o.addOne}: ${itemName(item, lang)}`}
                          className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </Reveal>
          )}
        </section>

        <aside
          className="h-fit rounded-xl border border-border bg-charcoal p-5 text-on-dark shadow-card lg:sticky lg:top-28 md:p-6"
          aria-labelledby="order-summary-title"
        >
          <h2
            id="order-summary-title"
            className="font-display flex items-center gap-2 text-2xl font-bold"
          >
            <ShoppingBag className="h-5 w-5 text-amber" /> {o.summary}
          </h2>
          {summary.lines.length === 0 ? (
            <p className="mt-5 text-sm text-on-dark-muted">{o.summaryEmpty}</p>
          ) : (
            <ul className="mt-5 divide-y divide-line-dark">
              {summary.lines.map((line) => (
                <li key={line.item.id} className="flex items-start justify-between gap-4 py-3">
                  <span className="min-w-0">
                    <span className="block font-semibold" dir="auto">
                      {itemName(line.item, lang)}
                    </span>
                    <span className="text-sm text-on-dark-muted">× {line.quantity}</span>
                  </span>
                  <span className="shrink-0 text-sm" dir="ltr">
                    {line.lineTotal === null ? o.pricePending : money(line.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-line-dark pt-4">
            <div className="flex items-start justify-between gap-4">
              <span className="font-semibold">{o.total}</span>
              <span className="text-end font-display text-lg font-bold" dir="ltr">
                {summary.total === null ? "—" : money(summary.total)}
              </span>
            </div>
            <p className="mt-2 text-xs text-on-dark-muted">
              {summary.unpricedCount > 0
                ? o.priceHelp
                : !business.orderEmail
                  ? o.emailHelp
                  : o.sendNote}
            </p>
            {itemCount > 0 && (
              <p className="mt-2 text-xs text-on-dark-muted" dir="auto">
                {itemCount} {o.selectedCount}
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={!mailto}
            onClick={() => mailto && window.location.assign(mailto)}
            className="btn-amber mt-5 w-full disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" /> {o.send}
          </button>
        </aside>
      </div>
    </div>
  );
}
