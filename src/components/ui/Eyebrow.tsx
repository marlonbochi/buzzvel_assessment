import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type EyebrowProps = { tone?: "blue" | "white"; className?: string; children: ReactNode };

export function Eyebrow({ tone = "blue", className, children }: EyebrowProps) {
  return (
    <p
      className={cx(
        "text-overline",
        tone === "blue" ? "text-primary-blue" : "text-text-white-primary",
        className,
      )}
    >
      {children}
    </p>
  );
}
