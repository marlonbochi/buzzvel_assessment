import { Container } from "@/components/ui/Container";
import { footer } from "@/content";
import { Logo } from "./Logo";

/** Site footer (Figma 2:384 desktop, 2:4544 mobile). */
export function Footer() {
  return (
    <footer className="bg-background-darkblue pt-15 pb-8 text-text-white-tertiary lg:pt-20 lg:pb-10">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-[1fr_repeat(3,208px)] lg:grid-cols-[416px_repeat(3,208px)]">
          <div className="col-span-2 md:col-span-1">
            <Logo tone="light" />
            <p className="mt-3 max-w-[280px] text-base leading-6 lg:max-w-[240px]">
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
                      className="inline-block rounded-sm py-0.5 text-base leading-6 transition-colors duration-200 hover:text-text-white-primary focus-visible:text-text-white-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-text-white-tertiary/40 pt-8 lg:mt-14">
          <p className="text-center text-sm leading-6 text-text-white-secondary md:text-left">
            {footer.copyright}
          </p>
        </div>
      </Container>
    </footer>
  );
}
