import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Icons are decorative by default; pass aria-hidden={false} + a title when one carries meaning. */
function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path
        d="M3 7H21M3 12H21M3 17H21"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path
        d="M4 10H16M11 15L16 10L11 5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" {...props}>
      <path
        d="M7 1L8.54 4.12L12 4.76L9.5 7.19L10.09 10.63L7 8.77L3.91 10.63L4.5 7.19L2 4.76L5.46 4.12L7 1Z"
        fill="currentColor"
      />
    </Svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12.5C8.27614 12.5 8.5 12.2761 8.5 12C8.5 11.7239 8.27614 11.5 8 11.5C7.72386 11.5 7.5 11.7239 7.5 12C7.5 12.2761 7.72386 12.5 8 12.5ZM12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5ZM16 12.5C16.2761 12.5 16.5 12.2761 16.5 12C16.5 11.7239 16.2761 11.5 16 11.5C15.7239 11.5 15.5 11.7239 15.5 12C15.5 12.2761 15.7239 12.5 16 12.5Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path
        d="M10 4.9996V10L13.3336 11.6668M18.334 10C18.334 14.6027 14.6027 18.334 10 18.334C5.39726 18.334 1.666 14.6027 1.666 10C1.666 5.39726 5.39726 1.666 10 1.666C14.6027 1.666 18.334 5.39726 18.334 10Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function QuoteIcon(props: IconProps) {
  return (
    <Svg width={24} height={22} viewBox="0 0 23.7109 21.9531" {...props}>
      <path
        d="M23.7109 4.375C23.7109 5.41667 23.3724 7.42188 22.6953 10.3906C22.0182 13.3594 21.263 17.2135 20.4297 21.9531H18.0078C17.4089 18.099 16.7318 14.4271 15.9766 10.9375C15.2474 7.44792 14.8828 5.26042 14.8828 4.375C14.8828 3.17708 15.2474 2.14844 15.9766 1.28906C16.7057 0.429688 17.8125 0 19.2969 0C20.7292 0 21.8229 0.429688 22.5781 1.28906C23.3333 2.14844 23.7109 3.17708 23.7109 4.375ZM8.78906 4.375C8.78906 5.41667 8.45052 7.42188 7.77344 10.3906C7.09635 13.3594 6.34115 17.2135 5.50781 21.9531H3.125C2.42188 17.526 1.71875 13.75 1.01562 10.625C0.338542 7.47396 0 5.39062 0 4.375C0 3.17708 0.364583 2.14844 1.09375 1.28906C1.82292 0.429688 2.92969 0 4.41406 0C5.82031 0 6.90104 0.429688 7.65625 1.28906C8.41146 2.14844 8.78906 3.17708 8.78906 4.375Z"
        fill="currentColor"
      />
    </Svg>
  );
}
