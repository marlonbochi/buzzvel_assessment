import { avatars } from "./avatars";
import type { ImageAsset, Link } from "./types";

export const finalCta: {
  title: string;
  description: string;
  avatars: ImageAsset[];
  primaryCta: Link;
  secondaryCta: Link;
} = {
  title: "What will you learn next?",
  description: "Start with one course. Build from there.",
  avatars: [avatars.maya, avatars.daniel, avatars.arjun, avatars.sofia],
  primaryCta: { label: "Explore all courses", href: "#courses" },
  secondaryCta: { label: "Join Luma", href: "#" },
};
