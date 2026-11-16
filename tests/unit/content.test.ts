import { existsSync } from "node:fs";
import * as c from "@/content";

const allText = JSON.stringify(c);

test("no Portuguese copy leaks from the mobile frame", () => {
  for (const word of [
    "Nome",
    "Seu nome",
    "exemplo",
    "dúvida",
    "Enviar",
    "Preencha",
    "Conte como",
  ]) {
    expect(allText).not.toContain(word);
  }
});

test("steps are numbered 01–03", () => {
  expect(c.steps.map((s) => s.label)).toEqual(["STEP 01", "STEP 02", "STEP 03"]);
  expect(c.steps[1]?.description).toBe(
    "Follow concise lessons created by professionals who use these skills.",
  );
});

test("four categories in design order", () => {
  expect(c.categories.map((x) => `${x.number} ${x.title}`)).toEqual([
    "01 Product Design",
    "02 Technology",
    "03 Business",
    "04 Creative",
  ]);
});

test("every image exists and has a meaningful alt text", () => {
  const images = [
    c.hero.image,
    c.featuredCourse.image,
    c.testimonial.avatar,
    ...c.hero.avatars,
    ...c.finalCta.avatars,
    ...c.people.photos,
  ];
  expect(c.people.photos).toHaveLength(10);
  for (const img of images) {
    expect(existsSync(`public${img.src}`), img.src).toBe(true);
    expect(img.alt.length, img.src).toBeGreaterThan(5);
    expect(img.width).toBeGreaterThan(0);
    expect(img.height).toBeGreaterThan(0);
  }
});

test("in-page anchors match spec §7.11", () => {
  expect(c.primaryNav.find((l) => l.label === "Courses")?.href).toBe("#courses");
  expect(c.primaryNav.find((l) => l.label === "Community")?.href).toBe("#people");
  expect(c.primaryNav.find((l) => l.label === "About")?.href).toBe("#how-it-works");
  expect(c.hero.primaryCta.href).toBe("#courses");
  expect(c.hero.secondaryCta.href).toBe("#how-it-works");
  expect(c.featuredCourse.secondaryCta.href).toBe("#courses");
  expect(c.people.cta.href).toBe("#people");
  expect(c.finalCta.primaryCta.href).toBe("#courses");
  const footerLinks = c.footer.columns.flatMap((col) => col.links);
  expect(footerLinks.find((l) => l.label === "Contact")?.href).toBe("#contact");
  expect(footerLinks.find((l) => l.label === "Instructors")?.href).toBe("#people");
  expect(footerLinks.find((l) => l.label === "About")?.href).toBe("#how-it-works");
});

test("footer columns match the design", () => {
  expect(c.footer.columns.map((col) => [col.title, col.links.length])).toEqual([
    ["Explore", 4],
    ["Company", 3],
    ["Support", 4],
  ]);
  expect(c.footer.copyright).toBe("© 2026 Luma Learning");
});
