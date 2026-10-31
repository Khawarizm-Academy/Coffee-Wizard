import { createFileRoute } from "@tanstack/react-router";
import { Mail, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/cw/Motion";
import { Photo } from "@/components/cw/Product";
import { categories, itemImage, menu, type CategoryId, type MenuItem } from "@/content/menu";
import { useLang } from "@/lib/i18n";
import { buildMockPurchasePreview, summarizeOrder } from "@/lib/order";

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
          "Choose drinks from the Coffee Wizard menu, adjust quantities, and preview a local demo email. Nothing is submitted or sent.",
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
  const [showPreview, setShowPreview] = useState(false);

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
  const preview = useMemo(
    () => buildMockPurchasePreview(summary.lines, summary.total),
    [summary.lines, summary.total],
  );
  const itemCount = summary.lines.reduce((sum, line) => sum + line.quantity, 0);
  const money = (amount: number) =>
    new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(amount);

  function adjust(itemId: string, amount: number) {
    setShowPreview(false);
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
            <Search
              className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={o.search}
              className="w-full rounded-full border border-input bg-card py-3 ps-11 pe-4 text-sm focus:border-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            />
          </label>

          <div
            className="mt-4 flex gap-2 overflow-x-auto pb-2"
            role="group"
            aria-label={o.allDrinks}
          >
            <button
              type="button"
              aria-pressed={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              className="cw-chip shrink-0 px-4 py-2 text-sm font-semibold"
            >
              {o.allDrinks}
            </button>
            {drinkCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
                className="cw-chip shrink-0 px-4 py-2 text-sm font-semibold"
              >
                {lang === "ar" ? category.nameAr : category.nameEn}
              </button>
            ))}
          </div>

          {filteredDrinks.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">{o.empty}</p>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {filteredDrinks.map((item, index) => {
                const quantity = quantities[item.id] ?? 0;
                const verifiedPrice =
                  item.priceStatus === "verified" && typeof item.price === "number";
                const img = itemImage(item);
                const categoryName =
                  lang === "ar"
                    ? categories.find((category) => category.id === item.category)?.nameAr
                    : categories.find((category) => category.id === item.category)?.nameEn;
                return (
                  <Reveal key={item.id} delay={(index % 4) * 45}>
                    <article className="cw-card flex min-h-36 overflow-hidden">
                      <div className="relative w-28 shrink-0 bg-charcoal sm:w-32">
                        <Photo img={img} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="eyebrow !text-[0.6rem]">{categoryName}</p>
                            <h2
                              className="font-display mt-1 text-base font-semibold leading-snug sm:text-lg"
                              dir="auto"
                            >
                              {itemName(item, lang)}
                            </h2>
                            {lang === "ar" && item.nameAr && (
                              <p className="text-xs text-muted-foreground" dir="ltr">
                                {item.nameEn}
                              </p>
                            )}
                          </div>
                          <span
                            className="shrink-0 text-end text-xs font-semibold sm:text-sm"
                            dir="ltr"
                          >
                            {verifiedPrice ? (
                              money(item.price!)
                            ) : (
                              <span
                                className="font-normal text-muted-foreground"
                                dir={lang === "ar" ? "rtl" : "ltr"}
                              >
                                {o.pricePending}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">{o.quantity}</span>
                          <div className="inline-flex items-center gap-2 rounded-full border border-border px-2 py-1">
                            <button
                              type="button"
                              onClick={() => adjust(item.id, -1)}
                              disabled={quantity === 0}
                              aria-label={`${o.removeOne}: ${itemName(item, lang)}`}
                              className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
                            >
                              <Minus className="h-4 w-4" aria-hidden="true" />
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
                              <Plus className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </section>

        <aside
          className="cw-card-dark h-fit p-5 lg:sticky lg:top-28 md:p-6"
          aria-labelledby="order-summary-title"
        >
          <h2
            id="order-summary-title"
            className="font-display flex items-center gap-2 text-2xl font-bold"
          >
            <ShoppingBag className="h-5 w-5 text-amber" aria-hidden="true" /> {o.summary}
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
              <span className="text-end font-display text-sm font-bold sm:text-base" dir="auto">
                {summary.total === null ? (
                  o.totalPending
                ) : (
                  <span dir="ltr">{money(summary.total)}</span>
                )}
              </span>
            </div>
            {summary.unpricedCount > 0 && (
              <p className="mt-2 text-xs text-on-dark-muted">{o.priceHelp}</p>
            )}
            <p className="mt-2 text-xs text-on-dark-muted">{o.sendNote}</p>
            {itemCount > 0 && (
              <p className="mt-2 text-xs text-on-dark-muted" dir="auto">
                {itemCount} {o.selectedCount}
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={!preview}
            aria-expanded={showPreview}
            aria-controls={preview ? "mock-order-preview" : undefined}
            onClick={() => setShowPreview((visible) => !visible)}
            className="btn-amber mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mail className="h-4 w-4" aria-hidden="true" /> {o.send}
          </button>

          {preview && (
            <div
              id="mock-order-preview"
              className="cw-card mt-4 p-4 text-foreground"
              hidden={!showPreview}
              role="region"
              aria-label={o.mockTitle}
              aria-live="polite"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold">{o.mockTitle}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{o.mockNotice}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  aria-label={o.closePreview}
                  className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p
                className="mt-4 rounded-lg bg-cream-deep px-3 py-2 text-sm font-semibold"
                dir="auto"
              >
                {o.mockSubject}
              </p>
              <p className="eyebrow mt-4 !text-[0.65rem]">{o.mockIntro}</p>
              <ul className="mt-2 space-y-2 text-sm">
                {preview.lines.map((line) => (
                  <li key={line.item.id} className="flex justify-between gap-3">
                    <span dir="auto">
                      {itemName(line.item, lang)} × {line.quantity}
                    </span>
                    <span className="shrink-0 text-end" dir="ltr">
                      {line.lineTotal === null ? o.pricePending : money(line.lineTotal)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between gap-3 border-t border-border pt-3 text-sm font-bold">
                <span>{o.total}</span>
                <span className="text-end" dir="auto">
                  {preview.total === null ? (
                    o.totalPending
                  ) : (
                    <span dir="ltr">{money(preview.total)}</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
