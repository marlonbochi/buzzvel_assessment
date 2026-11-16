import { metadata } from "@/app/layout";

test("metadata describes the page", () => {
  expect(metadata.title).toBe("Luma — Build skills that actually move you forward");
  expect(metadata.description).toMatch(/practical courses/i);
  expect(metadata.openGraph?.title).toBeDefined();
  expect(metadata.metadataBase?.toString()).toBe("http://localhost:3000/");
});
