import { render, screen, within } from "@testing-library/react";
import { FeaturedCourse } from "@/components/sections/FeaturedCourse";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonial } from "@/components/sections/Testimonial";
import { featuredCourse, stats, steps, testimonial } from "@/content";

describe("FeaturedCourse", () => {
  test("renders heading, meta list, both CTAs and a described image", () => {
    render(<FeaturedCourse />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Designing products people understand." }),
    ).toBeInTheDocument();
    const meta = screen.getByRole("list", { name: "Course details" });
    expect(
      within(meta)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["8 lessons", "2h 40min", "Intermediate"]);
    expect(screen.getByRole("link", { name: "View course" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse all courses" })).toHaveAttribute(
      "href",
      "#courses",
    );
    expect(screen.getByAltText(featuredCourse.image.alt)).toBeInTheDocument();
    expect(screen.getByText("Featured course")).toBeInTheDocument();
  });
});

describe("HowItWorks", () => {
  test("is #how-it-works with an ordered list of three labelled steps", () => {
    render(<HowItWorks />);
    const section = screen.getByRole("region", { name: "Less browsing. More learning." });
    expect(section).toHaveAttribute("id", "how-it-works");
    const items = within(section).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(section.querySelector("ol")).toBeInTheDocument();
    items.forEach((item, i) => {
      expect(item).toHaveTextContent(steps[i]!.label);
      expect(within(item).getByRole("heading", { level: 3 })).toHaveTextContent(steps[i]!.title);
    });
  });

  test("step illustrations and the connector are hidden from assistive tech", () => {
    render(<HowItWorks />);
    const illustrations = screen.getAllByTestId("step-illustration");
    expect(illustrations).toHaveLength(3);
    for (const el of illustrations) expect(el).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Testimonial", () => {
  test("quote is a figure with blockquote and attributed figcaption", () => {
    render(<Testimonial />);
    const figure = screen.getByRole("figure");
    expect(within(figure).getByText(testimonial.quote).closest("blockquote")).not.toBeNull();
    const caption = figure.querySelector("figcaption")!;
    expect(caption).toHaveTextContent("Alex Morgan");
    expect(caption).toHaveTextContent("Product Manager");
    expect(within(figure).getByAltText(testimonial.avatar.alt)).toBeInTheDocument();
  });

  test("stats render value and label pairs", () => {
    render(<Testimonial />);
    const list = screen.getByRole("list", { name: "Luma in numbers" });
    const items = within(list).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(stats.map((s) => `${s.value}${s.label}`));
  });
});
