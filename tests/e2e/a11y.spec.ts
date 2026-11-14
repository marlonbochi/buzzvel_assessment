import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, isDesktop, press, test } from "./fixtures";

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

test("the page has no serious or critical axe violations", async ({ page }) => {
  await page.goto("/");
  expect(await seriousViolations(page)).toEqual([]);
});

test("the open mobile menu has no serious or critical violations", async ({ page }, testInfo) => {
  test.skip(isDesktop(testInfo.project.name), "The hamburger menu only exists below lg");
  await page.goto("/");
  await press(page.getByRole("button", { name: "Open menu" }), testInfo.project.use.hasTouch);
  const menu = page.getByRole("navigation", { name: "Mobile" });
  await expect(menu).toBeVisible();
  // Let the fade-in finish: axe would otherwise sample blended, semi-transparent colors.
  await expect
    .poll(() => menu.locator("xpath=..").evaluate((el) => getComputedStyle(el).opacity))
    .toBe("1");
  expect(await seriousViolations(page)).toEqual([]);
});

test("the form error state has no serious or critical violations", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Please enter your full name.")).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});
