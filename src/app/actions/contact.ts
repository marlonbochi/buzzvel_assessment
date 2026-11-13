"use server";

import { validateContact, type ContactField } from "@/lib/contact-schema";
import type { ContactFormState } from "@/lib/contact-state";

const FIELDS: ContactField[] = ["name", "email", "question"];

/**
 * Simulated delivery: validates, waits briefly so the pending state is perceivable, and reports.
 * Nothing leaves the server — backend and email delivery are out of scope (spec §2).
 */
export async function submitContact(
  prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = Object.fromEntries(
    FIELDS.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  ) as Record<ContactField, string>;

  const result = validateContact(raw);
  if (!result.success) {
    return { status: "error", errors: result.errors, values: raw, submissionId: prev.submissionId };
  }

  const delay = Number(process.env.CONTACT_DELAY_MS ?? 600);
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));

  return { status: "success", errors: {}, values: {}, submissionId: prev.submissionId + 1 };
}
