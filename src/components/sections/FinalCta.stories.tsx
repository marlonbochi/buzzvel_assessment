import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FinalCta } from "./FinalCta";

const meta = { title: "Sections/FinalCta", component: FinalCta } satisfies Meta<typeof FinalCta>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: "desktop" } } };
export const Tablet: Story = { globals: { viewport: { value: "tablet" } } };
export const Mobile: Story = { globals: { viewport: { value: "mobile" } } };
