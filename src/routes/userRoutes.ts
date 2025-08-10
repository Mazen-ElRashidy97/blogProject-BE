import express from "express";
import { asyncMiddleware } from "../middleware/asyncMiddleware";
import { loginUser, registerUser } from "../controllers/user.controller";

export const router = express.Router();


router.post("/signUp", asyncMiddleware(registerUser));
router.post("/logIn", asyncMiddleware(loginUser));