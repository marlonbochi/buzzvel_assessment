import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileNav } from "@/components/layout/MobileNav";
import { headerActions, primaryNav } from "@/content";
import { setMediaMatches } from "../setup";

function renderNav() {
  const user = userEvent.setup();
  render(<MobileNav links={primaryNav} login={headerActions.login} cta={headerActions.cta} />);
  const toggle = () => screen.getByRole("button", { name: /menu/i });
  return { user, toggle };
}

test("toggle starts closed and controls the panel", () => {
  const { toggle } = renderNav();
  expect(toggle()).toHaveAccessibleName("Open menu");
  expect(toggle()).toHaveAttribute("aria-expanded", "false");
  const panelId = toggle().getAttribute("aria-controls");
  expect(panelId).toBeTruthy();
  expect(document.getElementById(panelId!)).not.toBeVisible();
});

test("opening shows every link, renames the toggle and locks page scroll", async () => {
  const { user, toggle } = renderNav();
  await user.click(toggle());
  expect(toggle()).toHaveAttribute("aria-expanded", "true");
  expect(toggle()).toHaveAccessibleName("Close menu");
  for (const name of ["Courses", "For Teams", "Community", "About", "Log in", "Start learning"]) {
    expect(screen.getByRole("link", { name })).toBeVisible();
  }
  expect(document.body.style.overflow).toBe("hidden");
});

test("clicking the toggle again closes the menu", async () => {
  const { user, toggle } = renderNav();
  await user.click(toggle());
  await user.click(toggle());
  expect(toggle()).toHaveAttribute("aria-expanded", "false");
  expect(document.body.style.overflow).toBe("");
});

test("Escape closes the menu and returns focus to the toggle", async () => {
  const { user, toggle } = renderNav();
  await user.click(toggle());
  await user.tab();
  expect(screen.getByRole("link", { name: "Courses" })).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(toggle()).toHaveAttribute("aria-expanded", "false");
  expect(toggle()).toHaveFocus();
  expect(document.body.style.overflow).toBe("");
});

test("clicking a link closes the menu", async () => {
  const { user, toggle } = renderNav();
  await user.click(toggle());
  await user.click(screen.getByRole("link", { name: "Community" }));
  expect(toggle()).toHaveAttribute("aria-expanded", "false");
});

test("Review Focus 4: a link whose hash is already in the URL still closes the menu", async () => {
  window.location.hash = "#courses";
  const { user, toggle } = renderNav();
  await user.click(toggle());
  await user.click(screen.getByRole("link", { name: "Courses" }));
  expect(toggle()).toHaveAttribute("aria-expanded", "false");
});

test("Tab and Shift+Tab are trapped between the toggle and the panel", async () => {
  const { user, toggle } = renderNav();
  await user.click(toggle());
  const last = screen.getByRole("link", { name: "Start learning" });
  last.focus();
  await user.tab();
  expect(toggle()).toHaveFocus();
  await user.tab({ shift: true });
  expect(last).toHaveFocus();
});

test("crossing into the desktop breakpoint closes an open menu", async () => {
  const { user, toggle } = renderNav();
  await user.click(toggle());
  act(() => setMediaMatches(true));
  expect(toggle()).toHaveAttribute("aria-expanded", "false");
  expect(document.body.style.overflow).toBe("");
});
