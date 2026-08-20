"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { readSafeInternalPath } from "@/lib/auth/safe-next-path";

export type LoginFormState = {
  emailAddress: string;
  setEmailAddress: (nextEmail: string) => void;
  passwordValue: string;
  setPasswordValue: (nextPassword: string) => void;
  formErrorMessage: string | null;
  isSubmitting: boolean;
  submitLoginForm: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

/**
 * Form + auth data for the sign-in page. Keeps field state out of the JSX.
 *
 * @returns Controlled field values, pending/error flags, and the submit handler.
 */
export function useLoginForm(): LoginFormState {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [emailAddress, setEmailAddress] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLoginForm(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setFormErrorMessage(null);
    const result = await signIn(emailAddress, passwordValue);
    setIsSubmitting(false);
    if (result.error) {
      setFormErrorMessage(result.error);
      return;
    }
    const destinationPath = readSafeInternalPath(searchParams.get("next"), "/dashboard");
    router.replace(destinationPath);
    router.refresh();
  }

  return {
    emailAddress,
    setEmailAddress,
    passwordValue,
    setPasswordValue,
    formErrorMessage,
    isSubmitting,
    submitLoginForm,
  };
}
