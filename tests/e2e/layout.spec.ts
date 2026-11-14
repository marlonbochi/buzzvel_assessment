import { expect, HEADER_HEIGHT, isDesktop, SECTION_NAMES, test } from "./fixtures";

const overflowX = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("all sections render in design order between header and footer", async ({ page }) => {
  await expect(page.getByRole("banner")).toBeVisible();
  let previousY = -1;
  for (const name of SECTION_NAMES) {
    const region = page.getByRole("region", { name, exact: true });
    await expect(region).toHaveCount(1);
    const box = await region.boundingBox();
    expect(box!.y, `${name} comes after the previous section`).toBeGreaterThan(previousY);
    previousY = box!.y;
  }
  const footer = page.getByRole("contentinfo");
  expect((await footer.boundingBox())!.y).toBeGreaterThan(previousY);
});

test("has exactly one h1 and the expected metadata", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page).toHaveTitle("Luma — Build skills that actually move you forward");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Practical courses taught by people who do the work/,
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("never scrolls horizontally, from 320px to 1440px", async ({ page }) => {
  expect(await overflowX(page)).toBe(0);
  for (const width of [320, 1024, 1100, 1152, 1200, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await overflowX(page), `overflow at ${width}px`).toBe(0);
  }
});

test("Review Focus 5: 200% zoom on desktop (640px) does not overflow and uses the hamburger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 800 });
  expect(await overflowX(page)).toBe(0);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
});

test("shows the right navigation for the breakpoint", async ({ page }, testInfo) => {
  const primary = page.getByRole("navigation", { name: "Primary" });
  const toggle = page.getByRole("button", { name: "Open menu" });
  if (isDesktop(testInfo.project.name)) {
    await expect(primary).toBeVisible();
    await expect(toggle).toBeHidden();
  } else {
    await expect(primary).toBeHidden();
    await expect(toggle).toBeVisible();
  }
  expect((await page.getByRole("banner").boundingBox())!.height).toBeLessThanOrEqual(HEADER_HEIGHT);
});
