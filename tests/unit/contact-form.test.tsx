import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_MESSAGES as M } from "@/lib/contact-schema";
import type { ContactFormState } from "@/lib/contact-state";

type Action = (prev: ContactFormState, data: FormData) => Promise<ContactFormState>;

const success = (prev: ContactFormState): ContactFormState => ({
  status: "success",
  errors: {},
  values: {},
  submissionId: prev.submissionId + 1,
});

function setup(action: Action = async (prev) => success(prev)) {
  const spy = vi.fn(action);
  const user = userEvent.setup();
  render(<ContactForm action={spy} />);
  const name = () => screen.getByLabelText("Full name");
  const email = () => screen.getByLabelText("Email");
  const question = () => screen.getByLabelText("Your question");
  const submit = () => screen.getByRole("button", { name: /send message|sending/i });
  const fillValid = async () => {
    await user.type(name(), "Maya Chen");
    await user.type(email(), "maya@example.com");
    await user.type(question(), "Which course should I start with?");
  };
  return { spy, user, name, email, question, submit, fillValid };
}

test("empty submit shows every error, links them, focuses the first field and skips the action", async () => {
  const { spy, user, name, email, question, submit } = setup();
  await user.click(submit());

  for (const [field, message] of [
    [name(), M.nameRequired],
    [email(), M.emailInvalid],
    [question(), M.questionTooShort],
  ] as const) {
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription(message);
  }
  expect(name()).toHaveFocus();
  expect(spy).not.toHaveBeenCalled();
});

test("an invalid email shows its error on blur and clears live once corrected", async () => {
  const { spy, user, email } = setup();
  await user.type(email(), "maya@");
  await user.tab();
  expect(email()).toHaveAccessibleDescription(M.emailInvalid);

  await user.type(email(), "example.com");
  expect(email()).not.toHaveAttribute("aria-invalid", "true");
  expect(screen.queryByText(M.emailInvalid)).not.toBeInTheDocument();
  expect(spy).not.toHaveBeenCalled();
});

test("valid submit calls the action once, shows pending, then success and resets", async () => {
  let resolve: () => void = () => undefined;
  const { spy, user, name, email, question, submit, fillValid } = setup(
    (prev) =>
      new Promise((done) => {
        resolve = () => done(success(prev));
      }),
  );
  await fillValid();
  await user.click(submit());

  await waitFor(() => expect(submit()).toHaveTextContent("Sending…"));
  expect(submit()).toBeDisabled();
  expect(submit()).toHaveAttribute("aria-busy", "true");

  resolve();
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(M.success));
  expect(spy).toHaveBeenCalledTimes(1);
  expect(name()).toHaveValue("");
  expect(email()).toHaveValue("");
  expect(question()).toHaveValue("");
});

test("Review Focus 2: double-clicking submit sends exactly one submission", async () => {
  const { spy, user, submit, fillValid } = setup(
    (prev) => new Promise((done) => setTimeout(() => done(success(prev)), 50)),
  );
  await fillValid();
  await user.dblClick(submit());
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(M.success));
  expect(spy).toHaveBeenCalledTimes(1);
});

test("pressing Enter in the email field submits the form", async () => {
  const { spy, user, email, fillValid } = setup();
  await fillValid();
  await user.type(email(), "{Enter}");
  await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
});

test("server-side errors are rendered as field errors", async () => {
  const { user, email, submit, fillValid } = setup(async (prev) => ({
    status: "error",
    errors: { email: M.emailInvalid },
    values: { name: "Maya Chen", email: "maya@example.com", question: "Which course?" },
    submissionId: prev.submissionId,
  }));
  await fillValid();
  await user.click(submit());
  await waitFor(() => expect(email()).toHaveAccessibleDescription(M.emailInvalid));
});
