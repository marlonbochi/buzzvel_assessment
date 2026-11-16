import type { Step } from "./types";

export const howItWorksSection = {
  eyebrow: "How Luma works",
  title: "Less browsing. More learning.",
};

/** Desktop Figma labels all steps "STEP 01"; mobile is correct (spec §5 #1). */
export const steps: Step[] = [
  {
    label: "STEP 01",
    title: "Choose your focus",
    description:
      "Find courses based on the skill you want to build, not endless content categories.",
    icon: "focus",
  },
  {
    label: "STEP 02",
    title: "Learn from experience",
    description: "Follow concise lessons created by professionals who use these skills.",
    icon: "experience",
  },
  {
    label: "STEP 03",
    title: "Put it into practice",
    description:
      "Every course includes practical exercises designed to turn knowledge into action.",
    icon: "practice",
  },
];
