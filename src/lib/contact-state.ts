import type { ContactFieldErrors, ContactInput } from "./contact-schema";

/**
 * Lives outside the "use server" module: files with that directive may only export async functions.
 * `submissionId` increments on every success so the client can reset the form exactly once.
 */
export type ContactFormState = {
  status: "idle" | "error" | "success";
  errors: ContactFieldErrors;
  values: Partial<ContactInput>;
  submissionId: number;
};

export const initialContactState: ContactFormState = {
  status: "idle",
  errors: {},
  values: {},
  submissionId: 0,
};
