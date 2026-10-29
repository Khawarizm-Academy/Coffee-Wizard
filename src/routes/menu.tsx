import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { categories, menu, searchMenu, type CategoryId } from "@/content/menu";
import { ProductCard, ProductDialog } from "@/components/cw/Product";

type MenuSearch = { cat?: CategoryId; item?: string };
const catIds = categories.map((c) => c.id) as string[];

export const Route = createFileRoute("/menu")({
  validateSearch: (s: Record<string, unknown>): MenuSearch => ({
    cat: typeof s.cat === "string" && catIds.includes(s.cat) ? (s.cat as CategoryId) : undefined,
    item: typeof s.item === "string" ? s.item : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Menu — Coffee Wizard Mansoura (Concept)" },
      { name: "description", content: "Browse Coffee Wizard's coffee, pour over, iced drinks, matcha, blends, chimney bakery and sandwiches." },
      { property: "og:title", content: "Coffee Wizard Menu" },
      { property: "og:description", content: "Coffee, matcha, blends, chimney cakes and sandwiches at Coffee Wizard, Mansoura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { t, lang } = useLang();
  const { cat, item } = Route.useSearch();
  const navigate = useNavigate({ from: "/menu" });
  const [q, setQ] = useState("");
  const active = cat ?? "all";
  const results = useMemo(() => searchMenu(menu, q, active), [q, active]);
  const open = item ? menu.find((m) => m.id === item) : undefined;

  useEffect(() => {
    if (item) document.getElementById(`item-${item}`)?.scrollIntoView({ block: "center" });
  }, [item]);

  const setCat = (c: CategoryId | "all") =>
    navigate({ search: c === "all" ? {} : { cat: c }, replace: true, resetScroll: false });

  return (
    <div className="container-cw py-14 md:py-20">
      <h1 className="font-display text-4xl font-bold md:text-6xl">{t.menu.title}</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">{t.menu.subtitle}</p>

      <div className="sticky top-[5.75rem] z-30 -mx-5 mt-8 bg-background/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
        <label className="relative block max-w-md">
          <span className="sr-only">{t.menu.search}</span>
          <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.menu.search}
            className="w-full rounded-full border border-input bg-card py-3 ps-11 pe-4 text-sm focus:border-ring focus:outline-none"
          />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categories">
          {[{ id: "all" as const, nameEn: t.menu.all, nameAr: t.menu.all }, ...categories].map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={active === c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active === c.id ? "border-charcoal bg-charcoal text-cream" : "border-border hover:border-charcoal"
              }`}
            >
              {lang === "ar" ? c.nameAr : c.nameEn}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">{t.menu.empty}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {results.map((m) => (
            <div key={m.id} id={`item-${m.id}`} className="relative">
              <ProductCard
                item={m}
                onOpen={() => navigate({ search: (s) => ({ ...s, item: m.id }), resetScroll: false })}
              />
              {m.temp && (
                <span className="absolute end-3 top-3 rounded-full bg-charcoal/80 px-2.5 py-1 text-xs font-bold text-on-dark">
                  {m.temp === "hot" ? t.menu.hot : t.menu.iced}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {open && (
        <ProductDialog
          item={open}
          onClose={() => navigate({ search: (s) => ({ ...s, item: undefined }), resetScroll: false })}
        />
      )}
    </div>
  );
}
