import { headerActions, primaryNav } from "@/content";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/button-styles";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

const navLinkClass =
  "rounded-sm text-sm leading-6 text-text-secondary transition-colors duration-200 hover:text-text-primary " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-blue motion-reduce:transition-none";

/** Sticky site header (Figma 15:116 desktop, 2:4199 mobile). */
export function Header() {
  return (
    <header
      id="top"
      className="sticky top-0 z-40 border-b border-line-1 bg-background-light-yellow"
    >
      <Container className="flex h-[68px] items-center justify-between lg:h-[69px]">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={navLinkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={headerActions.login.href} className={`${navLinkClass} px-4 py-2.5`}>
            {headerActions.login.label}
          </a>
          <a
            href={headerActions.cta.href}
            className={buttonClasses({ variant: "primary", className: "px-5 py-2.5" })}
          >
            {headerActions.cta.label}
          </a>
        </div>

        <MobileNav links={primaryNav} login={headerActions.login} cta={headerActions.cta} />
      </Container>
    </header>
  );
}
