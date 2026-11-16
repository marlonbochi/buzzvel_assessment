import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// next/font is a compile-time transform; in unit tests we only need the CSS variable names.
vi.mock("@/lib/fonts", () => ({
  jakarta: { variable: "font-jakarta-variable", className: "" },
  inter: { variable: "font-inter-variable", className: "" },
}));

/**
 * Controllable matchMedia: tests call `setMediaMatches(true)` to simulate crossing a breakpoint.
 */
type Listener = (event: MediaQueryListEvent) => void;
const listeners = new Set<{ query: string; listener: Listener }>();
let matches = false;

export function setMediaMatches(next: boolean) {
  matches = next;
  for (const { query, listener } of listeners) {
    listener({ matches: next, media: query } as MediaQueryListEvent);
  }
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string): MediaQueryList =>
    ({
      get matches() {
        return matches;
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: Listener) => listeners.add({ query, listener }),
      removeEventListener: (_type: string, listener: Listener) => {
        for (const entry of listeners) if (entry.listener === listener) listeners.delete(entry);
      },
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList,
});

afterEach(() => {
  cleanup();
  matches = false;
  listeners.clear();
  document.body.style.overflow = "";
  window.location.hash = "";
});
