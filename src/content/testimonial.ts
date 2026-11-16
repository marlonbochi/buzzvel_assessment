import type { ImageAsset, Stat } from "./types";

export const testimonial: { quote: string; name: string; role: string; avatar: ImageAsset } = {
  quote:
    "The lessons are short enough to fit into my week, but detailed enough that I actually leave with something I can use.",
  name: "Alex Morgan",
  role: "Product Manager",
  avatar: {
    src: "/images/testimonial/alex-morgan.jpg",
    alt: "Portrait of Alex Morgan",
    width: 200,
    height: 200,
  },
};

export const stats: Stat[] = [
  { value: "24K+", label: "active learners" },
  { value: "120+", label: "expert-led courses" },
  { value: "92%", label: "complete their first course" },
];
