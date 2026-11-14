// zod/mini: same validation semantics, tree-shakable — this schema ships to the browser.
import { z } from "zod/mini";

/** Shared by the client (instant feedback) and the Server Action (source of truth). */
export const CONTACT_MESSAGES = {
  nameRequired: "Please enter your full name.",
  nameTooLong: "Name must be 80 characters or fewer.",
  emailInvalid: "Please enter a valid email address.",
  emailTooLong: "Email must be 254 characters or fewer.",
  questionTooShort: "Please tell us a bit more (at least 10 characters).",
  questionTooLong: "Question must be 1000 characters or fewer.",
  success: "Thanks! We'll get back to you within 24 hours.",
  sendFailed: "We couldn't send your message. Check your connection and try again.",
} as const;

const M = CONTACT_MESSAGES;

export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2, M.nameRequired), z.maxLength(80, M.nameTooLong)),
  // 254 is the practical maximum length of an address (RFC 5321 path limit).
  email: z.pipe(
    z.string().check(z.trim(), z.maxLength(254, M.emailTooLong)),
    z.email({ error: M.emailInvalid }),
  ),
  question: z
    .string()
    .check(z.trim(), z.minLength(10, M.questionTooShort), z.maxLength(1000, M.questionTooLong)),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export const CONTACT_FIELDS: readonly ContactField[] = ["name", "email", "question"];

/** Coerces anything (FormData values, partial objects, null) into the three string fields. */
function normalize(input: unknown): Record<ContactField, string> {
  const source = (typeof input === "object" && input !== null ? input : {}) as Record<
    string,
    unknown
  >;
  const read = (key: ContactField) =>
    typeof source[key] === "string" ? (source[key] as string) : "";
  return { name: read("name"), email: read("email"), question: read("question") };
}

export function validateContact(
  input: unknown,
): { success: true; data: ContactInput } | { success: false; errors: ContactFieldErrors } {
  const result = contactSchema.safeParse(normalize(input));
  if (result.success) return { success: true, data: result.data };

  const errors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { success: false, errors };
}
