import { Link } from "@tanstack/react-router";
import { X, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { business } from "@/content/business";
import { categoryById, itemImage, type MenuItem } from "@/content/menu";

export function Photo({
  img,
  className = "",
  eager = false,
}: {
  img: { src: string; kind: string; alt: { en: string; ar: string } };
  className?: string;
  eager?: boolean;
}) {
  const { lang } = useLang();
  return (
    <img
      src={img.src}
      alt={img.alt[lang]}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

export function ProductCard({ item, onOpen, linkToMenu }: { item: MenuItem; onOpen?: () => void; linkToMenu?: boolean }) {
  const { lang, t } = useLang();
  const cat = categoryById(item.category);
  const desc = lang === "ar" ? item.descriptionAr : item.descriptionEn;
  const body = (
    <>
      <div className="aspect-[4/3] overflow-hidden bg-charcoal">
        <Photo img={itemImage(item)} className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4 text-start">
        <span className="eyebrow !text-[0.65rem]">{lang === "ar" ? cat.nameAr : cat.nameEn}</span>
        <h3 className="font-display text-base font-semibold leading-snug md:text-lg" dir="auto">
          {item.nameEn}
        </h3>
        {lang === "ar" && item.nameAr && <p className="text-sm text-muted-foreground">{item.nameAr}</p>}
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
        {linkToMenu && <span className="mt-auto pt-2 text-sm font-bold text-coffee">{t.featured.view} →</span>}
      </div>
    </>
  );
  const cls =
    "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-transform hover:-translate-y-1";
  if (linkToMenu)
    return (
      <Link to="/menu" search={{ cat: item.category, item: item.id }} className={cls}>
        {body}
      </Link>
    );
  return (
    <button type="button" onClick={onOpen} className={cls}>
      {body}
    </button>
  );
}

export function ProductDialog({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { lang, t } = useLang();
  const cat = categoryById(item.category);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const img = itemImage(item);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/70 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        className="w-full max-w-lg overflow-hidden rounded-t-xl bg-card sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] bg-charcoal">
          <Photo img={img} eager />
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label={t.menu.close}
            className="absolute end-3 top-3 rounded-full bg-charcoal/80 p-2 text-on-dark hover:bg-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
          {img.kind === "illustrative" && (
            <span className="absolute bottom-2 start-2 rounded bg-charcoal/80 px-2 py-1 text-[0.65rem] text-on-dark">
              {t.bakery.illustrative}
            </span>
          )}
        </div>
        <div className="space-y-3 p-6">
          <span className="eyebrow">{lang === "ar" ? cat.nameAr : cat.nameEn}</span>
          <h2 id="product-title" className="font-display text-2xl font-bold" dir="auto">
            {item.nameEn}
          </h2>
          {item.nameAr && <p className="text-muted-foreground">{item.nameAr}</p>}
          {(lang === "ar" ? item.descriptionAr : item.descriptionEn) && (
            <p>{lang === "ar" ? item.descriptionAr : item.descriptionEn}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {item.priceStatus === "verified" && item.price ? `${item.price} ${item.currency}` : t.menu.priceNote}
          </p>
          <a href={business.talabat} target="_blank" rel="noreferrer" className="btn-amber w-full">
            {t.menu.order} <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
