import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// next/font is a compile-time transform; in unit tests we only need the CSS variable names.
vi.mock("@/lib/fonts", () => ({
  jakarta: { variable: "font-jakarta-variable", className: "" },
  inter: { variable: "font-inter-variable", className: "" },
}));

afterEach(() => {
  cleanup();
});
