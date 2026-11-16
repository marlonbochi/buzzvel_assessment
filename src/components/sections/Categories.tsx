import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories, categoriesSection } from "@/content";
import { CategoryCard } from "./CategoryCard";

/** Category grid (Figma 2:100 desktop, 2:4269 mobile): 1 → 2 → 4 columns. */
export function Categories() {
  return (
    <section
      id="courses"
      aria-labelledby="courses-title"
      className="bg-background-white py-15 lg:py-[100px]"
    >
      <Container>
        <SectionHeading
          id="courses-title"
          eyebrow={categoriesSection.eyebrow}
          title={categoriesSection.title}
          description={categoriesSection.description}
          size="h3"
          className="lg:max-w-[560px]"
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.number}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
