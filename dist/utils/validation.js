import { userLogInSchema, userSignUpSchema } from "../models/validationSchema.js";
export const validateUserSignUp = (data) => {
    const { name, email, password } = data;
    userSignUpSchema.parse({
        name,
        email,
        password
    });
    return { name, email, password };
};
export const validateUserLogIn = (data) => {
    const { email, password } = data;
    userLogInSchema.parse({
        email,
        password
    });
    return { email, password };
};
//# sourceMappingURL=validation.js.map