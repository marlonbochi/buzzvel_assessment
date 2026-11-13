import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type ChipProps = {
  tone?: "blue-light" | "outline-white";
  className?: string;
  children: ReactNode;
};

const tones = {
  // Category number chips (Figma 2:100): blue text on light blue.
  "blue-light":
    "rounded-md bg-primary-blue-light px-2 py-1 text-sm font-semibold tracking-[2px] text-primary-blue",
  // Featured course meta (Figma 2:193): white outline on blue.
  "outline-white":
    "rounded-lg border border-white/80 px-4 py-2 text-sm text-text-white-primary lg:text-base",
} as const;

export function Chip({ tone = "blue-light", className, children }: ChipProps) {
  return (
    <span className={cx("inline-flex items-center leading-6", tones[tone], className)}>
      {children}
    </span>
  );
}
