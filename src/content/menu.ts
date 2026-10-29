import { images, type Img } from "./images";

export type CategoryId =
  | "hot-coffee"
  | "pour-over"
  | "iced-coffee"
  | "signature"
  | "matcha"
  | "non-coffee"
  | "bakery"
  | "sandwiches";

export type Category = { id: CategoryId; nameEn: string; nameAr: string; image: Img };

export const categories: Category[] = [
  { id: "hot-coffee", nameEn: "Hot Coffee", nameAr: "قهوة سخنة", image: images.barista },
  { id: "pour-over", nameEn: "Pour Over", nameAr: "Pour Over", image: images.pourOver },
  { id: "iced-coffee", nameEn: "Iced Coffee", nameAr: "قهوة ساقعة", image: images.wizardCup },
  { id: "matcha", nameEn: "Matcha", nameAr: "ماتشا", image: images.matchaCup },
  { id: "signature", nameEn: "Signature & Blends", nameAr: "سيجنتشر وبليندز", image: images.slowBrew },
  { id: "non-coffee", nameEn: "Non-Coffee", nameAr: "من غير قهوة", image: images.retail },
  { id: "bakery", nameEn: "Chimney & Bakery", nameAr: "Chimney ومخبوزات", image: images.chimney },
  { id: "sandwiches", nameEn: "Sandwiches", nameAr: "ساندوتشات", image: images.savoury },
];

export type MenuItem = {
  id: string;
  nameEn: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  category: CategoryId;
  temp?: "hot" | "iced";
  /** Never displayed until priceStatus is "verified". */
  price?: number;
  currency: "EGP";
  priceStatus: "verified" | "unconfirmed";
  image?: Img;
  available: boolean;
  featured?: boolean;
  source: string;
  lastVerified?: string;
};

const BOARD = "In-store menu board photo (date unknown)";
const BRIEF = "Client brief research checklist";

type Seed = [id: string, nameEn: string, extra?: Partial<MenuItem>];
const make = (category: CategoryId, temp: MenuItem["temp"], source: string, seeds: Seed[]): MenuItem[] =>
  seeds.map(([id, nameEn, extra]) => ({
    id,
    nameEn,
    category,
    temp,
    currency: "EGP",
    priceStatus: "unconfirmed",
    available: true,
    source,
    ...extra,
  }));

export const menu: MenuItem[] = [
  ...make("hot-coffee", "hot", BOARD, [
    ["espresso", "Espresso", { price: 43 }],
    ["espresso-macchiato", "Espresso Macchiato", { price: 51 }],
    ["americano", "Americano", { price: 57 }],
    ["piccolo", "Piccolo", { price: 54 }],
    ["latte", "Latte", { price: 61 }],
    ["cappuccino", "Cappuccino", { price: 61 }],
    ["cortado", "Cortado", { price: 56 }],
    ["flat-white", "Flat White", { price: 58 }],
    ["caramel-macchiato", "Caramel Macchiato", { price: 70 }],
    ["mocha", "Mocha", { price: 75 }],
    ["white-mocha", "White Mocha", { price: 75 }],
    ["spanish-latte", "Spanish Latte", {
      price: 70, featured: true, image: images.barista,
      descriptionEn: "Espresso with milk, sweetened the Spanish way.",
      descriptionAr: "إسبريسو باللبن بطعم Spanish المسكّر.",
    }],
    ["pistachio-spanish-latte", "Pistachio Spanish Latte", {
      source: BRIEF, featured: true, image: images.counter,
      descriptionEn: "The Spanish Latte with a pistachio twist.",
      descriptionAr: "الـ Spanish Latte بلمسة فستق.",
    }],
    ["lotus-latte", "Lotus Latte", { price: 78 }],
    ["turkish-coffee", "Turkish Coffee", { nameAr: "قهوة تركي", price: 43 }],
    ["turkish-coffee-milk", "Turkish Coffee with Milk", { nameAr: "قهوة تركي باللبن", price: 52 }],
  ]),
  ...make("pour-over", "hot", BRIEF, [
    ["v60", "V60", {
      featured: true, image: images.pourOver,
      descriptionEn: "Hand-poured filter coffee, clean and bright.",
      descriptionAr: "قهوة فلتر بتتصب بالإيد، طعمها صافي وواضح.",
    }],
    ["chemex", "Chemex", {
      featured: true, image: images.syphonBar,
      descriptionEn: "A larger, smooth pour over — made for sharing.",
      descriptionAr: "Pour Over ناعم وأكبر — ينفع تتشاركه.",
    }],
    ["aeropress", "AeroPress"],
    ["syphon", "Syphon", { descriptionEn: "Vacuum-brewed at the bar.", descriptionAr: "بيتحضّر بالـ Vacuum قدامك على البار." }],
    ["french-press", "French Press"],
  ]),
  ...make("iced-coffee", "iced", BOARD, [
    ["iced-americano", "Iced Americano", { price: 54 }],
    ["iced-latte", "Iced Latte", { price: 57 }],
    ["iced-cortado", "Iced Cortado", { price: 57 }],
    ["iced-cappuccino", "Iced Cappuccino", { source: BRIEF }],
    ["iced-caramel-macchiato", "Iced Caramel Macchiato", { price: 66 }],
    ["iced-mocha", "Iced Mocha", { price: 74 }],
    ["iced-white-mocha", "Iced White Mocha", { price: 74 }],
    ["iced-spanish-latte", "Iced Spanish Latte", { source: BRIEF, featured: true, image: images.wizardCup,
      descriptionEn: "Our Spanish Latte, poured over ice.", descriptionAr: "الـ Spanish Latte على تلج." }],
    ["iced-pistachio-spanish-latte", "Iced Pistachio Spanish Latte", { source: BRIEF }],
  ]),
  ...make("signature", "iced", BRIEF, [
    ["white-espresso-shaken", "White Espresso Shaken"],
    ["iced-espresso-shaken", "Iced Espresso Shaken"],
    ["iced-white-mocha-shaken", "Iced White Mocha Shaken"],
    ["coffee-blend", "Coffee Blend"],
    ["caramel-coffee-blend", "Caramel Coffee Blend"],
    ["mocha-blend", "Mocha Blend"],
    ["white-mocha-blend", "White Mocha Blend"],
    ["salted-caramel-coffee-blend", "Salted Caramel Coffee Blend"],
    ["coffee-bottles", "Coffee Bottles"],
  ]),
  ...make("matcha", undefined, BRIEF, [
    ["matcha-latte", "Matcha Latte", { temp: "hot", price: 57, source: BOARD }],
    ["ice-matcha-latte", "Iced Matcha Latte", { temp: "iced", price: 59, source: BOARD }],
    ["matcha-vanilla-latte", "Matcha Vanilla Latte"],
    ["matcha-spanish-latte", "Matcha Spanish Latte"],
    ["white-matcha", "White Matcha"],
    ["matcha-pistachio", "Matcha Pistachio", { featured: true, image: images.hatWall,
      descriptionEn: "Earthy matcha meets pistachio.", descriptionAr: "ماتشا مع فستق." }],
    ["matcha-coconut", "Matcha Coconut"],
    ["choco-matcha", "Choco Matcha"],
    ["espresso-matcha", "Espresso Matcha"],
    ["matcha-cloud", "Matcha Cloud"],
    ["matcha-strawberry", "Matcha Strawberry", { temp: "iced", featured: true, image: images.matchaCup,
      descriptionEn: "Layered matcha over a berry base.", descriptionAr: "ماتشا متطبّقة فوق فراولة." }],
    ["matcha-tropical", "Matcha Tropical"],
  ]),
  ...make("non-coffee", undefined, BOARD, [
    ["hot-chocolate", "Classic Hot Chocolate", { temp: "hot", price: 58 }],
    ["white-chocolate", "White Chocolate", { temp: "hot", price: 58 }],
    ["chai-latte", "Chai Latte", { temp: "hot", price: 68 }],
    ["breakfast-tea", "Breakfast Tea", { temp: "hot", price: 43 }],
    ["herbal-tea", "Herbal Tea", { temp: "hot", price: 43 }],
    ["specialty-tea", "Specialty Tea", { temp: "hot", source: BRIEF }],
    ["smoothies", "Smoothies", { temp: "iced", source: BRIEF }],
    ["mojito", "Mojito", { temp: "iced", source: BRIEF }],
    ["iced-hibiscus", "Iced Hibiscus", { nameAr: "كركديه ساقع", temp: "iced", source: BRIEF }],
    ["pistachio-blend", "Pistachio Blend", { temp: "iced", price: 75 }],
    ["lotus-blend", "Lotus Blend", { temp: "iced", price: 75 }],
    ["red-velvet-blend", "Red Velvet Blend", { temp: "iced", price: 83 }],
    ["strawberry-blend", "Strawberry Blend", { temp: "iced", price: 55 }],
  ]),
  ...make("bakery", undefined, BRIEF, [
    ["chimney-bites", "Chimney Bites", { featured: true, image: images.chimney,
      descriptionEn: "Bite-size Hungarian-style chimney cake.", descriptionAr: "Chimney Cake مجري في قطع صغيرة." }],
    ["sweet-chimney", "Sweet Chimney"],
    ["zaatar-labneh-chimney", "Zaatar Labneh Chimney", { featured: true, image: images.savoury,
      descriptionEn: "A savoury chimney with zaatar and labneh.", descriptionAr: "Chimney حادق بالزعتر واللبنة." }],
    ["turkey-salami-chimney", "Turkey Salami Chimney"],
    ["smoked-turkey-chimney", "Smoked Turkey Chimney"],
    ["fajita-hotdog-chimney", "Fajita Hotdog Chimney"],
    ["savoury-croissants", "Savoury Croissants"],
    ["sweet-croissants", "Sweet Croissants", { image: images.croissants }],
    ["pain-suisse", "Pain Suisse"],
  ]),
  ...make("sandwiches", undefined, BRIEF, [
    ["focaccia", "Focaccia Sandwiches"],
    ["ciabatta", "Ciabatta Sandwiches"],
    ["baguette", "Baguette Sandwiches"],
    ["turkey-egg", "Turkey Egg"],
    ["hotdog-egg", "Hot Dog Egg"],
    ["mix-cheese", "Mix Cheese"],
  ]),
];

export const featured = menu.filter((m) => m.featured);
export const categoryById = (id: CategoryId) => categories.find((c) => c.id === id)!;
export const itemImage = (m: MenuItem) => m.image ?? categoryById(m.category).image;

export function searchMenu(items: MenuItem[], q: string, cat: CategoryId | "all") {
  const s = q.trim().toLowerCase();
  return items.filter(
    (m) =>
      (cat === "all" || m.category === cat) &&
      (!s || m.nameEn.toLowerCase().includes(s) || (m.nameAr ?? "").includes(q.trim())),
  );
}
