import { BlogDataBody, UserLoginBody, UserSignUpBody } from "../models/models";
import { z } from "zod";
import { blogDataSchema, userLogInSchema, userSignUpSchema } from "../models/validationSchema";


export const validateUserSignUp = (data: UserSignUpBody): UserSignUpBody => {

    const { name, email, password } = data;
    userSignUpSchema.parse({
        name,
        email,
        password
    });

    return { name, email, password };
}

export const validateUserLogIn = (data: UserLoginBody): UserLoginBody => {

    const { email, password } = data;
    userLogInSchema.parse({
        email,
        password
    });

    return { email, password };
}

export const validateBlogData = (data: BlogDataBody): BlogDataBody => {

    const { title, content, category } = data;
    blogDataSchema.parse({
        title,
        content,
        category
    });
    

    return { title, content, category };
}