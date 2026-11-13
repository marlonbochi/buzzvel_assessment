import type { Preview } from "@storybook/nextjs-vite";
import { inter, jakarta } from "../src/lib/fonts";
import "../src/app/globals.css";

const viewport = (name: string, width: number, height: number) => ({
  name,
  styles: { width: `${width}px`, height: `${height}px` },
  type:
    width < 768 ? ("mobile" as const) : width < 1024 ? ("tablet" as const) : ("desktop" as const),
});

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    // Accessibility violations fail the story test (addon-vitest).
    a11y: { test: "error" },
    viewport: {
      options: {
        mobile: viewport("Mobile (375)", 375, 812),
        tablet: viewport("Tablet (768)", 768, 1024),
        desktop: viewport("Desktop (1280)", 1280, 800),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={`${jakarta.variable} ${inter.variable} font-inter text-text-primary`}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
