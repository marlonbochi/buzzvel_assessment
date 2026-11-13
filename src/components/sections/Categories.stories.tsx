import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Categories } from "./Categories";

const meta = { title: "Sections/Categories", component: Categories } satisfies Meta<
  typeof Categories
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: "desktop" } } };
export const Tablet: Story = { globals: { viewport: { value: "tablet" } } };
export const Mobile: Story = { globals: { viewport: { value: "mobile" } } };
