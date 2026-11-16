import { avatars } from "./avatars";
import type { ImageAsset, Link } from "./types";

export const hero: {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: Link;
  secondaryCta: Link;
  avatars: ImageAsset[];
  trust: { strong: string; rest: string };
  image: ImageAsset;
  coursesBadge: { value: string; label: string };
  rating: { value: string; label: string; srLabel: string };
} = {
  eyebrow: "Learn at your own pace",
  title: "Build skills that actually move you forward.",
  description:
    "Practical courses taught by people who do the work every day. Learn design, technology, business and more — one focused lesson at a time.",
  primaryCta: { label: "Explore courses", href: "#courses" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  avatars: [avatars.maya, avatars.daniel, avatars.arjun],
  trust: { strong: "Trusted by 24,000+", rest: "learners" },
  image: {
    src: "/images/hero/learner-laptop.jpg",
    alt: "Smiling woman with glasses studying at her laptop in a bright office",
    width: 900,
    height: 1100,
  },
  coursesBadge: { value: "120+", label: "expert-led courses" },
  rating: { value: "4.9", label: "avg rating", srLabel: "Rated 4.9 out of 5" },
};
