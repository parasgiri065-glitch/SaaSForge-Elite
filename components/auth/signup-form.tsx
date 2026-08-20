"use client";

import { TextField } from "@/components/ui/text-field";
import { useSignupForm } from "@/hooks/use-signup-form";
import { controlClasses, layoutClasses } from "@/lib/ui/layout-classes";

/**
 * Workspace-creation form. Field state lives in `useSignupForm`.
 *
 * @returns Name/org/email/password form that redirects on success.
 */
export function SignupForm() {
  const {
    fullName,
    setFullName,
    organizationName,
    setOrganizationName,
    emailAddress,
    setEmailAddress,
    passwordValue,
    setPasswordValue,
    formErrorMessage,
    isSubmitting,
    submitSignupForm,
  } = useSignupForm();

  return (
    <form onSubmit={submitSignupForm} className={layoutClasses.authForm}>
      <TextField
        label="Full name"
        type="text"
        name="fullName"
        autoComplete="name"
        required
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
      />
      <TextField
        label="Organization"
        type="text"
        name="organizationName"
        required
        value={organizationName}
        onChange={(event) => setOrganizationName(event.target.value)}
      />
      <TextField
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={emailAddress}
        onChange={(event) => setEmailAddress(event.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        autoComplete="new-password"
        required
        minLength={8}
        value={passwordValue}
        onChange={(event) => setPasswordValue(event.target.value)}
      />
      {formErrorMessage ? (
        <p className="text-sm text-red-600" role="alert">
          {formErrorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className={controlClasses.submitButton}
      >
        {isSubmitting ? "Creating workspace…" : "Create workspace"}
      </button>
    </form>
  );
}
