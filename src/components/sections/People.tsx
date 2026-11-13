import Image from "next/image";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { people } from "@/content";

/**
 * Collage geometry from Figma node 4:1137 (530px wide). Every length is expressed in container
 * query units (cqw = 1% of the collage width) so the layout scales down proportionally on mobile.
 */
const FRAME = 530;
const cq = (px: number) => `${((px / FRAME) * 100).toFixed(3)}cqw`;

type Column = {
  paddingTop: number;
  align: "end" | "start";
  justify?: "center";
  slots: Array<{ photo: number; w: number; h: number }>;
};

const COLUMNS: Column[] = [
  {
    paddingTop: 64.2,
    align: "end",
    slots: [
      { photo: 0, w: 102.7, h: 154.1 },
      { photo: 1, w: 138, h: 207 },
    ],
  },
  {
    paddingTop: 25.7,
    align: "start",
    slots: [
      { photo: 2, w: 102.7, h: 170.1 },
      { photo: 3, w: 102.7, h: 172.5 },
      { photo: 4, w: 102.7, h: 128.4 },
    ],
  },
  {
    paddingTop: 0,
    align: "start",
    slots: [
      { photo: 5, w: 102.7, h: 137.2 },
      { photo: 6, w: 102.7, h: 138 },
      { photo: 7, w: 102.7, h: 154.1 },
    ],
  },
  {
    paddingTop: 0,
    align: "start",
    justify: "center",
    slots: [
      { photo: 8, w: 128.4, h: 204.6 },
      { photo: 9, w: 102.7, h: 132.4 },
    ],
  },
];

function Collage() {
  return (
    <div className="@container relative mx-auto w-full max-w-[530px]">
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 aspect-square w-[94.34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-blue-light"
      />
      <div className="relative flex items-center" style={{ gap: cq(16) }}>
        {COLUMNS.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={`flex flex-col ${column.align === "end" ? "items-end" : "items-start"} ${column.justify ? "justify-center" : ""}`}
            style={{ paddingTop: cq(column.paddingTop), gap: cq(12.84) } as CSSProperties}
          >
            {column.slots.map(({ photo, w, h }) => {
              const asset = people.photos[photo]!;
              return (
                <div
                  key={asset.src}
                  className="relative overflow-hidden rounded-[4px] bg-primary-blue-light shadow-[0_3.21px_4.815px_rgba(0,0,0,0.1),0_0_3.21px_rgba(0,0,0,0.07)]"
                  style={{ width: cq(w), height: cq(h) }}
                >
                  <Image
                    src={asset.src}
                    alt={asset.alt}
                    fill
                    sizes={`(min-width: 1024px) ${Math.round(w)}px, ${((w / FRAME) * 100).toFixed(1)}vw`}
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** "The people" section (Figma 4:1136 desktop, 4:1234 mobile). Text first on every breakpoint. */
export function People() {
  return (
    <section
      id="people"
      aria-labelledby="people-title"
      className="bg-background-light-yellow py-16 lg:py-[100px]"
    >
      <Container className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-15">
        <div className="flex flex-col items-start lg:w-[530px] lg:shrink-0">
          <SectionHeading
            id="people-title"
            eyebrow={people.eyebrow}
            title={people.title}
            size="h3"
            className="[&>h2]:mt-2"
          />
          <p className="mt-6 text-subtitle-1 text-text-secondary lg:mt-8">{people.description}</p>
          <ButtonLink href={people.cta.href} variant="outline" className="mt-8">
            {people.cta.label}
          </ButtonLink>
        </div>
        <div className="lg:min-w-0 lg:flex-1">
          <Collage />
        </div>
      </Container>
    </section>
  );
}
