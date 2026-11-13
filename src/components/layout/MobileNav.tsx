"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { Link } from "@/content";
import { buttonClasses } from "@/components/ui/button-styles";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

type MobileNavProps = { links: Link[]; login: Link; cta: Link };

const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Hamburger menu for mobile and tablet (hidden from lg up by the Header).
 * The design has no open state; this panel is our call (spec §7.1).
 */
export function MobileNav({ links, login, cta }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Escape closes from anywhere while open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Lock page scroll behind the open panel.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // The panel has no meaning on desktop: close it when the viewport crosses lg.
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Keep Tab / Shift+Tab cycling between the toggle and the panel's links.
  const onKeyDownTrap = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!open || event.key !== "Tab") return;
    const items = panelRef.current?.querySelectorAll<HTMLElement>("a[href]");
    const last = items?.[items.length - 1];
    const toggle = toggleRef.current;
    if (!last || !toggle) return;
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      toggle.focus();
    } else if (event.shiftKey && document.activeElement === toggle) {
      event.preventDefault();
      last.focus();
    }
  };

  const linkClass =
    "block rounded-md px-1 py-3 text-base leading-6 text-text-primary hover:text-primary-blue " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue";

  return (
    <div className="lg:hidden" onKeyDown={onKeyDownTrap}>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="relative z-10 -mr-1.5 inline-flex size-9 items-center justify-center rounded-md text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-[69px] bottom-0 bg-text-primary/30 transition-opacity duration-200 starting:opacity-0"
          onClick={() => close(false)}
        />
      )}

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-69px)] overflow-y-auto border-b border-line-1 bg-background-light-yellow shadow-card transition-[opacity,translate,display] transition-discrete duration-200 starting:-translate-y-2 starting:opacity-0"
      >
        <nav aria-label="Mobile" className="px-5 pt-2 pb-6 md:px-10">
          <ul className="divide-y divide-line-1">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={linkClass} onClick={() => close(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={login.href}
              onClick={() => close(false)}
              className={buttonClasses({ variant: "outline", block: "always" })}
            >
              {login.label}
            </a>
            <a
              href={cta.href}
              onClick={() => close(false)}
              className={buttonClasses({ variant: "primary", block: "always" })}
            >
              {cta.label}
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
