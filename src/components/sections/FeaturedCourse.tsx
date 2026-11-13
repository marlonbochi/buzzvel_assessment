import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredCourse } from "@/content";

/** Featured course on blue (Figma 2:193 desktop, 2:4361 mobile). */
export function FeaturedCourse() {
  return (
    <section aria-labelledby="featured-title" className="bg-primary-blue py-16 lg:py-[100px]">
      <Container className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-15">
        <div className="relative lg:min-w-0 lg:flex-1">
          <div className="relative aspect-[362/280] overflow-hidden rounded-2xl bg-primary-blue-light md:aspect-[16/10] lg:aspect-auto lg:h-[408px]">
            <Image
              src={featuredCourse.image.src}
              alt={featuredCourse.image.alt}
              fill
              sizes="(min-width: 1280px) 530px, (min-width: 1024px) calc(50vw - 110px), calc(100vw - 40px)"
              className="object-cover"
            />
          </div>
          <p className="absolute -top-3 -left-3 rounded-md bg-secondary-yellow px-3 py-1.5 text-overline text-text-primary">
            {featuredCourse.tag}
          </p>
        </div>

        <div className="flex flex-col lg:min-w-0 lg:flex-1">
          <SectionHeading
            id="featured-title"
            tone="light"
            size="h3"
            eyebrow={featuredCourse.eyebrow}
            title={featuredCourse.title}
          />
          <p className="mt-5 text-subtitle-2 text-text-white-primary max-md:text-base max-md:leading-6">
            {featuredCourse.description}
          </p>
          <p className="mt-6 text-subtitle-2 text-text-white-primary max-md:text-base">
            {featuredCourse.instructor}
          </p>

          <ul aria-label="Course details" className="mt-6 flex flex-wrap gap-3">
            {featuredCourse.meta.map((item) => (
              <li key={item}>
                <Chip tone="outline-white">{item}</Chip>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3 md:flex-row">
            <ButtonLink
              href={featuredCourse.primaryCta.href}
              variant="yellow"
              block="mobile"
              className="max-md:text-base"
            >
              {featuredCourse.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={featuredCourse.secondaryCta.href}
              variant="text"
              withArrow
              className="px-4 py-3.5 text-text-white-primary max-md:text-base"
            >
              {featuredCourse.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
