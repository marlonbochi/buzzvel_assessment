import { expect, isDesktop, tabTo, test } from "./fixtures";

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(!isDesktop(testInfo.project.name), "Hover and focus checks run on desktop");
  await page.goto("/");
});

test("category card reacts to hover", async ({ page }) => {
  const card = page.getByRole("heading", { name: "Product Design", level: 3 }).locator("xpath=..");
  const border = () => card.evaluate((el) => getComputedStyle(el).borderColor);
  const before = await border();
  await card.hover();
  await expect.poll(border).not.toBe(before);
});

test("clicking anywhere on a card follows its link", async ({ page }) => {
  // Click on the description text: the link's stretched ::after covers the whole card.
  const description = page.getByText("Turn complex problems into clear, useful experiences.");
  await description.scrollIntoViewIfNeeded();
  const box = (await description.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL(/#$/);
});

test("each category card is a single tab stop", async ({ page }) => {
  const cards = page
    .getByRole("region", { name: "Learn something worth knowing." })
    .getByRole("listitem");
  await expect(cards).toHaveCount(4);
  for (const card of await cards.all()) {
    await expect(card.locator("a, button, input, textarea, [tabindex]")).toHaveCount(1);
  }
});

test("skip link is the first tab stop and moves focus to main", async ({ page }) => {
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("keyboard focus is visible on links, buttons and inputs", async ({ page }) => {
  for (const target of [
    page.getByRole("link", { name: "Explore courses" }),
    page.getByRole("link", { name: "Explore Product Design" }),
    page.getByLabel("Full name"),
    page.getByRole("button", { name: "Send message" }),
  ]) {
    await tabTo(page, target);
    const visible = await target.evaluate((el) => {
      const s = getComputedStyle(el);
      const after = getComputedStyle(el, "::after");
      return (
        s.outlineStyle !== "none" ||
        after.outlineStyle !== "none" ||
        (s.boxShadow !== "none" && s.boxShadow !== "")
      );
    });
    expect(visible).toBe(true);
  }
});
