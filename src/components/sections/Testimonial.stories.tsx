import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Testimonial } from "./Testimonial";

const meta = { title: "Sections/Testimonial", component: Testimonial } satisfies Meta<
  typeof Testimonial
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: "desktop" } } };
export const Tablet: Story = { globals: { viewport: { value: "tablet" } } };
export const Mobile: Story = { globals: { viewport: { value: "mobile" } } };
