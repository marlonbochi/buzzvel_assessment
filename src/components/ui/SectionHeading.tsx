import { cx } from "@/lib/cx";
import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  level?: 1 | 2;
  align?: "left" | "center";
  tone?: "dark" | "light";
  size?: "h1" | "h2" | "h3";
  className?: string;
};

const sizeClass = { h1: "text-h1", h2: "text-h2", h3: "text-h3" } as const;

/** Eyebrow + heading + optional description. Visual size is independent of the heading level. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  level = 2,
  align = "left",
  tone = "dark",
  size = "h2",
  className,
}: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : "h2";
  const light = tone === "light";

  return (
    <div className={cx(align === "center" && "text-center", className)}>
      {eyebrow && <Eyebrow tone={light ? "white" : "blue"}>{eyebrow}</Eyebrow>}
      <Heading
        id={id}
        className={cx(
          sizeClass[size],
          eyebrow && "mt-4",
          light ? "text-text-white-primary" : "text-text-primary",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cx(
            "mt-4 text-subtitle-1",
            light ? "text-text-white-secondary" : "text-text-secondary",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
