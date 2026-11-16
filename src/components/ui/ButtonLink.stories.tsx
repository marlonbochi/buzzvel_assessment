import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonLink } from "./ButtonLink";

const meta = {
  title: "UI/ButtonLink",
  component: ButtonLink,
  args: { href: "#courses", children: "Explore courses", variant: "primary" },
  decorators: [
    (Story) => (
      <div className="bg-background-white p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Outline: Story = { args: { variant: "outline", children: "Join Luma" } };
export const MobileBlock: Story = {
  args: { block: "mobile" },
  globals: { viewport: { value: "mobile" } },
};
export const TextWithArrow: Story = {
  args: { variant: "text", withArrow: true, children: "Explore" },
};
export const TextWithArrowOnBlue: Story = {
  args: {
    variant: "text",
    withArrow: true,
    children: "Browse all courses",
    className: "text-text-white-primary",
  },
  decorators: [
    (Story) => (
      <div className="bg-primary-blue p-8">
        <Story />
      </div>
    ),
  ],
};
