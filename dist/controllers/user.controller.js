import { validateUserLogIn, validateUserSignUp } from "../utils/validation.js";
import { userLogInService, userSignUpService } from "../services/user.service.js";
export const registerUser = async (req, res) => {
    const { name, email, password } = validateUserSignUp(req.body);
    const result = await userSignUpService(name, email, password);
    res.status(201).json({ message: "User created", user: result });
};
export const loginUser = async (req, res) => {
    const { email, password } = validateUserLogIn(req.body);
    const userLogged = await userLogInService(email, password);
    res.cookie('token', userLogged.token, {
        httpOnly: true,
    }).status(200).json({ message: "Login successful" });
};
//# sourceMappingURL=user.controller.js.map