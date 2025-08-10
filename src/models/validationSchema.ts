import { z } from "zod";

export const userSignUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const userLogInSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const blogDataSchema = z.object({
    title: z.string(),
    content: z.string(),
    category: z.array(z.string())
});