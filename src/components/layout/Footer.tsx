import { Container } from "@/components/ui/Container";
import { footer } from "@/content";
import { Logo } from "./Logo";

/** Site footer (Figma 2:384 desktop, 2:4544 mobile). */
export function Footer() {
  return (
    <footer className="bg-background-darkblue pt-15 pb-5 text-text-white-tertiary lg:pt-20 lg:pb-[37px]">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] lg:grid-cols-[minmax(0,416px)_repeat(3,minmax(0,208px))] lg:justify-between lg:gap-y-12">
          <div className="col-span-2 md:col-span-1">
            <Logo tone="light" />
            <p className="mt-1.5 max-w-[280px] text-sm leading-6 lg:max-w-[240px]">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-labelledby={`footer-${column.title.toLowerCase()}`}>
              <h2
                id={`footer-${column.title.toLowerCase()}`}
                className="text-overline text-text-white-primary"
              >
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-block rounded-sm py-0.5 text-sm leading-6 transition-colors duration-200 hover:text-text-white-primary focus-visible:text-text-white-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-8 border-t border-text-white-tertiary/40 pt-6 lg:mt-[62px] lg:pt-[22px]">
          <p className="text-center text-sm leading-6 text-text-white-secondary md:text-left">
            {footer.copyright}
          </p>
        </div>
      </Container>
    </footer>
  );
}
