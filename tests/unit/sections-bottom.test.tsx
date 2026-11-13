import { render, screen, within } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { FinalCta } from "@/components/sections/FinalCta";
import { People } from "@/components/sections/People";
import { people } from "@/content";

describe("People", () => {
  test("is #people with heading, ten described photos and a CTA", () => {
    render(<People />);
    const section = screen.getByRole("region", { name: "Meet international students & teachers" });
    expect(section).toHaveAttribute("id", "people");
    const photos = within(section).getAllByRole("img");
    expect(photos).toHaveLength(10);
    expect(photos.map((img) => img.getAttribute("alt"))).toEqual(people.photos.map((p) => p.alt));
    expect(
      within(section).getByRole("link", { name: "Explore teachers and students" }),
    ).toHaveAttribute("href", "#people");
  });
});

describe("FinalCta", () => {
  test("renders heading, both CTAs and keeps decorations out of the accessibility tree", () => {
    render(<FinalCta />);
    expect(
      screen.getByRole("heading", { level: 2, name: "What will you learn next?" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore all courses" })).toHaveAttribute(
      "href",
      "#courses",
    );
    expect(screen.getByRole("link", { name: "Join Luma" })).toBeInTheDocument();
    const decorations = screen.getByTestId("cta-decorations");
    expect(decorations).toHaveAttribute("aria-hidden", "true");
    expect(decorations.children.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Footer", () => {
  test("is the contentinfo landmark with three labelled link groups and the copyright", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    const counts = ["Explore", "Company", "Support"].map(
      (name) =>
        within(within(footer).getByRole("navigation", { name })).getAllByRole("link").length,
    );
    expect(counts).toEqual([4, 3, 4]);
    expect(within(footer).getByText("© 2026 Luma Learning")).toBeInTheDocument();
    expect(within(footer).getByText("Practical learning for curious people.")).toBeInTheDocument();
  });
});
