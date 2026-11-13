import { ArrowRightIcon } from "@/components/ui/icons";
import type { Category } from "@/content";
import { categoriesSection } from "@/content";

type CategoryCardProps = { category: Category };

/**
 * Whole card is clickable through the link's stretched ::after, while keeping a single
 * tab stop and an accessible name of "Explore <title>" (Figma 2:153).
 */
export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line-1 bg-background-white p-7 transition-[border-color,box-shadow] duration-200 hover:border-primary-blue hover:shadow-card motion-reduce:transition-none">
      <div className="h-[46.5px]">
        <span className="mt-0.5 inline-flex rounded-md bg-primary-blue-light px-2 py-1 text-overline text-primary-blue">
          {category.number}
        </span>
      </div>
      <h3 className="text-h5 text-text-primary">{category.title}</h3>
      <p className="mt-3 text-body-1 text-text-tertiary">{category.description}</p>
      <a
        href={category.href}
        aria-label={`${categoriesSection.linkLabel} ${category.title}`}
        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm leading-6 font-bold text-text-primary after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary-blue"
      >
        {categoriesSection.linkLabel}
        <ArrowRightIcon className="size-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
      </a>
    </article>
  );
}
