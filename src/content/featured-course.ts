import type { ImageAsset, Link } from "./types";

export const featuredCourse: {
  tag: string;
  eyebrow: string;
  title: string;
  description: string;
  instructor: string;
  meta: string[];
  primaryCta: Link;
  secondaryCta: Link;
  image: ImageAsset;
} = {
  tag: "Featured course",
  eyebrow: "Most popular this month",
  title: "Designing products people understand.",
  description:
    "Learn how to turn complex workflows into simple, intentional product experiences through research, structure and thoughtful interaction design.",
  instructor: "with Maya Chen · Senior Product Designer",
  meta: ["8 lessons", "2h 40min", "Intermediate"],
  primaryCta: { label: "View course", href: "#" },
  secondaryCta: { label: "Browse all courses", href: "#courses" },
  image: {
    src: "/images/featured/design-workshop.jpg",
    alt: "Designer sketching product prototypes on a workbench covered with material samples",
    width: 700,
    height: 500,
  },
};
