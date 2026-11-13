import type { ButtonHTMLAttributes } from "react";
import {
  buttonClasses,
  type ButtonBlock,
  type ButtonSize,
  type ButtonVariant,
} from "./button-styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: ButtonBlock;
  /** Shows `pendingLabel`, disables the button and sets aria-busy. */
  pending?: boolean;
  pendingLabel?: string;
};

export function Button({
  variant,
  size,
  block,
  pending = false,
  pendingLabel,
  className,
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...props}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
