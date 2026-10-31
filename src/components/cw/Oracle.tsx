import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, RotateCcw, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { menu, itemImage, categoryById } from "@/content/menu";
import { FLAVORS, MAX_NOTE, type Flavor, type OracleResult, type TempPref } from "@/lib/oracle";
import { askWizard } from "@/lib/oracle.functions";
import { Photo } from "./Product";
import { Reveal, Sparkle, SparkleField, SpinBadge, Steam } from "./Motion";

const EMOJI: Record<Flavor, string> = {
  sweet: "🍯",
  nutty: "🥜",
  chocolatey: "🍫",
  fruity: "🍓",
  strong: "⚡",
  creamy: "🥛",
  light: "☁️",
  earthy: "🍵",
};
type ErrCode = "credits" | "busy" | "config" | "refused" | "empty" | "failed";

function Cauldron({ line }: { line: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-14 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-28 w-28">
        {[0, 0.4, 0.8, 1.2].map((d, i) => (
          <span
            key={d}
            className="absolute bottom-16 h-3 w-3 animate-bubble rounded-full bg-amber"
            style={{ left: `${28 + i * 14}%`, animationDelay: `${d}s` }}
          />
        ))}
        <svg
          viewBox="0 0 64 64"
          className="absolute bottom-0 h-20 w-28 text-amber"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6 22h52l-4 26a10 10 0 0 1-10 8H20a10 10 0 0 1-10-8z" opacity=".9" />
          <path d="M58 26h2a6 6 0 0 1 0 12h-3" fill="none" stroke="currentColor" strokeWidth="3" />
          <ellipse cx="32" cy="22" rx="26" ry="5" className="text-coffee" fill="currentColor" />
        </svg>
      </div>
      <p key={line} className="font-display animate-pop text-xl font-semibold text-on-dark">
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
    const id = setInterval(() => setLineIdx((i) => (i + 1) % o.loading.length), 1500);
    return () => clearInterval(id);
  }, [status, o.loading.length]);

  const toggle = (f: Flavor) =>
    setFlavors((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  async function cast() {
    if (flavors.length === 0 && !note.trim()) return setError(o.needInput);
    setError(null);
    setStatus("loading");
    setLineIdx(0);
    try {
      const res = await ask({ data: { flavors, temp, note, lang } });
      if (res.ok) {
        setResult(res.result);
        setStatus("done");
      } else {
        setError(o.errors[res.code as ErrCode] ?? o.errors.failed);
        setStatus("idle");
      }
    } catch {
      setError(o.errors.failed);
      setStatus("idle");
    }
  }

  const byId = (id: string) => menu.find((m) => m.id === id);

  return (
    <section
      id="oracle"
      className="bg-tiles relative isolate overflow-hidden py-20 text-on-dark md:py-28"
    >
      <SparkleField />
      <div
        aria-hidden="true"
        className="absolute -end-24 -top-24 -z-10 h-80 w-80 rounded-full bg-lavender/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -start-24 -z-10 h-80 w-80 rounded-full bg-amber/15 blur-3xl"
      />
      <div className="container-cw">
        <Reveal className="relative overflow-hidden rounded-xl border border-line-dark bg-charcoal-soft/70 p-6 shadow-card backdrop-blur md:p-8">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow inline-flex items-center gap-2 !text-amber">
                <Wand2 className="h-4 w-4 animate-wiggle [animation-iteration-count:infinite] [animation-duration:2.4s]" />{" "}
                {o.eyebrow}
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold leading-tight md:text-5xl">
                {o.title}
              </h2>
              <p className="mt-5 text-on-dark-muted">{o.body}</p>
            </div>
            <SpinBadge
              text={o.badge}
              className="h-20 w-20 shrink-0 self-center text-amber sm:h-28 sm:w-28"
            />
          </div>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-10 rounded-xl border border-line-dark bg-charcoal-soft/80 p-5 shadow-card backdrop-blur md:p-8"
        >
          {status === "loading" ? (
            <Cauldron line={o.loading[lineIdx] ?? ""} />
          ) : status === "done" && result ? (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow !text-amber">{o.results}</p>
                  {result.intro && (
                    <p className="font-display mt-2 max-w-2xl text-xl md:text-2xl" dir="auto">
                      {result.intro}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="btn-ghost-light !py-2 text-sm"
                >
                  <RotateCcw className="h-4 w-4" /> {o.again}
                </button>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {result.picks.map((p, i) => {
                  const m = byId(p.id);
                  if (!m) return null;
                  return (
                    <Link
                      key={p.id}
                      to="/menu"
                      search={{ cat: m.category, item: m.id }}
                      className="group lift animate-pop flex flex-col overflow-hidden rounded-lg border border-line-dark bg-charcoal text-start hover:shadow-glow"
                      style={{ animationDelay: `${i * 140}ms` }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Photo
                          img={itemImage(m)}
                          className="transition-transform duration-700 group-hover:scale-110"
                        />
                        <span className="font-display absolute start-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-amber text-lg font-bold text-charcoal">
                          {i + 1}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <span className="eyebrow !text-[0.65rem] !text-amber">
                          {lang === "ar"
                            ? categoryById(m.category).nameAr
                            : categoryById(m.category).nameEn}
                        </span>
                        <h3 className="font-display text-xl font-semibold" dir="ltr">
                          {m.nameEn}
                        </h3>
                        <p className="text-sm text-on-dark-muted" dir="auto">
                          {p.reason}
                        </p>
                        {p.fun && (
                          <p
                            className="mt-1 flex items-start gap-2 text-sm italic text-lavender"
                            dir="auto"
                          >
                            <Sparkle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {p.fun}
                          </p>
                        )}
                        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-bold text-amber">
                          {o.view}{" "}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {result.pairing && byId(result.pairing.id) && (
                <Link
                  to="/menu"
                  search={{ cat: byId(result.pairing.id)!.category, item: result.pairing.id }}
                  className="group animate-pop mt-4 flex items-center gap-4 rounded-lg border border-dashed border-amber/50 p-4 hover:bg-charcoal"
                  style={{ animationDelay: "480ms" }}
                >
                  <span
                    className="text-2xl transition-transform group-hover:rotate-12"
                    aria-hidden="true"
                  >
                    🥐
                  </span>
                  <span>
                    <span className="eyebrow !text-[0.65rem] !text-amber">{o.pairing}</span>
                    <span className="font-display block text-lg font-semibold" dir="ltr">
                      {byId(result.pairing.id)!.nameEn}
                    </span>
                    <span className="block text-sm text-on-dark-muted" dir="auto">
                      {result.pairing.reason}
                    </span>
                  </span>
                </Link>
              )}
              <p className="mt-6 text-xs text-on-dark-muted">{o.disclaimer}</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void cast();
              }}
            >
              <fieldset>
                <legend className="font-display text-lg font-semibold">{o.flavorsLabel}</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {FLAVORS.map((f) => {
                    const on = flavors.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(f)}
                        className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                          on
                            ? "scale-105 border-amber bg-amber text-charcoal shadow-glow"
                            : "border-line-dark hover:-translate-y-0.5 hover:border-amber"
                        }`}
                      >
                        <span
                          className={`text-base ${on ? "animate-wiggle" : "group-hover:animate-wiggle"}`}
                          aria-hidden="true"
                        >
                          {EMOJI[f]}
                        </span>
                        {o.flavors[f]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="font-display text-lg font-semibold">{o.tempLabel}</legend>
                <div
                  className="mt-4 inline-flex rounded-full border border-line-dark p-1"
                  role="radiogroup"
                >
                  {(["hot", "iced", "any"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={temp === v}
                      onClick={() => setTemp(v)}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${temp === v ? "bg-cream text-charcoal" : "text-on-dark-muted hover:text-on-dark"}`}
                    >
                      {v === "hot" ? "☕ " : v === "iced" ? "🧊 " : "🎲 "}
                      {o.temps[v]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="mt-8 block">
                <span className="font-display text-lg font-semibold">{o.noteLabel}</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE))}
                  rows={3}
                  placeholder={o.notePlaceholder}
                  className="mt-3 w-full resize-none rounded-lg border border-line-dark bg-charcoal p-4 text-on-dark placeholder:text-on-dark-muted/70 focus:border-amber focus:outline-none"
                />
                <span className="mt-1 block text-end text-xs text-on-dark-muted" dir="ltr">
                  {note.length}/{MAX_NOTE}
                </span>
              </label>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn-amber group">
                  <Wand2 className="h-4 w-4 transition-transform group-hover:-rotate-12" /> {o.cta}
                </button>
                <Steam className="text-on-dark-muted" />
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
