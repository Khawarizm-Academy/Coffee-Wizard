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
  const { lang, t } = useLang();
  return (
    <span className="relative block h-full w-full overflow-hidden">
      <img
        src={img.src}
        alt={img.alt[lang]}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
      {img.kind === "illustrative" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute start-2 bottom-2 z-10 rounded-full bg-charcoal/85 px-2 py-1 text-[0.6rem] font-semibold text-on-dark shadow-card"
        >
          {t.imageConcept}
        </span>
      )}
    </span>
  );
}

export function ProductCard({
  item,
  onOpen,
  linkToMenu,
}: {
  item: MenuItem;
  onOpen?: () => void;
  linkToMenu?: boolean;
}) {
  const { lang, t } = useLang();
  const cat = categoryById(item.category);
  const desc = lang === "ar" ? item.descriptionAr : item.descriptionEn;
  const img = itemImage(item);
  const name = lang === "ar" && item.nameAr ? item.nameAr : item.nameEn;
  const body = (
    <>
      <div className="aspect-[4/3] overflow-hidden bg-charcoal">
        <Photo img={img} className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4 text-start">
        <span className="eyebrow !text-[0.65rem]">{lang === "ar" ? cat.nameAr : cat.nameEn}</span>
        <h3 className="font-display text-base font-semibold leading-snug md:text-lg" dir="auto">
          {name}
        </h3>
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
        {linkToMenu && (
          <span className="mt-auto pt-2 text-sm font-bold text-coffee">{t.featured.view} →</span>
        )}
      </div>
    </>
  );
  const cls =
    "cw-card group flex h-full flex-col overflow-hidden transition-transform hover:-translate-y-1";
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
  const name = lang === "ar" && item.nameAr ? item.nameAr : item.nameEn;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/70 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        className="cw-card w-full max-w-lg overflow-hidden rounded-t-xl sm:rounded-xl"
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
        </div>
        <div className="space-y-3 p-6">
          <span className="eyebrow">{lang === "ar" ? cat.nameAr : cat.nameEn}</span>
          <h2 id="product-title" className="font-display text-2xl font-bold" dir="auto">
            {name}
          </h2>
          {lang === "ar" && item.nameAr && (
            <p className="text-sm text-muted-foreground" dir="ltr">
              {item.nameEn}
            </p>
          )}
          {(lang === "ar" ? item.descriptionAr : item.descriptionEn) && (
            <p>{lang === "ar" ? item.descriptionAr : item.descriptionEn}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {item.priceStatus === "verified" && item.price
              ? `${item.price} ${item.currency}`
              : t.menu.priceNote}
          </p>
          <a href={business.talabat} target="_blank" rel="noreferrer" className="btn-amber w-full">
            {t.menu.order} <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
