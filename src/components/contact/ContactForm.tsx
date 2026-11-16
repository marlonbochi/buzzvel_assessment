"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { contactForm } from "@/content";
import {
  CONTACT_FIELDS,
  type ContactInput,
  CONTACT_MESSAGES,
  validateContact,
  type ContactField,
  type ContactFieldErrors,
} from "@/lib/contact-schema";
import { initialContactState, type ContactFormState } from "@/lib/contact-state";
import { FormField } from "./FormField";

type ContactFormProps = {
  /** Injectable for tests and stories; defaults to the real Server Action. */
  action?: (prev: ContactFormState, data: FormData) => Promise<ContactFormState>;
  /** Values to restore, e.g. after a failed submission (see ContactFormBoundary). */
  initialValues?: Partial<ContactInput>;
  /** The previous attempt failed before reaching the server: show the error, focus the button. */
  failed?: boolean;
  /** Called with the values right before a valid submission is sent. */
  onSubmitValues?: (values: Record<ContactField, string>) => void;
};

const fieldConfig = {
  name: { type: "text", autoComplete: "name", multiline: false },
  email: { type: "email", autoComplete: "email", multiline: false },
  question: { type: "text", autoComplete: undefined, multiline: true },
} as const;

function readValues(form: HTMLFormElement) {
  const data = new FormData(form);
  return Object.fromEntries(CONTACT_FIELDS.map((f) => [f, String(data.get(f) ?? "")]));
}

/**
 * Validates on the client for instant feedback, then posts to the Server Action, which validates
 * again. Without JavaScript the form still posts and renders the server's errors or success.
 */
export function ContactForm({
  action = submitContact,
  initialValues,
  failed = false,
  onSubmitValues,
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialValues ? { ...initialContactState, values: initialValues } : initialContactState,
  );
  const submitRef = useRef<HTMLButtonElement>(null);
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});
  // Seeded from the initial state: without JavaScript, the server renders the action's result
  // as the first state, so its errors must show on the very first render.
  const [serverErrors, setServerErrors] = useState<ContactFieldErrors>(state.errors);
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [seenState, setSeenState] = useState(state);
  const submittingRef = useRef(false);

  // Adopt each new server response once (derived state, no effect needed).
  if (state !== seenState) {
    setSeenState(state);
    setServerErrors(state.errors);
    if (state.status === "success") {
      setClientErrors({});
      setTouched({});
      setAttempted(false);
    }
  }

  // A response arrived: allow the next submission.
  useEffect(() => {
    submittingRef.current = false;
  }, [state]);

  // Remounted after a failed attempt: put keyboard focus back where the user left it.
  useEffect(() => {
    if (failed) submitRef.current?.focus();
  }, [failed]);

  const showFailure = failed && state.status === "idle" && !isPending;

  const errors: ContactFieldErrors = { ...serverErrors, ...clientErrors };

  const revalidate = (form: HTMLFormElement, field: ContactField, force: boolean) => {
    if (!force && !touched[field] && !attempted) return;
    const result = validateContact(readValues(form));
    const message = result.success ? undefined : result.errors[field];
    setClientErrors((prev) => ({ ...prev, [field]: message }));
  };

  const fieldFrom = (target: EventTarget): ContactField | null => {
    const name = (target as HTMLInputElement).name as ContactField;
    return CONTACT_FIELDS.includes(name) ? name : null;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Block double submits while a request is in flight (Review Focus 2).
    if (isPending || submittingRef.current) {
      event.preventDefault();
      return;
    }
    const form = event.currentTarget;
    const values = readValues(form);
    const result = validateContact(values);
    setAttempted(true);
    if (!result.success) {
      event.preventDefault();
      setClientErrors(result.errors);
      const first = CONTACT_FIELDS.find((f) => result.errors[f]);
      if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setClientErrors({});
    submittingRef.current = true;
    onSubmitValues?.(values as Record<ContactField, string>);
  };

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="contact-form-title"
      className="flex flex-col gap-6"
      onBlur={(event) => {
        const field = fieldFrom(event.target);
        if (!field) return;
        setTouched((prev) => ({ ...prev, [field]: true }));
        revalidate(event.currentTarget, field, true);
      }}
      onChange={(event) => {
        const field = fieldFrom(event.target);
        if (!field) return;
        setServerErrors((prev) => ({ ...prev, [field]: undefined }));
        revalidate(event.currentTarget, field, false);
      }}
    >
      <div className="flex flex-col gap-2">
        <h3 id="contact-form-title" className="text-h5 text-text-primary">
          {contactForm.title}
        </h3>
        <p className="text-sm leading-6 text-text-secondary">{contactForm.description}</p>
      </div>

      <div className="flex flex-col gap-5">
        {CONTACT_FIELDS.map((field) => (
          <FormField
            key={`${field}-${state.submissionId}`}
            id={`contact-${field}`}
            name={field}
            label={contactForm.fields[field].label}
            placeholder={contactForm.fields[field].placeholder}
            type={fieldConfig[field].type}
            multiline={fieldConfig[field].multiline}
            autoComplete={fieldConfig[field].autoComplete}
            defaultValue={state.values[field]}
            error={errors[field]}
          />
        ))}
      </div>

      <Button
        ref={submitRef}
        type="submit"
        block="always"
        pending={isPending}
        pendingLabel={contactForm.pending}
      >
        {contactForm.submit}
      </Button>

      <p
        role="status"
        className={cx(
          "text-sm leading-6 font-semibold",
          showFailure ? "text-error" : "text-[#1d7a46]",
        )}
      >
        {showFailure
          ? CONTACT_MESSAGES.sendFailed
          : state.status === "success" && !isPending
            ? CONTACT_MESSAGES.success
            : ""}
      </p>
    </form>
  );
}
