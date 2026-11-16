import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CONTACT_MESSAGES } from "@/lib/contact-schema";
import type { ContactFormState } from "@/lib/contact-state";
import { ContactForm } from "./ContactForm";
import { FormField } from "./FormField";

const succeedSync = (prev: ContactFormState): ContactFormState => ({
  status: "success",
  errors: {},
  values: {},
  submissionId: prev.submissionId + 1,
});
const succeed = async (prev: ContactFormState) => succeedSync(prev);

const meta = {
  title: "Contact/ContactForm",
  component: ContactForm,
  args: { action: succeed },
  decorators: [
    (Story) => (
      <div className="max-w-[540px] p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await expect(canvas.getByLabelText("Full name")).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByText(CONTACT_MESSAGES.emailInvalid)).toBeVisible();
    await expect(canvas.getByText(CONTACT_MESSAGES.questionTooShort)).toBeVisible();
  },
};

export const Pending: Story = {
  // Resolves after a delay: a never-resolving action would leave a pending transition that
  // React entangles with the next story rendered in the same root.
  args: {
    action: (prev: ContactFormState) =>
      new Promise<ContactFormState>((resolve) =>
        setTimeout(() => resolve(succeedSync(prev)), 1200),
      ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Full name"), "Maya Chen");
    await userEvent.type(canvas.getByLabelText("Email"), "maya@example.com");
    await userEvent.type(canvas.getByLabelText("Your question"), "Which course should I take?");
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Sending…" })).toHaveAttribute(
        "aria-disabled",
        "true",
      ),
    );
    await expect(canvas.getByRole("button", { name: "Sending…" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await waitFor(
      () => expect(canvas.getByRole("status")).toHaveTextContent(CONTACT_MESSAGES.success),
      { timeout: 3000 },
    );
  },
};

export const Success: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Full name"), "Maya Chen");
    await userEvent.type(canvas.getByLabelText("Email"), "maya@example.com");
    await userEvent.type(canvas.getByLabelText("Your question"), "Which course should I take?");
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent(CONTACT_MESSAGES.success),
    );
  },
};

export const FieldStates: StoryObj<typeof FormField> = {
  render: () => (
    <div className="flex flex-col gap-5">
      <FormField id="story-name" name="name" label="Full name" placeholder="Your name" />
      <FormField
        id="story-email"
        name="email"
        type="email"
        label="Email"
        placeholder="youremail@example.com"
        defaultValue="maya@"
        error={CONTACT_MESSAGES.emailInvalid}
      />
    </div>
  ),
};

/** What ContactFormBoundary renders after the request itself failed (offline, stale action). */
export const SendFailed: Story = {
  args: {
    failed: true,
    initialValues: {
      name: "Maya Chen",
      email: "maya@example.com",
      question: "Which course should I take?",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(CONTACT_MESSAGES.sendFailed);
    await expect(canvas.getByLabelText("Full name")).toHaveValue("Maya Chen");
    await expect(canvas.getByRole("button", { name: "Send message" })).toHaveFocus();
  },
};
