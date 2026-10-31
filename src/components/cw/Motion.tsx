import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";

/** Fades + lifts children in the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      data-shown={shown}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Four-point wizard sparkle. */
export function Sparkle({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`animate-twinkle ${className}`} style={style} fill="currentColor">
      <path d="M12 0c.6 5.4 2.6 8.6 6 10.2 1.6.8 3.6 1.4 6 1.8-5.4.6-8.6 2.6-10.2 6-.8 1.6-1.4 3.6-1.8 6-.6-5.4-2.6-8.6-6-10.2C4.4 13 2.4 12.4 0 12c5.4-.6 8.6-2.6 10.2-6 .8-1.6 1.4-3.6 1.8-6z" />
    </svg>
  );
}

export function SparkleField({ count = 7 }: { count?: number }) {
  const spots = [
    [8, 18, 14], [22, 70, 10], [46, 12, 18], [62, 82, 12], [78, 30, 16], [88, 64, 10], [36, 48, 8], [70, 8, 9],
  ].slice(0, count);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {spots.map(([x, y, s], i) => (
        <Sparkle
          key={i}
          className="absolute text-amber"
          style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${i * 0.45}s` }}
        />
      ))}
    </div>
  );
}

/** Rising steam wisps, for cups and headings. */
export function Steam({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none inline-flex gap-1.5 ${className}`}>
      {[0, 0.6, 1.2].map((d) => (
        <span
          key={d}
          className="block h-6 w-1 animate-steam rounded-full bg-current opacity-0"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </span>
  );
}

/** Slowly spinning circular badge text. */
export function SpinBadge({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`relative h-28 w-28 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow">
        <defs>
          <path id="cw-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-current text-[10.5px] font-bold uppercase tracking-[0.2em]">
          <textPath href="#cw-circle">{text}</textPath>
        </text>
      </svg>
      <Sparkle className="absolute inset-0 m-auto h-7 w-7 text-amber" />
    </div>
  );
}

export function Marquee() {
  const { t } = useLang();
  const items = [...t.marquee, ...t.marquee];
  return (
    <div className="overflow-hidden border-y border-line-dark bg-charcoal py-4 text-on-dark" aria-label={t.marquee.join(" · ")}>
      <div dir="ltr" className="mask-fade-x">
        <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]" aria-hidden="true">
          {items.map((m, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-xl font-semibold whitespace-nowrap md:text-2xl">
              {m}
              <Sparkle className="h-4 w-4 text-amber" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
