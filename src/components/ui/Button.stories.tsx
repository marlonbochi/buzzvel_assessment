import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Send message", variant: "primary", size: "md" },
  decorators: [
    (Story) => (
      <div className="bg-background-light-yellow p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Outline: Story = { args: { variant: "outline", children: "See how it works" } };
export const Large: Story = { args: { size: "lg", children: "Explore courses" } };
export const FullWidth: Story = { args: { block: "always" } };
export const Disabled: Story = { args: { disabled: true } };

export const Pending: Story = {
  args: { pending: true, pendingLabel: "Sending…" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Sending…" });
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await expect(button).toHaveAttribute("aria-busy", "true");
  },
};

export const YellowOnBlue: Story = {
  args: { variant: "yellow", children: "View course" },
  decorators: [
    (Story) => (
      <div className="bg-primary-blue p-8">
        <Story />
      </div>
    ),
  ],
};
