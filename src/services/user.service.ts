
import bcrypt from "bcrypt";
import { getUserFromDatabase, signUpUserToDatabase } from "../utils/database";
import { createToken } from "../utils/token";
import { UserLogInServiceRes } from "../models/models";


export const userSignUpService = async (name: string, email: string, password: string) => {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // add using single query and check email conflict as well or not 
    const result = await signUpUserToDatabase(name, email, hashedPassword);

    // Check if the user was created successfully
    if (!result) {
        throw new Error("User registration failed");
    }
    return result;
}

export const userLogInService = async (email: string, password: string): Promise<UserLogInServiceRes> => {
    // send the email and retrieve the user
    const userResult = await getUserFromDatabase(email, password);

    // compare password to databse
    const isMatch = await bcrypt.compare(password, userResult.password);

    if (!isMatch) {
        throw new Error('Wrong email or password!');
    }

    // create token and secret 
    const token = await createToken({ id: userResult.id, email: userResult.email })

    // send the data without the password
    const { password: _, ...userData } = userResult;

    return { ...userData, token }

}