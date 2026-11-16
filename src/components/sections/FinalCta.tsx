import Image from "next/image";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { finalCta } from "@/content";

/**
 * Decorative shapes positioned from Figma node 2:352 (1280px frame). Horizontal positions are
 * percentages so they spread with the viewport; most are hidden below md to keep text legible.
 */
const x = (px: number) => `${((px / 1280) * 100).toFixed(2)}%`;

function Decorations() {
  const ring = "absolute rounded-full border-2 border-background-orange";
  const disc = "absolute rounded-full bg-background-orange";
  const square = "absolute rotate-12 rounded-lg";
  return (
    <div
      data-testid="cta-decorations"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className={`${ring} size-[108px] max-md:-left-10`} style={{ left: x(22), top: 16 }} />
      <div className={`${disc} size-[120px] max-md:hidden`} style={{ left: x(56), top: 373 }} />
      <div className={`${disc} size-10 max-md:hidden`} style={{ left: x(1064), top: 468 }} />
      <div
        className={`${square} size-[115px] bg-background-orange max-md:-right-16 max-md:left-auto`}
        style={{ left: x(1154), top: -13 }}
      />
      <div
        className={`${square} size-14 bg-background-orange max-md:hidden`}
        style={{ left: -28, top: 235 }}
      />
      <div className={`${ring} size-8 max-md:hidden`} style={{ left: x(1208), top: 429 }} />
      <div className={`${ring} size-8 max-md:hidden`} style={{ left: x(877), top: 43 }} />
      <div
        className={`${square} size-14 border border-background-orange max-md:hidden`}
        style={{ left: x(322), top: 47 }}
      />
      <Image
        src="/images/cta/drop.svg"
        alt=""
        width={83}
        height={83}
        unoptimized
        className="absolute rotate-[15deg] max-md:hidden"
        style={{ left: x(281), top: 369 }}
      />
      <Image
        src="/images/cta/cube.svg"
        alt=""
        width={160}
        height={160}
        unoptimized
        className="absolute max-lg:hidden"
        style={{ left: x(1080), top: 180 }}
      />
      <Image
        src="/images/cta/bubble.svg"
        alt=""
        width={32}
        height={32}
        unoptimized
        className="absolute max-md:hidden"
        style={{ left: x(141), top: 214 }}
      />
      <Image
        src="/images/cta/sun.svg"
        alt=""
        width={61}
        height={61}
        unoptimized
        className="absolute max-md:hidden"
        style={{ left: x(1016), top: 82 }}
      />
      <Image
        src="/images/cta/card.svg"
        alt=""
        width={48}
        height={48}
        unoptimized
        className="absolute max-md:hidden"
        style={{ left: x(963), top: 381 }}
      />
    </div>
  );
}

/** Closing call to action (Figma 2:352 desktop, 2:4517 mobile). */
export function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="relative overflow-hidden bg-background-yellow py-15 lg:py-[100px]"
    >
      <Decorations />
      <Container className="relative flex flex-col items-center text-center">
        <AvatarStack avatars={finalCta.avatars} size={40} ring="yellow" />
        <h2 id="final-cta-title" className="mt-8 text-h2 text-text-primary">
          {finalCta.title}
        </h2>
        <p className="mt-4 text-subtitle-1 text-text-secondary">{finalCta.description}</p>
        <div className="mt-10 flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <ButtonLink href={finalCta.primaryCta.href} block="mobile">
            {finalCta.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={finalCta.secondaryCta.href} variant="outline" block="mobile">
            {finalCta.secondaryCta.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
