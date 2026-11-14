import { CONTACT_MESSAGES as M, validateContact } from "@/lib/contact-schema";

const valid = {
  name: "Maya Chen",
  email: "maya@example.com",
  question: "Which course should I start with?",
};

test("valid input succeeds and is trimmed", () => {
  const result = validateContact({
    name: "  Maya Chen ",
    email: " maya@example.com ",
    question: `  ${valid.question}  `,
  });
  expect(result).toEqual({ success: true, data: valid });
});

test.each([
  ["empty name", { ...valid, name: "" }, { name: M.nameRequired }],
  ["one-letter name", { ...valid, name: "A" }, { name: M.nameRequired }],
  ["name over 80 chars", { ...valid, name: "a".repeat(81) }, { name: M.nameTooLong }],
  // Review Focus 1: whitespace-only and oversized input
  ["whitespace-only name", { ...valid, name: "   " }, { name: M.nameRequired }],
  [
    "whitespace-only question",
    { ...valid, question: " ".repeat(20) },
    { question: M.questionTooShort },
  ],
  ["5000-char question", { ...valid, question: "x".repeat(5000) }, { question: M.questionTooLong }],
  ["incomplete email", { ...valid, email: "maya@" }, { email: M.emailInvalid }],
  ["empty email", { ...valid, email: "" }, { email: M.emailInvalid }],
  ["9-char question", { ...valid, question: "too short" }, { question: M.questionTooShort }],
])("%s is rejected with the right message", (_label, input, errors) => {
  expect(validateContact(input)).toEqual({ success: false, errors });
});

test("boundaries are inclusive: 2-char name, 80-char name and 10-char question pass", () => {
  expect(validateContact({ ...valid, name: "Al" }).success).toBe(true);
  expect(validateContact({ ...valid, name: "a".repeat(80) }).success).toBe(true);
  expect(validateContact({ ...valid, question: "x".repeat(10) }).success).toBe(true);
  expect(validateContact({ ...valid, question: "x".repeat(1000) }).success).toBe(true);
});

test("non-object input reports every field", () => {
  expect(validateContact(null)).toEqual({
    success: false,
    errors: { name: M.nameRequired, email: M.emailInvalid, question: M.questionTooShort },
  });
});

test("only the first message per field is reported", () => {
  const result = validateContact({ name: "", email: "x", question: "" });
  expect(result.success).toBe(false);
  if (!result.success)
    expect(Object.keys(result.errors).sort()).toEqual(["email", "name", "question"]);
});

test("Review Focus 1: an email longer than 254 characters is rejected", () => {
  const long = `${"a".repeat(250)}@x.io`; // 255 characters
  expect(validateContact({ ...valid, email: long })).toEqual({
    success: false,
    errors: { email: M.emailTooLong },
  });
  expect(validateContact({ ...valid, email: `${"a".repeat(3000)}@example.com` })).toEqual({
    success: false,
    errors: { email: M.emailTooLong },
  });
});
