"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export type SignupFormState = {
  fullName: string;
  setFullName: (nextName: string) => void;
  organizationName: string;
  setOrganizationName: (nextName: string) => void;
  emailAddress: string;
  setEmailAddress: (nextEmail: string) => void;
  passwordValue: string;
  setPasswordValue: (nextPassword: string) => void;
  formErrorMessage: string | null;
  isSubmitting: boolean;
  submitSignupForm: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

/**
 * Form + auth data for workspace creation. Keeps field state out of the JSX.
 *
 * @returns Controlled field values, pending/error flags, and the submit handler.
 */
export function useSignupForm(): SignupFormState {
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitSignupForm(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setFormErrorMessage(null);
    const result = await signUp({
      email: emailAddress,
      password: passwordValue,
      fullName,
      organizationName,
    });
    setIsSubmitting(false);
    if (result.error) {
      setFormErrorMessage(result.error);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return {
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
  };
}
