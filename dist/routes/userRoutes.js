import express from "express";
import { asyncMiddleware } from "../middleware/asyncMiddleware.js";
import { loginUser, registerUser } from "../controllers/user.controller.js";
export const router = express.Router();
router.post("/signUp", asyncMiddleware(registerUser));
router.post("/logIn", asyncMiddleware(loginUser));
//# sourceMappingURL=userRoutes.js.map