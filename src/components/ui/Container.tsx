import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type ContainerProps = {
  as?: "div" | "section" | "header" | "footer";
  className?: string;
  children: ReactNode;
};

/** 1120px content width with 20px (mobile) / 80px (lg) side padding, per the Figma frames. */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return (
    <Tag className={cx("mx-auto w-full max-w-[1280px] px-5 lg:px-20", className)}>{children}</Tag>
  );
}
