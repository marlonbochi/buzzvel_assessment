import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { ChatIcon, ClockIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactInfo, contactSection } from "@/content";

const icons = { chat: ChatIcon, clock: ClockIcon } as const;

/** Contact section (Figma 19:77 desktop, 21:52 mobile). */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-background-white py-16 lg:py-[100px]"
    >
      <Container className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-15">
        <div className="flex flex-col gap-8 lg:w-[480px] lg:shrink-0 lg:gap-10">
          <SectionHeading
            id="contact-title"
            eyebrow={contactSection.eyebrow}
            title={contactSection.title}
            description={contactSection.description}
            size="h3"
          />
          <ul className="flex flex-col gap-4">
            {contactInfo.map((item) => {
              const Icon = icons[item.icon];
              return (
                <li
                  key={item.title}
                  className="flex items-center gap-4 rounded-xl bg-background-light-yellow p-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-blue-light text-primary-blue">
                    <Icon className={item.icon === "chat" ? "size-6" : "size-5"} />
                  </span>
                  <div className="flex min-w-0 flex-col gap-1 text-sm leading-6">
                    <p className="text-text-primary">{item.title}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="rounded-sm break-all text-primary-blue underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p className="text-text-tertiary-strong">{item.text}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="w-full rounded-2xl border border-line-1 bg-background-white p-6 shadow-[0_12px_16px_rgba(23,27,44,0.04)] sm:p-10 lg:w-[540px] lg:shrink-0">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
