// Central image registry. Only the brand marks supplied by the client are official assets.
// "illustrative" images are generated stand-ins—not documentary photos of Coffee Wizard or confirmed products.
export type Img = {
  src: string;
  kind: "authentic" | "illustrative";
  alt: { en: string; ar: string };
};

const hero: Img = {
  src: "/images/coffee-wizard-hero.webp",
  kind: "illustrative",
  alt: {
    en: "AI-generated concept image of a specialty coffee bar, not a photo of the actual café",
    ar: "صورة توضيحية مولدة بالذكاء الاصطناعي لبار قهوة مختصة وليست صورة للكافيه الحقيقي",
  },
};
const flavorBoard: Img = {
  src: "/images/coffee-wizard-flavor-board.webp",
  kind: "illustrative",
  alt: {
    en: "AI-generated coffee still life with espresso, pistachio, cocoa, honey, fruit, and beans",
    ar: "صورة توضيحية مولدة بالذكاء الاصطناعي للقهوة والفستق والكاكاو والعسل والفواكه وحبوب البن",
  },
};
const signatureLatte: Img = {
  src: "/images/coffee-wizard-signature-latte.webp",
  kind: "illustrative",
  alt: {
    en: "AI-generated concept image of a hot espresso latte with latte art",
    ar: "صورة توضيحية مولدة بالذكاء الاصطناعي للاتيه ساخن برسمة على الرغوة",
  },
};
const icedPistachio: Img = {
  src: "/images/coffee-wizard-iced-pistachio.webp",
  kind: "illustrative",
  alt: {
    en: "AI-generated concept image of a layered iced pistachio latte",
    ar: "صورة توضيحية مولدة بالذكاء الاصطناعي للاتيه فستق ساقع بطبقات",
  },
};
const bakeryPairing: Img = {
  src: "/images/coffee-wizard-bakery-pairing.webp",
  kind: "illustrative",
  alt: {
    en: "AI-generated concept image of a chimney pastry paired with espresso",
    ar: "صورة توضيحية مولدة بالذكاء الاصطناعي لحلوى Chimney مع إسبريسو",
  },
};

export const images = {
  // Stable stand-ins for older project image URLs that are not available in this build.
  syphonBar: hero,
  brewBar: hero,
  slowBrew: hero,
  hatWall: hero,
  barista: signatureLatte,
  wizardCup: icedPistachio,
  pourOver: flavorBoard,
  matchaCup: flavorBoard,
  counter: hero,
  retail: flavorBoard,
  chimney: bakeryPairing,
  croissants: bakeryPairing,
  savoury: bakeryPairing,
  hero,
  flavorBoard,
  signatureLatte,
  icedPistachio,
  bakeryPairing,
} satisfies Record<string, Img>;
