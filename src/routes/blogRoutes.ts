import express from "express";
import { asyncMiddleware } from "../middleware/asyncMiddleware";
import { addUserBlog, deleteUserBlog, getAllBlogs, updateUserBlog } from "../controllers/blog.controller";


export const router = express.Router();


router.get("/",asyncMiddleware(getAllBlogs));
router.post("/:id", asyncMiddleware(addUserBlog));
router.put("/:id", asyncMiddleware(updateUserBlog));
router.delete("/:id", asyncMiddleware(deleteUserBlog)); 