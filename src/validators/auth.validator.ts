import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
})


export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
    password: z
    .string() 
    .min(8, { message: "Password must be at least 8 characters long" }) // checks for character length
    .max(20, { message: "Password must be at most 20 characters long" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],

});


export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput=z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput=z.infer<typeof resetPasswordSchema>;