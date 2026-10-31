import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  Bean,
  Candy,
  Cherry,
  Cloud,
  Coffee,
  Cookie,
  Croissant,
  Flame,
  GlassWater,
  Leaf,
  Milk,
  Nut,
  RotateCcw,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { images } from "@/content/images";
import { categoryById, itemImage, menu, type MenuItem } from "@/content/menu";
import { useLang } from "@/lib/i18n";
import { FLAVORS, MAX_NOTE, type Flavor, type OracleResult, type TempPref } from "@/lib/oracle";
import { askWizard } from "@/lib/oracle.functions";
import { Photo } from "./Product";
import { Reveal, Sparkle, SpinBadge, Steam } from "./Motion";

const FLAVOR_ICONS: Record<Flavor, LucideIcon> = {
  sweet: Candy,
  nutty: Nut,
  chocolatey: Cookie,
  fruity: Cherry,
  strong: Flame,
  creamy: Milk,
  light: Cloud,
  earthy: Leaf,
};

const TEMP_ICONS: Record<TempPref, LucideIcon> = {
  hot: Coffee,
  iced: GlassWater,
  any: Sparkles,
};

type ErrCode = "credits" | "busy" | "config" | "refused" | "empty" | "failed";

function Cauldron({ line }: { line: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-14 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-28 w-28 items-center justify-center">
        {[0, 0.4, 0.8, 1.2].map((delay, index) => (
          <span
            key={delay}
            className="absolute bottom-16 h-3 w-3 animate-bubble rounded-full bg-amber"
            style={{ left: `${28 + index * 14}%`, animationDelay: `${delay}s` }}
          />
        ))}
        <span className="cw-icon-tile h-20 w-20 bg-amber/10 text-amber shadow-glow">
          <Coffee className="h-12 w-12" strokeWidth={1.7} aria-hidden="true" />
        </span>
      </div>
      <p key={line} className="font-display animate-pop text-xl font-semibold text-foreground">
        {line}
      </p>
    </div>
  );
}

export function WizardOracle() {
  const { t, lang } = useLang();
  const o = t.oracle;
  const ask = useServerFn(askWizard);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [temp, setTemp] = useState<TempPref>("any");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<OracleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (status !== "loading") return;
    const id = setInterval(() => setLineIdx((index) => (index + 1) % o.loading.length), 1500);
    return () => clearInterval(id);
  }, [status, o.loading.length]);

  const toggle = (flavor: Flavor) =>
    setFlavors((current) =>
      current.includes(flavor)
        ? current.filter((selected) => selected !== flavor)
        : [...current, flavor],
    );

  async function cast() {
    if (flavors.length === 0 && !note.trim()) return setError(o.needInput);
    setError(null);
    setStatus("loading");
    setLineIdx(0);
    try {
      const response = await ask({ data: { flavors, temp, note, lang } });
      if (response.ok) {
        setResult(response.result);
        setStatus("done");
      } else {
        setError(o.errors[response.code as ErrCode] ?? o.errors.failed);
        setStatus("idle");
      }
    } catch {
      setError(o.errors.failed);
      setStatus("idle");
    }
  }

  const byId = (id: string) => menu.find((item) => item.id === id);
  const itemName = (item: MenuItem) => (lang === "ar" && item.nameAr ? item.nameAr : item.nameEn);
  const pairing = result?.pairing ? byId(result.pairing.id) : undefined;

  return (
    <section id="oracle" className="bg-cream-deep py-20 md:py-28">
      <div className="container-cw">
        <Reveal className="cw-card-dark relative overflow-hidden p-5 md:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -end-20 -top-24 h-72 w-72 rounded-full bg-lavender/15 blur-3xl"
          />
          <div className="relative z-10 grid items-center gap-7 md:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <p className="eyebrow inline-flex items-center gap-2 !text-amber">
                <Wand2
                  className="h-4 w-4 animate-wiggle [animation-iteration-count:infinite] [animation-duration:2.4s]"
                  aria-hidden="true"
                />
                {o.eyebrow}
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold leading-tight md:text-5xl">
                {o.title}
              </h2>
              <p className="mt-5 text-on-dark-muted">{o.body}</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line-dark bg-charcoal">
              <Photo img={images.flavorBoard} />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-transparent to-charcoal/10" />
              <SpinBadge
                text={o.badge}
                className="absolute end-3 top-3 h-20 w-20 rounded-full bg-charcoal/70 p-1 text-amber shadow-card sm:h-24 sm:w-24"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="cw-card mt-8 p-5 md:p-8">
          {status === "loading" ? (
            <Cauldron line={o.loading[lineIdx] ?? ""} />
          ) : status === "done" && result ? (
            <div aria-live="polite">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">{o.results}</p>
                  {result.intro && (
                    <p className="font-display mt-2 max-w-2xl text-xl md:text-2xl" dir="auto">
                      {result.intro}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="btn-outline-dark !py-2 text-sm"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> {o.again}
                </button>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {result.picks.map((pick, index) => {
                  const item = byId(pick.id);
                  if (!item) return null;
                  const img = itemImage(item);
                  return (
                    <Link
                      key={pick.id}
                      to="/menu"
                      search={{ cat: item.category, item: item.id }}
                      className="cw-card group lift animate-pop flex flex-col overflow-hidden text-start hover:shadow-glow"
                      style={{ animationDelay: `${index * 140}ms` }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
                        <Photo
                          img={img}
                          className="transition-transform duration-700 group-hover:scale-110"
                        />
                        <span className="font-display absolute start-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-amber text-lg font-bold text-charcoal">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <span className="eyebrow !text-[0.65rem]">
                          {lang === "ar"
                            ? categoryById(item.category).nameAr
                            : categoryById(item.category).nameEn}
                        </span>
                        <h3 className="font-display text-xl font-semibold" dir="auto">
                          {itemName(item)}
                        </h3>
                        <p className="text-sm text-muted-foreground" dir="auto">
                          {pick.reason}
                        </p>
                        {pick.fun && (
                          <p
                            className="mt-1 flex items-start gap-2 text-sm italic text-coffee"
                            dir="auto"
                          >
                            <Sparkle className="mt-0.5 h-4 w-4 shrink-0" /> {pick.fun}
                          </p>
                        )}
                        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-bold text-coffee">
                          {o.view}{" "}
                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {result.pairing && pairing && (
                <Link
                  to="/menu"
                  search={{ cat: pairing.category, item: pairing.id }}
                  className="cw-card group animate-pop mt-4 flex items-center gap-4 border-dashed p-4 hover:border-amber"
                  style={{ animationDelay: "480ms" }}
                >
                  <span className="cw-icon-tile h-12 w-12 shrink-0 transition-transform group-hover:rotate-6">
                    <Croissant className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="eyebrow !text-[0.65rem]">{o.pairing}</span>
                    <span className="font-display block text-lg font-semibold" dir="auto">
                      {itemName(pairing)}
                    </span>
                    <span className="block text-sm text-muted-foreground" dir="auto">
                      {result.pairing.reason}
                    </span>
                  </span>
                </Link>
              )}
              <p className="mt-6 text-xs text-muted-foreground">{o.disclaimer}</p>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void cast();
              }}
            >
              <fieldset>
                <legend className="font-display text-lg font-semibold">{o.flavorsLabel}</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {FLAVORS.map((flavor) => {
                    const selected = flavors.includes(flavor);
                    const FlavorIcon = FLAVOR_ICONS[flavor];
                    return (
                      <button
                        key={flavor}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggle(flavor)}
                        className="cw-chip group px-3 py-2 text-sm font-semibold active:scale-95 sm:px-4"
                      >
                        <span
                          className={`cw-icon-tile h-8 w-8 ${selected ? "animate-wiggle" : "group-hover:animate-wiggle"}`}
                        >
                          <FlavorIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        {o.flavors[flavor]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="font-display text-lg font-semibold">{o.tempLabel}</legend>
                <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={o.tempLabel}>
                  {(["hot", "iced", "any"] as const).map((value) => {
                    const TempIcon = TEMP_ICONS[value];
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={temp === value}
                        onClick={() => setTemp(value)}
                        className="cw-chip px-4 py-2 text-sm font-semibold"
                      >
                        <TempIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                        {o.temps[value]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="mt-8 block">
                <span className="font-display text-lg font-semibold">{o.noteLabel}</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value.slice(0, MAX_NOTE))}
                  rows={3}
                  placeholder={o.notePlaceholder}
                  className="mt-3 w-full resize-none rounded-lg border border-input bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                />
                <span className="mt-1 block text-end text-xs text-muted-foreground" dir="ltr">
                  {note.length}/{MAX_NOTE}
                </span>
              </label>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn-amber group">
                  <Wand2
                    className="h-4 w-4 transition-transform group-hover:-rotate-12"
                    aria-hidden="true"
                  />{" "}
                  {o.cta}
                </button>
                <Steam className="text-muted-foreground" />
                {error && (
                  <p className="text-sm font-semibold text-heart" role="alert">
                    {error}
                  </p>
                )}
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
