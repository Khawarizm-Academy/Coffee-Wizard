import { Link } from "@tanstack/react-router";
import { Menu as MenuIcon, X, Instagram, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { business } from "@/content/business";
import { Logo } from "./Logo";

export function LanguageSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { lang, setLang } = useLang();
  const base = tone === "dark" ? "border-line-dark text-on-dark" : "border-border text-foreground";
  return (
    <div role="group" aria-label="Language" className={`inline-flex rounded-full border p-0.5 text-sm ${base}`}>
      {(["en", "ar"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          lang={l}
          className={`min-w-9 rounded-full px-3 py-1 font-bold transition-colors ${
            lang === l ? "bg-amber text-charcoal" : "opacity-80 hover:opacity-100"
          }`}
        >
          {l === "en" ? "EN" : "ع"}
        </button>
      ))}
    </div>
  );
}

function useNavLinks() {
  const { t } = useLang();
  return [
    { label: t.nav.home, to: "/" as const },
    { label: t.nav.story, to: "/" as const, hash: "story" },
    { label: t.nav.menu, to: "/menu" as const },
    { label: t.nav.specialty, to: "/" as const, hash: "specialty" },
    { label: t.nav.bakery, to: "/" as const, hash: "bakery" },
    { label: t.nav.findUs, to: "/" as const, hash: "find-us" },
  ];
}

export function Navbar() {
  const { t } = useLang();
  const links = useNavLinks();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-charcoal/95 text-on-dark backdrop-blur">
      <p className="bg-coffee px-4 py-1.5 text-center text-xs text-cream">{t.concept}</p>
      <div className="container-cw flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="Coffee Wizard" className="text-on-dark">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              {...(l.hash ? { hash: l.hash } : {})}
              className="text-sm font-semibold text-on-dark-muted transition-colors hover:text-amber"
              activeOptions={{ exact: true, includeHash: true }}
              activeProps={{ className: "text-amber" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link to="/menu" className="btn-amber !px-5 !py-2 text-sm">
            {t.nav.cta}
          </Link>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="rounded-full p-2 hover:bg-charcoal-soft"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line-dark lg:hidden" aria-label="Mobile">
          <ul className="container-cw flex flex-col py-3">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  {...(l.hash ? { hash: l.hash } : {})}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-semibold text-on-dark hover:text-amber"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 pb-2">
              <Link to="/menu" onClick={() => setOpen(false)} className="btn-amber w-full">
                {t.nav.cta}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useLang();
  const links = useNavLinks();
  return (
    <footer className="bg-charcoal text-on-dark">
      <div className="container-cw grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-on-dark-muted">{t.footer.about}</p>
          <LanguageSwitcher />
        </div>
        <div>
          <h2 className="eyebrow !text-amber">{t.footer.nav}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {links.map((l) => (
              <li key={l.label}>
                <Link to={l.to} {...(l.hash ? { hash: l.hash } : {})} className="text-on-dark-muted hover:text-amber">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow !text-amber">{t.footer.contact}</h2>
          <ul className="mt-4 space-y-3 text-sm text-on-dark-muted">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
              <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-amber">
                {t.location.address}
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
              <a href={business.phoneHref} dir="ltr" className="hover:text-amber">
                {business.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2">
              <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
              <a href={business.instagram} target="_blank" rel="noreferrer" className="hover:text-amber" dir="ltr">
                @coffeewizardeg
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line-dark">
        <p className="container-cw py-5 text-xs text-on-dark-muted">
          © {new Date().getFullYear()} {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
