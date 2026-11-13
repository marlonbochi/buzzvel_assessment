import Image from "next/image";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { StarIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hero } from "@/content";

const badgeClass =
  "absolute flex items-center rounded-xl bg-background-white px-4 py-3 text-sm leading-6 text-text-primary " +
  "shadow-[0_4px_12px_rgba(0,0,0,0.1)]";

/** Hero (Figma 2:38 desktop, 2:4208 mobile). Text comes first in the DOM; the visual is moved up on mobile with CSS. */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="overflow-x-clip bg-background-light-yellow pt-15 pb-16 lg:py-[100px]"
    >
      <Container className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-15">
        <div className="flex flex-col lg:min-w-0 lg:flex-1">
          <SectionHeading
            id="hero-title"
            level={1}
            size="h1"
            eyebrow={hero.eyebrow}
            title={hero.title}
          />
          <p className="mt-6 text-subtitle-1 text-text-secondary lg:max-w-[480px]">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <ButtonLink href={hero.primaryCta.href} block="mobile" className="max-md:text-base">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="outline"
              block="mobile"
              className="max-md:text-base"
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>

          <div className="mt-16 flex items-center justify-center gap-3 md:mt-8 md:justify-start">
            <AvatarStack avatars={hero.avatars} />
            <p className="text-sm leading-6 text-text-secondary max-md:text-base">
              <strong className="font-bold text-text-primary">{hero.trust.strong}</strong>{" "}
              {hero.trust.rest}
            </p>
          </div>
        </div>

        <div className="relative order-first mx-auto w-full max-w-[500px] lg:order-none lg:w-[500px] lg:shrink-0">
          <div
            aria-hidden="true"
            className="absolute top-[6%] -right-[18px] h-[89%] w-[18%] rounded-2xl bg-background-orange lg:top-6 lg:-right-[39px] lg:h-[468px] lg:w-[89px]"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[3%] -left-[10px] size-16 rounded-full bg-primary-blue-light lg:bottom-[11px] lg:-left-[45px] lg:size-[106px]"
          />

          <div className="relative mx-2 aspect-[346/380] overflow-hidden rounded-3xl bg-primary-blue-light lg:mx-0 lg:aspect-[500/520]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 500px, (min-width: 516px) 484px, calc(100vw - 56px)"
              className="object-cover"
            />
          </div>

          <p className={`${badgeClass} top-1.5 -left-0 gap-3 lg:top-4 lg:-left-[22px]`}>
            <span className="flex h-8 items-center rounded-lg bg-primary-blue-light px-1 font-bold text-primary-blue">
              {hero.coursesBadge.value}
            </span>
            <span>{hero.coursesBadge.label}</span>
          </p>

          <p
            className={`${badgeClass} -right-[11px] bottom-9 gap-2 lg:-right-[57px] lg:bottom-[35px]`}
          >
            <span
              data-testid="rating-stars"
              aria-hidden="true"
              className="flex gap-0.5 text-secondary-yellow"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className="size-3.5" />
              ))}
            </span>
            <span aria-hidden="true">
              {hero.rating.value} {hero.rating.label}
            </span>
            <span className="sr-only">{hero.rating.srLabel}</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
