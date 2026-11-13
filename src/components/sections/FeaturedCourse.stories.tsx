import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturedCourse } from "./FeaturedCourse";

const meta = { title: "Sections/FeaturedCourse", component: FeaturedCourse } satisfies Meta<
  typeof FeaturedCourse
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: "desktop" } } };
export const Tablet: Story = { globals: { viewport: { value: "tablet" } } };
export const Mobile: Story = { globals: { viewport: { value: "mobile" } } };
