import bcrypt from "bcrypt";
import { userLogInService, userSignUpService } from "../services/user.service";
import { validateUserLogIn, validateUserSignUp } from "../utils/validation";


export const registerUser = async (req: any, res: any) => {
    const { name, email, password } = req.body;
    const user = validateUserSignUp({ name, email, password });
    const result = await userSignUpService(user.name, user.email, user.password);

    res.status(201).json({ message: "User created", user: result });
};

export const loginUser = async (req: any, res: any) => {
    const { email, password } = req.body;
    const user = validateUserLogIn({ email, password });
    const userLogged = await userLogInService(user.email, user.password);

    res.cookie('token', userLogged.token, {
        httpOnly: true,
    }).status(200).json({ message: "Login successful", user: userLogged });

}
