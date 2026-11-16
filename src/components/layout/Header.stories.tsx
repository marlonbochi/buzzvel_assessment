import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { headerActions, primaryNav } from "@/content";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

const meta = { title: "Layout/Header", component: Header } satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: "desktop" } } };
export const Mobile: Story = { globals: { viewport: { value: "mobile" } } };

export const MobileMenuOpen: StoryObj<typeof MobileNav> = {
  render: () => (
    <header className="relative border-b border-line-1 bg-background-light-yellow px-5 py-4">
      <div className="flex justify-end">
        <MobileNav links={primaryNav} login={headerActions.login} cta={headerActions.cta} />
      </div>
    </header>
  ),
  globals: { viewport: { value: "mobile" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open menu" }));
    await expect(canvas.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    // The panel fades in (@starting-style); wait for the transition before asserting visibility.
    await waitFor(() => expect(canvas.getByRole("link", { name: "Start learning" })).toBeVisible());
  },
};
