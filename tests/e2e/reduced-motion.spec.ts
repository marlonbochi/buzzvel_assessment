import { expect, isDesktop, press, test } from "./fixtures";

test.use({ reducedMotion: "reduce" });

test("smooth scrolling is turned off", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    "auto",
  );
});

test("the mobile menu opens without a transition", async ({ page }, testInfo) => {
  test.skip(isDesktop(testInfo.project.name), "The hamburger menu only exists below lg");
  await page.goto("/");
  await press(page.getByRole("button", { name: "Open menu" }), testInfo.project.use.hasTouch);
  const panel = page.getByRole("navigation", { name: "Mobile" }).locator("xpath=..");
  const duration = await panel.evaluate((el) =>
    parseFloat(getComputedStyle(el).transitionDuration),
  );
  expect(duration).toBeLessThanOrEqual(0.00001);
});
