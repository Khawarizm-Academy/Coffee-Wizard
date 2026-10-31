# Coffee Wizard Website Design System

## Brand direction

Coffee Wizard is a specialty-coffee ritual in Mansoura: carefully made, welcoming, and a little curious. The visual language balances café craft with a restrained touch of magic. It should feel considered, warm, and playful—not like a fantasy game or a generic ordering app.

The two supplied official logos are the source of truth for brand marks. Keep them intact. Use the circular seal in compact navigation and the primary logo where there is room to recognize the full mark. Do not redraw, typeset over, recolor, crop, or generate substitute logos.

## Source of truth

This guide describes how to use the system. Runtime values live in `src/styles.css`; bilingual copy lives in `src/content/translations.ts`; logo files live in `public/brand/`; image metadata and alternate text live in `src/content/images.ts`. Reuse those sources instead of adding local palettes, font stacks, or one-off button treatments.

## Color tokens

The palette is implemented in OKLCH in `src/styles.css`. The comments give the sampled café inspiration and approximate conventional color reference where available; keep the CSS tokens authoritative.

| Token | Runtime value | Role |
| --- | --- | --- |
| `--charcoal` | `oklch(0.2 0.012 55)` (about `#1f1a16`) | Espresso-tile dark base, primary text on cream |
| `--charcoal-soft` | `oklch(0.27 0.014 55)` | Secondary dark card/surface |
| `--cream` | `oklch(0.955 0.014 82)` | Latte-foam page canvas |
| `--cream-deep` | `oklch(0.9 0.03 80)` (about `#dac59c`) | Oat separator bands, secondary cream |
| `--coffee` | `oklch(0.58 0.08 52)` (about `#b07f62`) | Copper wood; secondary accent |
| `--sage` | `oklch(0.58 0.03 120)` | Muted café-stool green |
| `--amber` | `oklch(0.76 0.12 82)` | Syphon brass; primary action and selected/highlight state |
| `--amber-strong` | `oklch(0.69 0.12 78)` | Strong brass; focus ring and contrast accent |
| `--heart` | `oklch(0.58 0.2 27)` | Heart-sign red; semantic/error accent |
| `--lavender` | `oklch(0.74 0.08 305)` | Lavender dripper accent; limited decoration |
| `--matcha` | `oklch(0.8 0.13 118)` | Matcha/dripper accent; limited decoration |
| `--on-dark` | `oklch(0.955 0.014 82)` | Main text on dark surfaces |
| `--on-dark-muted` | `oklch(0.78 0.02 75)` | Supporting text on dark surfaces |
| `--line-dark` | `oklch(1 0 0 / 12%)` | Borders/dividers on dark surfaces |

Semantic mappings: `--background` → `--cream`; `--foreground` → `--charcoal`; `--card` → `oklch(0.978 0.008 82)`; `--muted-foreground` → `oklch(0.45 0.025 55)`; `--border` and `--input` → `oklch(0.85 0.025 72)`; `--ring` → `--amber-strong`. The primary semantic color maps to `--amber` and the primary text to `--charcoal`.

Dark surfaces use `--charcoal` or `--charcoal-soft`; cream/`--on-dark` text sits on top. Use `border-border` on cream surfaces and `border-line-dark` on dark ones. Do not introduce new component-level hex colors where a token fits.

## Typography

Use Fraunces for expressive display headings, Manrope for English interface/body copy, and IBM Plex Sans Arabic for Arabic UI and headings. The font loading is in `src/routes/__root.tsx`; the Arabic font switch lives in `src/styles.css`.

Page headings are bold and compact: typically `text-4xl` on small screens and `md:text-6xl` on larger screens. Section headings use `text-3xl` through `md:text-5xl`. Body copy is normally 16–18px; helper text and category labels may use 12–14px. Eyebrows use the shared `eyebrow` utility (12px bold uppercase, 0.22em tracking; disable tracking in Arabic). Keep Arabic letter spacing natural. Put brand marks and numeric/currency values in explicit LTR contexts when needed.

## Layout, spacing, shape, and depth

Use `.container-cw` for a 100%-wide layout with `76rem` max width, centered, and `1.25rem` inline padding (increasing to `2rem` from 768px). Standard section rhythm is `py-20 md:py-28`; page-level routes may start with `py-14 md:py-20`.

The base radius is `0.5rem`; derived radius tokens are small = base − 2px, medium = base, large = base + 2px, and extra-large = base + 6px. Common cards use `rounded-xl` geometry and a 1px tokenized border. `--shadow-card` is a soft charcoal drop shadow; `--shadow-glow` is reserved for exceptional brass focus/hover emphasis. `--gradient-brass` sweeps from `--amber` through a pale warm brass to `--amber-strong`.

Prefer a clear editorial split for feature areas and a restrained grid for repeatable menu items. Keep search, category controls, products, and the order summary aligned to the same container. Use the shared `cw-card` on cream pages and `cw-card-dark`/`cw-card-soft` for dark panels; do not invent a new card language for the Wizard or order preview.

## Controls and states

Use `btn-amber` for primary actions (pill shape, brass gradient, 0.8rem × 1.6rem padding), `btn-outline-dark` for secondary actions on cream, and `btn-ghost-light` only on dark. Filter and flavor choices use `cw-chip`, with selected state exposed via `aria-pressed`/`aria-selected`/`aria-checked`, dark fill, cream text, and a visible border. Quantity controls stay compact, visibly grouped, keyboard-operable, and labelled with item and action. Inputs use semantic token borders, cream fill, and the global focus outline.

The coffee matcher and order page share the same light cards, pill-shaped controls, focus ring, and brass primary action. The matcher may use a single dark feature banner, but its inputs, result cards, and selection state follow these same rules.

## Icon system

Use the existing `lucide-react` module for interface, flavor, and category icons. Use one icon per control, normally 16–20px, with a consistent 1.75–2px stroke. Flavor icons sit in `cw-icon-tile`: circular, cream/brass-tinted, and copper-inked. Do not hand-draw replacement pictograms in SVG, use emoji as a substitute for interface icons, or mix unrelated icon families. The circular spinning text seal is a brand-text treatment; its center icon still comes from Lucide.

## Motion and accessibility

Use the existing `Reveal` helper for scroll entrances: opacity plus a 28px upward offset over 0.8 seconds with a small stagger. Other available motion tokens are float 6s, twinkle 2.6s, wiggle 0.6s, slow spin 18s, marquee 38s, steam 3.2s, pop 0.55s, and bubble 1.6s. Use them sparingly, especially on the Wizard badge and icon details. Preserve the `prefers-reduced-motion` override in `src/styles.css`; motion must never carry the only meaning of a state.

Every interactive control needs a visible focus state and an accessible name. Choice controls expose their selected state to assistive technology. Images use bilingual descriptive alt text; decorative images and icons use empty alt/`aria-hidden` as appropriate. Use logical `start`/`end` spacing and `dir="auto"` for mixed-language product content so the same UI works in RTL.

## Logo and imagery

Official brand files are `public/brand/coffee-wizard-logo-primary.jpg` and `public/brand/coffee-wizard-logo-seal.jpg`. Keep the supplied dark backgrounds intact so the white marks remain legible. The seal is for compact header/favicon use; the primary logo is for larger brand moments such as the footer.

Website photographs generated for this concept are illustrative, not documentary photographs of the actual café or confirmed menu products. Their metadata belongs in `src/content/images.ts`, with both English and Arabic alt text and `kind: "illustrative"`. A shared `Photo` component adds the visible concept-image disclosure. Prefer relevant imagery and variety where available; the user has approved repeated or dummy placeholder images, so repeating the closest generated subject is acceptable until authentic café photos are supplied.

## Bilingual behavior and commerce safety

All interface copy belongs in matching English and Arabic shapes in `src/content/translations.ts`. Keep document language and direction controlled by the language provider. Use logical CSS properties, `dir="auto"` for mixed-language names/reasons, and `dir="ltr"` for brand marks and numeric currency strings. If an Arabic product name has not been provided, retain the menu’s English product name as a clearly isolated mixed-direction fallback.

A price may be shown or included in a total only when its `priceStatus` is `verified`. The purchase-email feature is mock-only: it may render a local preview from selected items, but must not open `mailto:`, call an email API, claim an order was sent, or submit a real purchase. State clearly that the preview is a demo and nothing is sent.
