import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { howItWorksSection, steps } from "@/content";
import { StepIllustration } from "./StepIllustration";

/**
 * Three steps joined by a 1px connector (Figma 2:238 desktop, 2:4405 mobile):
 * horizontal behind the icons from md up, vertical segments between steps on mobile.
 */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="bg-background-light-yellow py-16 lg:py-[100px]"
    >
      <Container>
        <SectionHeading
          id="how-it-works-title"
          align="center"
          size="h3"
          eyebrow={howItWorksSection.eyebrow}
          title={howItWorksSection.title}
        />

        <div className="relative mt-12 md:mt-20 md:py-7">
          {/* Spans icon 1 centre → icon 3 centre: 28px + 2 columns + 2 gaps. */}
          <div
            aria-hidden="true"
            className="absolute top-[56.5px] left-7 hidden h-px w-[calc((100%-80px)*2/3+80px)] bg-line-1 md:block lg:w-[calc((100%-160px)*2/3+160px)]"
          />
          <ol className="relative grid gap-0 md:grid-cols-3 md:gap-10 lg:gap-20">
            {steps.map((step, index) => (
              <li
                key={step.label}
                className={
                  index > 0
                    ? "relative mt-7.5 pt-12 before:absolute before:top-0 before:left-7 before:h-12 before:w-px before:bg-line-1 md:mt-0 md:pt-0 md:before:hidden"
                    : "relative"
                }
              >
                <StepIllustration icon={step.icon} />
                <p className="pt-6 text-overline text-text-tertiary-strong">{step.label}</p>
                <h3 className="pt-2 text-h5 text-text-primary">{step.title}</h3>
                <p className="pt-3 text-subtitle-2 text-text-secondary">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
