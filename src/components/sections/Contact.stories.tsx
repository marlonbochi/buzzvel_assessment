import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Contact } from "./Contact";

const meta = { title: "Sections/Contact", component: Contact } satisfies Meta<typeof Contact>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: "desktop" } } };
export const Mobile: Story = { globals: { viewport: { value: "mobile" } } };
