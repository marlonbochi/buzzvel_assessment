import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { People } from "./People";

const meta = { title: "Sections/People", component: People } satisfies Meta<typeof People>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: "desktop" } } };
export const Tablet: Story = { globals: { viewport: { value: "tablet" } } };
export const Mobile: Story = { globals: { viewport: { value: "mobile" } } };
