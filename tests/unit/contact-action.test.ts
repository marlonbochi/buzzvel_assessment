import { submitContact } from "@/app/actions/contact";
import { CONTACT_MESSAGES as M } from "@/lib/contact-schema";
import { initialContactState } from "@/lib/contact-state";

beforeAll(() => {
  process.env.CONTACT_DELAY_MS = "0";
});

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

test("invalid submission returns field errors and echoes the values for a no-JS re-render", async () => {
  const values = { name: "M", email: "maya@", question: "Hi" };
  const state = await submitContact(initialContactState, form(values));
  expect(state.status).toBe("error");
  expect(state.errors).toEqual({
    name: M.nameRequired,
    email: M.emailInvalid,
    question: M.questionTooShort,
  });
  expect(state.values).toEqual(values);
  expect(state.submissionId).toBe(initialContactState.submissionId);
});

test("valid submission succeeds, clears values and bumps submissionId", async () => {
  const prev = { ...initialContactState, submissionId: 4 };
  const state = await submitContact(
    prev,
    form({
      name: "Maya Chen",
      email: "maya@example.com",
      question: "Which course should I start with?",
    }),
  );
  expect(state).toEqual({ status: "success", errors: {}, values: {}, submissionId: 5 });
});

test("missing fields are treated as empty strings", async () => {
  const state = await submitContact(initialContactState, new FormData());
  expect(state.status).toBe("error");
  expect(Object.keys(state.errors).sort()).toEqual(["email", "name", "question"]);
});
