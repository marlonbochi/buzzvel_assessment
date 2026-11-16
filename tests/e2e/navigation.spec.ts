import type { Locator, Page } from "@playwright/test";
import { expect, HEADER_HEIGHT, isDesktop, press, test } from "./fixtures";

type Case = {
  where: string;
  scope: (page: Page) => Locator;
  link: string;
  hash: string;
  target: string;
};

const region = (name: string) => (page: Page) => page.getByRole("region", { name, exact: true });

const CASES: Case[] = [
  {
    where: "hero",
    scope: region("Build skills that actually move you forward."),
    link: "Explore courses",
    hash: "#courses",
    target: "Learn something worth knowing.",
  },
  {
    where: "hero",
    scope: region("Build skills that actually move you forward."),
    link: "See how it works",
    hash: "#how-it-works",
    target: "Less browsing. More learning.",
  },
  {
    where: "featured",
    scope: region("Designing products people understand."),
    link: "Browse all courses",
    hash: "#courses",
    target: "Learn something worth knowing.",
  },
  {
    where: "people",
    scope: region("Meet international students & teachers"),
    link: "Explore teachers and students",
    hash: "#people",
    target: "Meet international students & teachers",
  },
  {
    where: "final CTA",
    scope: region("What will you learn next?"),
    link: "Explore all courses",
    hash: "#courses",
    target: "Learn something worth knowing.",
  },
  {
    where: "footer",
    scope: (p) => p.getByRole("contentinfo"),
    link: "Categories",
    hash: "#courses",
    target: "Learn something worth knowing.",
  },
  {
    where: "footer",
    scope: (p) => p.getByRole("contentinfo"),
    link: "Instructors",
    hash: "#people",
    target: "Meet international students & teachers",
  },
  {
    where: "footer",
    scope: (p) => p.getByRole("contentinfo"),
    link: "About",
    hash: "#how-it-works",
    target: "Less browsing. More learning.",
  },
  {
    where: "footer",
    scope: (p) => p.getByRole("contentinfo"),
    link: "Contact",
    hash: "#contact",
    target: "Get in touch",
  },
];

async function expectLandedOn(page: Page, hash: string, heading: string) {
  await expect(page).toHaveURL(new RegExp(`${hash}$`));
  const target = page.getByRole("heading", { name: heading, exact: true });
  await expect(target).toBeInViewport();
  // Smooth scrolling: poll until the heading settles below the sticky header.
  await expect
    .poll(async () => (await target.boundingBox())!.y, { timeout: 5000 })
    .toBeGreaterThanOrEqual(HEADER_HEIGHT);
}

for (const c of CASES) {
  test(`${c.where}: "${c.link}" scrolls to ${c.hash}`, async ({ page }) => {
    await page.goto("/");
    const link = c.scope(page).getByRole("link", { name: c.link, exact: true });
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expectLandedOn(page, c.hash, c.target);
  });
}

test("header navigation reaches Courses, Community and About", async ({ page }, testInfo) => {
  for (const [name, hash, heading] of [
    ["Courses", "#courses", "Learn something worth knowing."],
    ["Community", "#people", "Meet international students & teachers"],
    ["About", "#how-it-works", "Less browsing. More learning."],
  ] as const) {
    await page.goto("/");
    if (!isDesktop(testInfo.project.name)) {
      await press(page.getByRole("button", { name: "Open menu" }), testInfo.project.use.hasTouch);
      await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name }).click();
    } else {
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name }).click();
    }
    await expectLandedOn(page, hash, heading);
  }
});

test("the logo brings the page back to the top", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await page.getByRole("banner").getByRole("link", { name: "Luma — back to top" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBe(0);
});

test("placeholder links stay on the page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Careers" }).click();
  await expect(page).toHaveURL(/\/#?$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeAttached();
});

test("the contact email is a mailto link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "contact@luma.com" })).toHaveAttribute(
    "href",
    "mailto:contact@luma.com",
  );
});

test("Review Focus 3: deep link /#contact lands below the sticky header", async ({ page }) => {
  await page.goto("/#contact");
  const heading = page.getByRole("heading", { name: "Get in touch", exact: true });
  await expect(heading).toBeInViewport();
  await expect
    .poll(async () => (await heading.boundingBox())!.y, { timeout: 5000 })
    .toBeGreaterThanOrEqual(HEADER_HEIGHT);
});

test("loading or reloading a deep link jumps straight to the section, without animating", async ({
  page,
}) => {
  const heading = page.getByRole("heading", {
    name: "Meet international students & teachers",
    exact: true,
  });
  const y = async () => (await heading.boundingBox())!.y;

  for (const load of [() => page.goto("/#people"), () => page.reload()]) {
    await load();
    const atLoad = await y();
    await page.waitForTimeout(400);
    expect(await y(), "the page must not still be scrolling after load").toBe(atLoad);
    expect(atLoad).toBeGreaterThanOrEqual(HEADER_HEIGHT);
    await expect(heading).toBeInViewport();
  }
});

test("smooth scrolling is enabled for in-page clicks once the page has loaded", async ({
  page,
}) => {
  await page.goto("/");
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior))
    .toBe("smooth");
});
