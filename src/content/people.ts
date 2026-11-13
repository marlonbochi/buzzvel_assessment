import type { ImageAsset, Link } from "./types";

const photo = (n: string, alt: string, width: number, height: number): ImageAsset => ({
  src: `/images/people/${n}.jpg`,
  alt,
  width,
  height,
});

/**
 * Photos are ordered by collage column (top to bottom), matching Figma node 4:1137.
 * Width/height are the intrinsic size of the optimized file.
 */
export const people: {
  eyebrow: string;
  title: string;
  description: string;
  cta: Link;
  photos: ImageAsset[];
} = {
  eyebrow: "The people",
  title: "Meet international students & teachers",
  // Placeholder copy kept as designed (spec §5 #4).
  description:
    "Morbi sit egestas dignissim pharetra, sed amet. Tempus justo senectus risus ac vel, velit, nunc. Eget commodo eget in aliquam facilisi facilisi nec magna hendrerit. Placerat ipsum sit tellus urna, faucibus aenean lorem faucibus integer.",
  cta: { label: "Explore teachers and students", href: "#people" },
  photos: [
    photo("01", "Young student raising her hand during an online class", 257, 385),
    photo("02", "Three students studying together around a laptop", 345, 518),
    photo("03", "Student in a hoodie reading a book in a library", 257, 425),
    photo("04", "Teacher and student practicing music by a window", 257, 431),
    photo("05", "Student taking notes from a book next to his laptop", 257, 321),
    photo("06", "Graduate in cap and gown holding a diploma", 257, 343),
    photo("07", "Woman studying on a laptop at a home desk", 257, 345),
    photo("08", "Teacher giving a lesson on a video call", 257, 385),
    photo("09", "Smiling student holding notebooks outdoors", 321, 512),
    photo("10", "Student in a hijab holding a coffee cup on campus", 257, 331),
  ],
};
