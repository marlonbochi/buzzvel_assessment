import { expect, isDesktop, press, test } from "./fixtures";

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(isDesktop(testInfo.project.name), "The hamburger menu only exists below lg");
  await page.goto("/");
});

const bodyOverflow = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.body.style.overflow);

test("opens and closes with the toggle and locks page scroll while open", async ({
  page,
}, testInfo) => {
  const touch = testInfo.project.use.hasTouch;
  await press(page.getByRole("button", { name: "Open menu" }), touch);
  const toggle = page.getByRole("button", { name: "Close menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const menu = page.getByRole("navigation", { name: "Mobile" });
  for (const name of ["Courses", "For Teams", "Community", "About", "Log in", "Start learning"]) {
    await expect(menu.getByRole("link", { name })).toBeVisible();
  }
  expect(await bodyOverflow(page)).toBe("hidden");

  await press(toggle, touch);
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(menu).toBeHidden();
  expect(await bodyOverflow(page)).toBe("");
});

test("choosing a link closes the menu and scrolls to the section", async ({ page }, testInfo) => {
  await press(page.getByRole("button", { name: "Open menu" }), testInfo.project.use.hasTouch);
  await press(
    page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Community" }),
    testInfo.project.use.hasTouch,
  );
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  await expect(page).toHaveURL(/#people$/);
  await expect(
    page.getByRole("heading", { name: "Meet international students & teachers" }),
  ).toBeInViewport();
});

test("Escape closes the menu and returns focus to the toggle", async ({ page }, testInfo) => {
  await press(page.getByRole("button", { name: "Open menu" }), testInfo.project.use.hasTouch);
  await page.keyboard.press("Escape");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await expect(toggle).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
});

test("is fully keyboard operable and traps focus while open", async ({ page }) => {
  const toggle = page.getByRole("button", { name: "Open menu" });
  for (let i = 0; i < 10 && !(await toggle.evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();

  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    const insideHeader = await page.evaluate(() => !!document.activeElement?.closest("header"));
    expect(insideHeader, `Tab #${i + 1} stays inside the header`).toBe(true);
  }
});

test("growing to desktop while open closes the menu", async ({ page }, testInfo) => {
  await press(page.getByRole("button", { name: "Open menu" }), testInfo.project.use.hasTouch);
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  expect(await bodyOverflow(page)).toBe("");
});
