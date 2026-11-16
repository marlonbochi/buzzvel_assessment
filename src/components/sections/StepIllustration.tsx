import type { StepIcon } from "@/content";

/** Decorative step markers drawn with CSS shapes (Figma 2:252, 17:196, 17:200). */
export function StepIllustration({ icon }: { icon: StepIcon }) {
  return (
    <div data-testid="step-illustration" aria-hidden="true" className="relative size-14 shrink-0">
      {icon === "focus" && (
        <div className="size-14 rounded-full bg-primary-blue-light">
          <div className="absolute top-2 left-2 size-6 rounded-md bg-primary-blue" />
        </div>
      )}
      {icon === "experience" && (
        <>
          <div className="size-14 rotate-12 rounded-lg bg-background-orange" />
          <div className="absolute top-6 left-6 size-7 rounded-full bg-primary-orange" />
        </>
      )}
      {icon === "practice" && (
        <div className="size-14 rounded-xl bg-background-yellow">
          <div className="absolute top-7 left-2 size-5 rounded-full bg-[#e9d659]" />
        </div>
      )}
    </div>
  );
}
