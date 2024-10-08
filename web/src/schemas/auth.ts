import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).min(1, "Email is required").email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
});

export const SignUpSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(3, { message: "Name should be more than 3 characters" }),
  email: z.string({ required_error: "Email is required" }).min(1, "Email is required").email({ message: "Invalid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    phoneNumber: z.optional(z.string().refine((value) => /^\+91[- ]?[4-9]\d{9}$/.test(value))),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) return false;
      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (!data.password && data.newPassword) return false;
      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );