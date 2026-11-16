import type { ContactInfoItem } from "./types";

export const contactSection = {
  eyebrow: "Contact",
  title: "Get in touch",
  description:
    "Have a question? We’re here to help. Whether you’re looking for the right course, learning with your team or interested in teaching with Luma, we’d love to hear from you.",
};

export const contactInfo: ContactInfoItem[] = [
  { icon: "chat", title: "Email", text: "contact@luma.com", href: "mailto:contact@luma.com" },
  { icon: "clock", title: "Response Time", text: "Up to 24 hours on business days" },
];

/** Desktop English copy is used on every breakpoint (spec §5 #2). */
export const contactForm = {
  title: "Contact us",
  description: "Fill out the fields and we will get in touch.",
  fields: {
    name: { label: "Full name", placeholder: "Your name" },
    email: { label: "Email", placeholder: "youremail@example.com" },
    question: { label: "Your question", placeholder: "Tell us how we can help..." },
  },
  submit: "Send message",
  pending: "Sending…",
};
