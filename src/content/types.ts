export type Link = { label: string; href: string };

export type ImageAsset = { src: string; alt: string; width: number; height: number };

export type Category = { number: string; title: string; description: string; href: string };

export type StepIcon = "focus" | "experience" | "practice";

export type Step = { label: string; title: string; description: string; icon: StepIcon };

export type Stat = { value: string; label: string };

export type FooterColumn = { title: string; links: Link[] };

export type ContactInfoItem = {
  icon: "chat" | "clock";
  title: string;
  text: string;
  href?: string;
};
