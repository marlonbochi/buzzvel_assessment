import type { AnchorHTMLAttributes } from "react";
import {
  buttonClasses,
  type ButtonBlock,
  type ButtonSize,
  type ButtonVariant,
} from "./button-styles";
import { ArrowRightIcon } from "./icons";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: ButtonBlock;
  withArrow?: boolean;
};

/**
 * In-page and placeholder links are plain anchors (no next/link): every target on this
 * single-page site is a hash, so client-side routing would add JS without benefit.
 */
export function ButtonLink({
  variant,
  size,
  block,
  withArrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={buttonClasses({
        variant,
        size,
        block,
        className: withArrow ? `group ${className ?? ""}` : className,
      })}
      {...props}
    >
      {children}
      {withArrow && (
        <ArrowRightIcon className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
      )}
    </a>
  );
}
