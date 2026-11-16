import { render, screen, within } from "@testing-library/react";
import { Categories } from "@/components/sections/Categories";
import { Hero } from "@/components/sections/Hero";
import { categories, hero } from "@/content";

describe("Hero", () => {
  test("renders the single page h1", () => {
    render(<Hero />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Build skills that actually move you forward.",
    );
  });

  test("keeps text before the image in the DOM (visual order is CSS-only)", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    const image = screen.getByAltText(hero.image.alt);
    expect(h1.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test("shows both badges with an accessible rating", () => {
    render(<Hero />);
    expect(screen.getByText("120+")).toBeInTheDocument();
    expect(screen.getByText("expert-led courses")).toBeInTheDocument();
    expect(screen.getByText("Rated 4.9 out of 5")).toHaveClass("sr-only");
    const stars = screen.getByTestId("rating-stars");
    expect(stars).toHaveAttribute("aria-hidden", "true");
    expect(stars.querySelectorAll("svg")).toHaveLength(5);
  });

  test("links to courses and how-it-works and shows the trust line", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Explore courses" })).toHaveAttribute(
      "href",
      "#courses",
    );
    expect(screen.getByRole("link", { name: "See how it works" })).toHaveAttribute(
      "href",
      "#how-it-works",
    );
    expect(screen.getByText(/Trusted by 24,000\+/).closest("p")).toHaveTextContent(
      "Trusted by 24,000+ learners",
    );
  });
});

describe("Categories", () => {
  test("is the #courses section labelled by its h2, with four h3 cards in order", () => {
    render(<Categories />);
    const section = screen.getByRole("region", { name: "Learn something worth knowing." });
    expect(section).toHaveAttribute("id", "courses");
    expect(
      within(section)
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(categories.map((c) => c.title));
  });

  test("each card has exactly one link, named after its category", () => {
    render(<Categories />);
    for (const category of categories) {
      const card = screen.getByRole("heading", { level: 3, name: category.title }).closest("li")!;
      const links = within(card).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAccessibleName(`Explore ${category.title}`);
    }
  });
});
