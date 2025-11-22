import z from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is required")
      .regex(/^[A-Za-z\s]+$/, "Name should contain only letters and spaces")
      .min(2, "Name must be at least 2 characters")
      .max(25, "Name cannot exceed 25 characters"),

    email: z.string().nonempty("Email is required").email("Invalid email"),

    phone: z
      .string()
      .nonempty("Phone number is required")
      .regex(/^[0-9]+$/, "Phone must contain only digits")
      .min(10, "Phone must be exactly 10 digits")
      .max(10, "Phone must be exactly 10 digits"),

    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signinSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty("New password is required")
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  otp: z
    .string()
    .nonempty("OTP is required")
    .regex(/^[0-9]+$/, "OTP must contain only numbers")
    .length(6, "OTP must be 6 digits"),
});

export const emailSchema = z.object({
  email: z.string().nonempty("email is required").email("Invalid email format"),
});
