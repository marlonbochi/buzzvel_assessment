import { z } from "zod";

/** Shared by the client (instant feedback) and the Server Action (source of truth). */
export const CONTACT_MESSAGES = {
  nameRequired: "Please enter your full name.",
  nameTooLong: "Name must be 80 characters or fewer.",
  emailInvalid: "Please enter a valid email address.",
  questionTooShort: "Please tell us a bit more (at least 10 characters).",
  questionTooLong: "Question must be 1000 characters or fewer.",
  success: "Thanks! We'll get back to you within 24 hours.",
} as const;

const M = CONTACT_MESSAGES;

export const contactSchema = z.object({
  name: z.string().trim().min(2, M.nameRequired).max(80, M.nameTooLong),
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: M.emailInvalid })),
  question: z.string().trim().min(10, M.questionTooShort).max(1000, M.questionTooLong),
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
