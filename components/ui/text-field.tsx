import type { InputHTMLAttributes } from "react";
import { controlClasses } from "@/lib/ui/layout-classes";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/**
 * Labeled text/email/password input used by auth forms.
 *
 * @param props.label - Visible label text.
 * @param props - Native input attributes (`type`, `value`, `onChange`, …).
 * @returns A stacked label + input.
 */
export function TextField({ label, id, name, className, ...inputProps }: TextFieldProps) {
  const fieldId = id ?? name;
  return (
    <label className={controlClasses.fieldLabel} htmlFor={fieldId}>
      {label}
      <input
        id={fieldId}
        name={name}
        className={className ?? controlClasses.textField}
        {...inputProps}
      />
    </label>
  );
}
