import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

test("robots allows everything and points to the sitemap", () => {
  const result = robots();
  expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
  expect(String(result.sitemap)).toMatch(/\/sitemap\.xml$/);
});

test("sitemap lists the single page at the site URL", () => {
  const entries = sitemap();
  expect(entries).toHaveLength(1);
  expect(entries[0]?.url).toBe("http://localhost:3000/");
});
