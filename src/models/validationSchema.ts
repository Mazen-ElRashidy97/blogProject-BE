import { array, z } from "zod";

export const userSignUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z
        .string()
        .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "weak password, must contain 6 characters, uppercase, number, special character required."
        )

});

export const userLogInSchema = z.object({
    email: z.email(),
    password: z.string().regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "weak password, must contain 6 characters, uppercase, number, special character required."
    )
});

export const blogDataSchema = z.object({
    title: z.string(),
    content: z.string(),
    category: z.array(
        z.string().regex(
            /^[a-z]+$/,
            "Each category must start with a capital letter."
        )
    )
});


export const categoryQuery = z.string().regex(
    /^[a-z]+$/,
    "Each category must start with uppercase and contain only letters"
);

export const categoriesQuerySchema = z
    .string()
    .transform(val => val.split(","))
    .pipe(z.array(categoryQuery));