import { test as base, expect, type Locator, type Page } from "@playwright/test";

/**
 * Every test fails if the page logs a console error, throws, or gets a 4xx/5xx response
 * (for example a missing image) — spec §11 item 2h.
 */
export const test = base.extend<{ health: void }>({
  health: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") problems.push(`console: ${msg.text()}`);
      });
      page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
      page.on("response", (response) => {
        if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`);
      });
      await use();
      expect(problems, "console errors, page errors or failed requests").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Section labels in design order (each <section> is a labelled region). */
export const SECTION_NAMES = [
  "Build skills that actually move you forward.",
  "Learn something worth knowing.",
  "Designing products people understand.",
  "Less browsing. More learning.",
  "What learners say",
  "Meet international students & teachers",
  "Get in touch",
  "What will you learn next?",
] as const;

export const HEADER_HEIGHT = 70;

/** Presses Tab until `target` is focused (keyboard focus, so :focus-visible applies). */
export async function tabTo(page: Page, target: Locator, maxTabs = 80) {
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error("Could not reach the target element with Tab");
}

/** Taps on touch projects, clicks elsewhere. */
export async function press(locator: Locator, hasTouch: boolean | undefined) {
  if (hasTouch) await locator.tap();
  else await locator.click();
}

export const isDesktop = (projectName: string) => projectName === "desktop";
