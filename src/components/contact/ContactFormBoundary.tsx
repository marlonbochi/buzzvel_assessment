"use client";

import { Component, type ComponentProps } from "react";
import type { ContactField } from "@/lib/contact-schema";
import { ContactForm } from "./ContactForm";

type Props = Pick<ComponentProps<typeof ContactForm>, "action">;
type State = { failures: number };

/**
 * If the Server Action request itself fails (offline, or a stale action ID after a deploy),
 * React rethrows from `useActionState` and would replace the page with the error screen.
 * This boundary catches it and remounts the form with the user's values and an inline error.
 *
 * The form keeps the real Server Action reference, so the no-JavaScript path is unaffected.
 */
export class ContactFormBoundary extends Component<Props, State> {
  state: State = { failures: 0 };
  private lastValues: Partial<Record<ContactField, string>> = {};

  static getDerivedStateFromError(): Partial<State> {
    return {};
  }

  componentDidCatch() {
    this.setState((prev) => ({ failures: prev.failures + 1 }));
  }

  private remember = (values: Record<ContactField, string>) => {
    this.lastValues = values;
  };

  render() {
    const { failures } = this.state;
    return (
      <ContactForm
        key={failures}
        action={this.props.action}
        failed={failures > 0}
        initialValues={failures > 0 ? this.lastValues : undefined}
        onSubmitValues={this.remember}
      />
    );
  }
}
