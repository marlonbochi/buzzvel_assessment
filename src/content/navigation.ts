import type { Link } from "./types";

/** Links without a matching section point to "#" placeholders (spec §7.11). */
export const primaryNav: Link[] = [
  { label: "Courses", href: "#courses" },
  { label: "For Teams", href: "#" },
  { label: "Community", href: "#people" },
  { label: "About", href: "#how-it-works" },
];

export const headerActions: { login: Link; cta: Link } = {
  login: { label: "Log in", href: "#" },
  cta: { label: "Start learning", href: "#" },
};
