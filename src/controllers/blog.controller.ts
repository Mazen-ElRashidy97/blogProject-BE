import { verifyToken } from "../utils/token";
import { validateBlogData, validateCategoryQuery } from "../utils/validation";
import { addUserBlogService, deleteUserBlogService, getAllBlogsService, updateUserBlogService } from "../services/blog.service";

//all apis should return data with category
export const getAllBlogs = async (req: any, res: any) => {
    const categoriesParam = req.query.categories as string;

    const blogs = await getAllBlogsService(categoriesParam);

    res.status(200).json({ message: "All blogs fetched successfully", blogs });
}

export const addUserBlog = async (req: any, res: any) => {
    const userId = req.headers['x-auth-userId'];
    if (!userId) throw new Error('User ID not found in headers');

    const { title, content, category } = req.body;

    const addedBlog = await addUserBlogService(userId, {title, content, category });

    res.status(201).json({ message: "Add Blog successfully", addedBlog });
}

export const updateUserBlog = async (req: any, res: any) => {
    const userId = req.headers['x-auth-userId'];
    if (!userId) throw new Error('User ID not found in headers');

    const blogId = parseInt(req.params.id);
    const { title, content, category } = req.body;

    const updateBlog = await updateUserBlogService(userId as number, { title, content, category, blogId});

    res.status(200).json({ message: "Update Blog successfully", updateBlog });
}

export const deleteUserBlog = async (req: any, res: any) => {
    const blogId = parseInt(req.params.id);
    const userId = req.headers['x-auth-userId'];
    if (!userId) throw new Error('User ID not found in headers');

    await deleteUserBlogService(userId as number, blogId);

    res.status(204).json({ message: "Delete Blog successfully" });
}