import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks } from "./HowItWorks";

const meta = { title: "Sections/HowItWorks", component: HowItWorks } satisfies Meta<
  typeof HowItWorks
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: "desktop" } } };
export const Tablet: Story = { globals: { viewport: { value: "tablet" } } };
export const Mobile: Story = { globals: { viewport: { value: "mobile" } } };
