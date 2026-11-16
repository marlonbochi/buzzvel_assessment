"use client";

import { useEffect } from "react";

/**
 * Turns on smooth scrolling only once the page has loaded. With `scroll-behavior: smooth` set from
 * the start, browsers also animate the jump to the URL's #fragment on load and reload, so opening
 * /#people would scroll through the whole page instead of landing on the section.
 * The CSS side lives in globals.css (`html[data-smooth-scroll]`, no-preference only).
 */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const enable = () => {
      frame = requestAnimationFrame(() => {
        root.dataset.smoothScroll = "";
      });
    };
    if (document.readyState === "complete") enable();
    else window.addEventListener("load", enable, { once: true });
    return () => {
      window.removeEventListener("load", enable);
      cancelAnimationFrame(frame);
      delete root.dataset.smoothScroll;
    };
  }, []);
  return null;
}
