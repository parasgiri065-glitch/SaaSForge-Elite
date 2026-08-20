"use client";

import { TextField } from "@/components/ui/text-field";
import { useLoginForm } from "@/hooks/use-login-form";
import { controlClasses, layoutClasses } from "@/lib/ui/layout-classes";

/**
 * Sign-in form. Field state lives in `useLoginForm`.
 *
 * @returns Email/password form that redirects on success.
 */
export function LoginForm() {
  const {
    emailAddress,
    setEmailAddress,
    passwordValue,
    setPasswordValue,
    formErrorMessage,
    isSubmitting,
    submitLoginForm,
  } = useLoginForm();

  return (
    <form onSubmit={submitLoginForm} className={layoutClasses.authForm}>
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
        autoComplete="current-password"
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
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
