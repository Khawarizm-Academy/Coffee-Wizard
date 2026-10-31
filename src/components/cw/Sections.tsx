import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Coffee,
  Sparkles,
  FlaskConical,
  Croissant,
  MapPin,
  Phone,
  Clock,
  Instagram,
  ExternalLink,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { images } from "@/content/images";
import { categories, featured, menu } from "@/content/menu";
import { business } from "@/content/business";
import { Photo, ProductCard } from "./Product";
import { Reveal, SpinBadge } from "./Motion";

function Arrow() {
  return <ArrowRight className="h-4 w-4 rtl:rotate-180" />;
}

function Heading({ eyebrow, title, light }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <Reveal>
      <div className="max-w-2xl">
        <p className={`eyebrow ${light ? "!text-amber" : ""}`}>{eyebrow}</p>
        <h2
          className={`font-display mt-3 text-3xl font-bold leading-tight md:text-5xl ${light ? "text-on-dark" : ""}`}
        >
          {title}
        </h2>
      </div>
    </Reveal>
  );
}

export function HeroSection() {
  const { t } = useLang();
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-on-dark">
      <div className="absolute inset-0 -z-10">
        <Photo img={images.syphonBar} eager />
        <div className="hero-overlay absolute inset-0" />
      </div>
      <div className="container-cw relative flex min-h-[78vh] flex-col justify-center py-20 md:min-h-[86vh]">
        <Reveal className="relative z-10 max-w-2xl">
          <p className="eyebrow !text-amber">{t.hero.eyebrow}</p>
          <h1 className="font-display mt-5 max-w-2xl text-5xl font-bold leading-[1.05] md:text-7xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-lg text-lg text-on-dark-muted">{t.hero.body}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/menu" className="btn-amber">
              {t.hero.primary} <Arrow />
            </Link>
            <Link to="/" hash="oracle" className="btn-ghost-light">
              <Sparkles className="h-4 w-4" /> {t.hero.wizard}
            </Link>
          </div>
        </Reveal>
        <div className="absolute end-8 top-1/2 z-0 hidden -translate-y-1/2 xl:block">
          <SpinBadge text={t.hero.badge} className="h-32 w-32 text-amber opacity-90" />
        </div>
      </div>
    </section>
  );
}

export function BrandStory() {
  const { t } = useLang();
  return (
    <section
      id="story"
      className="container-cw grid items-center gap-10 py-20 md:grid-cols-2 md:py-28"
    >
      <Reveal className="grid grid-cols-2 gap-3">
        <div className="aspect-[3/4] overflow-hidden rounded-lg">
          <Photo img={images.barista} />
        </div>
        <div className="mt-10 aspect-[3/4] overflow-hidden rounded-lg">
          <Photo img={images.hatWall} />
        </div>
      </Reveal>
      <div>
        <Heading eyebrow={t.story.eyebrow} title={t.story.title} />
        <p className="mt-6 text-lg">{t.story.body1}</p>
        <p className="mt-4 text-muted-foreground">{t.story.body2}</p>
        <Link to="/menu" className="btn-outline-dark mt-8">
          {t.story.cta} <Arrow />
        </Link>
      </div>
    </section>
  );
}

export function CategoryGrid() {
  const { t, lang } = useLang();
  return (
    <section className="bg-cream-deep py-20 md:py-28">
      <div className="container-cw">
        <Heading eyebrow={t.categories.eyebrow} title={t.categories.title} />
        <Reveal delay={100} className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/menu"
              search={{ cat: c.id }}
              className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-charcoal"
            >
              <Photo
                img={c.image}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="card-overlay absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-on-dark">
                <h3 className="font-display text-lg font-semibold md:text-xl">
                  {lang === "ar" ? c.nameAr : c.nameEn}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber">
                  {t.categories.view} <Arrow />
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  const { t } = useLang();
  return (
    <section className="container-cw py-20 md:py-28">
      <Heading eyebrow={t.featured.eyebrow} title={t.featured.title} />
      <Reveal delay={100} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((m) => (
          <ProductCard key={m.id} item={m} linkToMenu />
        ))}
      </Reveal>
    </section>
  );
}

export function SpecialtyCoffeeSection() {
  const { t, lang } = useLang();
  const methods = menu.filter((m) => m.category === "pour-over");
  return (
    <section id="specialty" className="bg-charcoal py-20 text-on-dark md:py-28">
      <div className="container-cw grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <Heading eyebrow={t.specialty.eyebrow} title={t.specialty.title} light />
          <p className="mt-6 max-w-md text-on-dark-muted">{t.specialty.body}</p>
          <ul className="mt-10 divide-y divide-line-dark border-y border-line-dark">
            {methods.map((m, i) => (
              <li key={m.id}>
                <Link
                  to="/menu"
                  search={{ cat: "pour-over", item: m.id }}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-display text-sm text-amber" dir="ltr">
                      0{i + 1}
                    </span>
                    <span className="font-display text-2xl font-semibold" dir="ltr">
                      {m.nameEn}
                    </span>
                  </span>
                  <span className="text-sm text-on-dark-muted group-hover:text-amber">
                    {(lang === "ar" ? m.descriptionAr : m.descriptionEn) ?? ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Reveal delay={120} className="grid grid-cols-2 gap-3">
          <div className="col-span-2 aspect-[16/9] overflow-hidden rounded-lg">
            <Photo img={images.slowBrew} />
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <Photo img={images.pourOver} />
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <Photo img={images.brewBar} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function BakerySection() {
  const { t } = useLang();
  const tiles = [
    { img: images.chimney, name: "Chimney Bites", id: "chimney-bites" },
    { img: images.savoury, name: "Zaatar Labneh Chimney", id: "zaatar-labneh-chimney" },
    { img: images.croissants, name: "Croissants & Pain Suisse", id: "sweet-croissants" },
  ];
  return (
    <section id="bakery" className="container-cw py-20 md:py-28">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Heading eyebrow={t.bakery.eyebrow} title={t.bakery.title} />
          <p className="mt-5 max-w-lg text-muted-foreground">{t.bakery.body}</p>
        </div>
        <Link to="/menu" search={{ cat: "bakery" }} className="btn-outline-dark shrink-0">
          {t.bakery.cta} <Arrow />
        </Link>
      </div>
      <Reveal delay={100} className="mt-10 grid gap-4 md:grid-cols-3">
        {tiles.map((tile, i) => (
          <Link
            key={tile.id}
            to="/menu"
            search={{ cat: "bakery", item: tile.id }}
            className={`group relative overflow-hidden rounded-lg bg-charcoal ${i === 0 ? "aspect-[4/5] md:row-span-2 md:aspect-auto" : "aspect-[4/3]"}`}
          >
            <Photo
              img={tile.img}
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <div className="card-overlay absolute inset-0" />
            <h3
              className="font-display absolute bottom-4 start-4 text-xl font-semibold text-on-dark"
              dir="ltr"
            >
              {tile.name}
            </h3>
          </Link>
        ))}
      </Reveal>
      <p className="mt-3 text-xs text-muted-foreground">{t.bakery.illustrative}</p>
    </section>
  );
}

export function BenefitsSection() {
  const { t } = useLang();
  const icons = [Coffee, Sparkles, FlaskConical, Croissant];
  return (
    <section className="bg-cream-deep py-20">
      <div className="container-cw">
        <p className="eyebrow text-center">{t.benefits.eyebrow}</p>
        <Reveal delay={100} className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.benefits.items.map((b, i) => {
            const Icon = icons[i] ?? Coffee;
            return (
              <div key={b.title} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-coffee text-coffee">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display mt-4 text-xl font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

export function Gallery() {
  const { t } = useLang();
  const g = [
    images.counter,
    images.hatWall,
    images.syphonBar,
    images.retail,
    images.brewBar,
    images.barista,
  ];
  return (
    <section className="container-cw py-20 md:py-28">
      <Heading eyebrow={t.gallery.eyebrow} title={t.gallery.title} />
      <Reveal delay={100} className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
        {g.map((img, i) => (
          <div
            key={img.src}
            className={`overflow-hidden rounded-lg ${
              i === 0 ? "col-span-2 aspect-[16/10] md:row-span-2 md:aspect-auto" : "aspect-square"
            } ${i === 5 ? "md:hidden" : ""}`}
          >
            <Photo img={img} />
          </div>
        ))}
      </Reveal>
    </section>
  );
}

export function LocationSection() {
  const { t } = useLang();
  return (
    <section id="find-us" className="bg-charcoal py-20 text-on-dark md:py-28">
      <div className="container-cw grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Heading eyebrow={t.location.eyebrow} title={t.location.title} light />
          <dl className="mt-10 space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-amber" />
              <div>
                <dt className="text-xs uppercase tracking-widest text-on-dark-muted">
                  {t.location.addressLabel}
                </dt>
                <dd className="mt-1 text-lg">{t.location.address}</dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-amber" />
              <div>
                <dt className="text-xs uppercase tracking-widest text-on-dark-muted">
                  {t.location.phoneLabel}
                </dt>
                <dd className="mt-1 text-lg">
                  <a href={business.phoneHref} dir="ltr" className="hover:text-amber">
                    {business.phoneDisplay}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-amber" />
              <div>
                <dt className="text-xs uppercase tracking-widest text-on-dark-muted">
                  {t.location.hoursLabel}
                </dt>
                <dd className="mt-1 text-lg">{t.location.hours}</dd>
              </div>
            </div>
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="btn-amber">
              <MapPin className="h-4 w-4" /> {t.location.directions}
            </a>
            <a href={business.talabat} target="_blank" rel="noreferrer" className="btn-ghost-light">
              {t.location.order} <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={business.instagram}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost-light"
            >
              <Instagram className="h-4 w-4" /> {t.location.instagram}
            </a>
          </div>
        </div>
        <Reveal
          delay={140}
          className="aspect-[4/3] overflow-hidden rounded-lg border border-line-dark"
        >
          <iframe
            title="Coffee Wizard on Google Maps"
            src="https://www.google.com/maps?q=Coffee+Wizard+El+Gomhouria+Mansoura&output=embed"
            className="h-full w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}
