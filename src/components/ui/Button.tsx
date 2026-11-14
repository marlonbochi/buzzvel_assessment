import type { ButtonHTMLAttributes, Ref } from "react";
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
  /**
   * Shows `pendingLabel` and sets aria-busy + aria-disabled. The button is deliberately not
   * natively disabled while pending: that would drop keyboard focus to <body>. The owner must
   * ignore activations while pending (ContactForm does in its submit handler).
   */
  pending?: boolean;
  pendingLabel?: string;
  ref?: Ref<HTMLButtonElement>;
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
      disabled={disabled}
      aria-disabled={pending || undefined}
      aria-busy={pending || undefined}
      {...props}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
