import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { buttonClasses, type ButtonVariant } from "@/components/ui/button-styles";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { ArrowRightIcon, StarIcon } from "@/components/ui/icons";

describe("Button", () => {
  test("pending state shows the pending label and marks it busy and aria-disabled, keeping focusability", () => {
    render(
      <Button pending pendingLabel="Sending…">
        Send message
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Sending…" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).not.toBeDisabled();
  });

  test("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button", { name: "Click" })).toHaveAttribute("type", "button");
  });
});

describe("ButtonLink", () => {
  test("renders a link with a decorative arrow", () => {
    render(
      <ButtonLink href="#courses" variant="text" withArrow>
        Browse all courses
      </ButtonLink>,
    );
    const link = screen.getByRole("link", { name: "Browse all courses" });
    expect(link).toHaveAttribute("href", "#courses");
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("buttonClasses", () => {
  test("primary uses the brand blue", () => {
    expect(buttonClasses({ variant: "primary" })).toContain("bg-primary-blue");
  });

  test("block=mobile is full width only below md", () => {
    const classes = buttonClasses({ block: "mobile" });
    expect(classes).toContain("w-full");
    expect(classes).toContain("md:w-auto");
  });

  test.each<ButtonVariant>(["primary", "outline", "yellow", "text"])(
    "%s variant has a visible focus ring",
    (variant) => {
      expect(buttonClasses({ variant })).toMatch(/focus-visible:outline/);
    },
  );
});

describe("SectionHeading", () => {
  test("renders eyebrow before an h2 with the given id", () => {
    render(<SectionHeading id="courses-title" eyebrow="Find your next skill" title="Learn" />);
    const heading = screen.getByRole("heading", { level: 2, name: "Learn" });
    expect(heading).toHaveAttribute("id", "courses-title");
    const eyebrow = screen.getByText("Find your next skill");
    expect(eyebrow.tagName).toBe("P");
    expect(
      eyebrow.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test("level=1 renders the page h1", () => {
    render(<SectionHeading id="hero-title" level={1} size="h1" title="Build skills" />);
    expect(screen.getByRole("heading", { level: 1, name: "Build skills" })).toBeInTheDocument();
  });
});

describe("Chip, AvatarStack and icons", () => {
  test("Chip renders its content", () => {
    render(<Chip>8 lessons</Chip>);
    expect(screen.getByText("8 lessons")).toBeInTheDocument();
  });

  test("AvatarStack renders every avatar with its alt text", () => {
    render(
      <AvatarStack
        avatars={[
          { src: "/a.jpg", alt: "First learner", width: 80, height: 80 },
          { src: "/b.jpg", alt: "Second learner", width: 80, height: 80 },
        ]}
      />,
    );
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByAltText("Second learner")).toBeInTheDocument();
  });

  test("icons are hidden from assistive tech by default", () => {
    const { container } = render(
      <>
        <ArrowRightIcon />
        <StarIcon />
      </>,
    );
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
    }
  });
});

test("text variant drops box padding so it aligns with surrounding text", () => {
  for (const size of ["sm", "md", "lg"] as const) {
    expect(buttonClasses({ variant: "text", size })).not.toMatch(/\bp[xy]-/);
  }
});

test("sm size does not carry md padding (no conflicting utilities)", () => {
  const classes = buttonClasses({ size: "sm" }).split(" ");
  expect(classes).toContain("px-5");
  expect(classes).not.toContain("px-7");
});
