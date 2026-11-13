import { Inter, Plus_Jakarta_Sans } from "next/font/google";

/** Headings and quotes (Figma: Plus Jakarta Sans 600/700/800). Variable font, one file. */
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-next-jakarta",
});

/** Body copy, overlines and buttons (Figma: Inter 400/600/700). Variable font, one file. */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-next-inter",
});
