import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(1, "Name is required").max(160),
  organizationName: z.string().trim().min(2, "Organization name is required").max(120),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
