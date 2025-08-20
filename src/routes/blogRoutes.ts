import express from "express";
import { asyncMiddleware } from "../middleware/asyncMiddleware";
import { addUserBlog, deleteUserBlog, getAllBlogs, updateUserBlog } from "../controllers/blog.controller";
import { authenticateUser } from "../middleware/auth";


export const router = express.Router();


router.get("/", asyncMiddleware(getAllBlogs));
router.post("/add", authenticateUser, asyncMiddleware(addUserBlog));
router.put("/:id", authenticateUser, asyncMiddleware(updateUserBlog));
router.delete("/:id", authenticateUser, asyncMiddleware(deleteUserBlog)); 