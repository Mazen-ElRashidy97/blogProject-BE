import { verifyToken } from "../utils/token";

export const authenticateUser = async (req: any, res: any, next: any) => {
    try {
        const token = req.cookies.token;;
        if (!token) {
            return next(new Error("Unauthorized")); // Goes to error handler
        }

        const payload = await verifyToken(token);

        // Add token to request headers for next middleware to handle
        req.headers['x-auth-userId'] = payload.id;

        next();
    } catch (err) {
        next(err); 
    }
}