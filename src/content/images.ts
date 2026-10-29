// Central image registry. "authentic" = cropped from Coffee Wizard photos supplied by the client
// (sourced from Restaurant Guru / Talabat / social posts — confirm reuse permission before launch).
// "illustrative" = AI-generated stand-ins, labelled on-site, to be replaced with real photography.
import syphonBar from "@/assets/cw/interior-syphon-bar.webp.asset.json";
import brewBar from "@/assets/cw/interior-brew-bar.webp.asset.json";
import slowBrew from "@/assets/cw/slow-brew-tower.webp.asset.json";
import hatWall from "@/assets/cw/interior-wizard-hat-wall.webp.asset.json";
import barista from "@/assets/cw/barista-at-work.webp.asset.json";
import wizardCup from "@/assets/cw/drink-wizard-cup-iced.webp.asset.json";
import pourOver from "@/assets/cw/pour-over-dripper.webp.asset.json";
import matchaCup from "@/assets/cw/drink-matcha-berry-cup.webp.asset.json";
import counter from "@/assets/cw/interior-counter.webp.asset.json";
import retail from "@/assets/cw/retail-i-love-wizard.webp.asset.json";
import chimney from "@/assets/cw/illustrative-chimney-cake.jpg";
import croissants from "@/assets/cw/illustrative-croissants.jpg";
import savoury from "@/assets/cw/illustrative-savoury-chimney.jpg";

export type Img = { src: string; kind: "authentic" | "illustrative"; alt: { en: string; ar: string } };

export const images = {
  syphonBar: { src: syphonBar.url, kind: "authentic", alt: { en: "Syphon and pour-over brewers on the Coffee Wizard bar", ar: "أدوات Syphon وPour Over على بار Coffee Wizard" } },
  brewBar: { src: brewBar.url, kind: "authentic", alt: { en: "The manual brewing bar with stools", ar: "بار التحضير اليدوي" } },
  slowBrew: { src: slowBrew.url, kind: "authentic", alt: { en: "Slow brew tower at Coffee Wizard", ar: "برج Slow Brew في Coffee Wizard" } },
  hatWall: { src: hatWall.url, kind: "authentic", alt: { en: "Seating beneath the wizard hat sign", ar: "قعدة تحت لوجو قبعة الساحر" } },
  barista: { src: barista.url, kind: "authentic", alt: { en: "Barista preparing coffee at the bar", ar: "باريستا بيحضّر القهوة" } },
  wizardCup: { src: wizardCup.url, kind: "authentic", alt: { en: "Iced drink in a Coffee Wizard cup", ar: "مشروب ساقع في كوباية Coffee Wizard" } },
  pourOver: { src: pourOver.url, kind: "authentic", alt: { en: "Pour-over coffee being brewed", ar: "تحضير قهوة Pour Over" } },
  matchaCup: { src: matchaCup.url, kind: "authentic", alt: { en: "Matcha drink with berry layer in a Coffee Wizard cup", ar: "ماتشا بطبقة فراولة في كوباية Coffee Wizard" } },
  counter: { src: counter.url, kind: "authentic", alt: { en: "Coffee Wizard counter and bar", ar: "كاونتر Coffee Wizard" } },
  retail: { src: retail.url, kind: "authentic", alt: { en: "I love Wizard sign and retail shelf", ar: "يافطة I ♥ Wizard" } },
  chimney: { src: chimney, kind: "illustrative", alt: { en: "Illustrative cinnamon chimney cake", ar: "صورة توضيحية لـ Chimney Cake بالقرفة" } },
  croissants: { src: croissants, kind: "illustrative", alt: { en: "Illustrative croissants", ar: "صورة توضيحية لكرواسون" } },
  savoury: { src: savoury, kind: "illustrative", alt: { en: "Illustrative savoury chimney and sandwich", ar: "صورة توضيحية لـ Chimney حادق وساندوتش" } },
} satisfies Record<string, Img>;
