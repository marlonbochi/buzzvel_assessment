import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const SUCCESS = "Thanks! We'll get back to you within 24 hours.";

const form = (page: Page) => ({
  name: page.getByLabel("Full name"),
  email: page.getByLabel("Email", { exact: true }),
  question: page.getByLabel("Your question"),
  submit: page.getByRole("button", { name: /Send message|Sending/ }),
  status: page.getByRole("status"),
});

async function fillValid(page: Page) {
  const f = form(page);
  await f.name.fill("Maya Chen");
  await f.email.fill("maya@example.com");
  await f.question.fill("Which course should I start with?");
}

test.describe("with JavaScript", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#contact");
  });

  test("empty submit shows all errors and focuses the first field", async ({ page }) => {
    const f = form(page);
    await f.submit.click();
    await expect(f.name).toHaveAttribute("aria-invalid", "true");
    await expect(f.email).toHaveAttribute("aria-invalid", "true");
    await expect(f.question).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await expect(f.name).toBeFocused();
  });

  test("an invalid email is flagged on blur and cleared live once fixed", async ({ page }) => {
    const f = form(page);
    await f.email.fill("maya@");
    await f.email.blur();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await f.email.fill("maya@example.com");
    await expect(page.getByText("Please enter a valid email address.")).toBeHidden();
    await expect(f.email).not.toHaveAttribute("aria-invalid", "true");
  });

  test("a too-short question shows the minimum length message", async ({ page }) => {
    const f = form(page);
    await fillValid(page);
    await f.question.fill("Too short");
    await f.submit.click();
    await expect(
      page.getByText("Please tell us a bit more (at least 10 characters)."),
    ).toBeVisible();
  });

  test("happy path: pending, then success, then reset", async ({ page }) => {
    const f = form(page);
    await fillValid(page);
    await f.submit.click();
    await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
    await expect(f.status).toHaveText(SUCCESS);
    await expect(f.name).toHaveValue("");
    await expect(f.email).toHaveValue("");
    await expect(f.question).toHaveValue("");
  });

  test("Enter in a field submits the form", async ({ page }) => {
    const f = form(page);
    await fillValid(page);
    await f.email.press("Enter");
    await expect(f.status).toHaveText(SUCCESS);
  });
});

test.describe("without JavaScript (progressive enhancement)", () => {
  test.use({ javaScriptEnabled: false });

  test("a valid submission still succeeds", async ({ page }) => {
    await page.goto("/");
    await fillValid(page);
    await form(page).submit.click();
    await expect(page.getByText(SUCCESS)).toBeVisible();
  });

  test("an invalid submission renders server-side errors and keeps the input", async ({ page }) => {
    await page.goto("/");
    const f = form(page);
    await f.name.fill("Maya Chen");
    await f.email.fill("maya@");
    await f.question.fill("Which course should I start with?");
    await f.submit.click();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(form(page).name).toHaveValue("Maya Chen");
  });
});
