import { createFileRoute } from "@tanstack/react-router";
import {
  HeroSection,
  BrandStory,
  CategoryGrid,
  FeaturedProducts,
  SpecialtyCoffeeSection,
  BakerySection,
  BenefitsSection,
  Gallery,
  LocationSection,
} from "@/components/cw/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coffee Wizard — Specialty Coffee & Bakery in Mansoura (Concept)" },
      {
        name: "description",
        content: "Specialty coffee, manual brewing, matcha and Hungarian-inspired chimney bakery on El Gomhoria Street, Mansoura.",
      },
      { property: "og:title", content: "Coffee Wizard — Specialty Coffee in Mansoura" },
      { property: "og:description", content: "V60, Chemex, Syphon, Spanish lattes, matcha and chimney cakes. Concept website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSection />
      <BrandStory />
      <CategoryGrid />
      <FeaturedProducts />
      <SpecialtyCoffeeSection />
      <BakerySection />
      <BenefitsSection />
      <Gallery />
      <LocationSection />
    </>
  );
}
