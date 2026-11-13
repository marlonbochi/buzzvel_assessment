import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "outline" | "yellow" | "text";
export type ButtonSize = "md" | "lg";
export type ButtonBlock = "always" | "mobile" | "never";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-inter font-bold whitespace-nowrap " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 motion-reduce:transition-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-70";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-blue text-text-white-primary hover:bg-[#2546dc] active:bg-[#1f3cc4] focus-visible:outline-primary-blue",
  outline:
    "border border-line-1 bg-background-white text-text-primary hover:border-text-primary/40 hover:bg-background-light-yellow focus-visible:outline-primary-blue",
  yellow:
    "bg-secondary-yellow text-text-primary hover:bg-[#ffe75a] active:bg-[#f5dc4a] focus-visible:outline-secondary-yellow",
  text: "rounded-sm text-current hover:underline underline-offset-4 focus-visible:outline-current",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-7 py-3.5 text-sm leading-6",
  lg: "px-7 py-3.5 text-base leading-6",
};

const blocks: Record<ButtonBlock, string> = {
  always: "w-full",
  mobile: "w-full md:w-auto",
  never: "",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  block = "never",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: ButtonBlock;
  className?: string;
} = {}): string {
  return cx(
    base,
    variants[variant],
    // The text variant has no box: padding would misalign it with surrounding text.
    variant === "text" ? sizes[size].replace("px-7 py-3.5 ", "") : sizes[size],
    blocks[block],
    className,
  );
}
