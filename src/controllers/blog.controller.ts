import { verifyToken } from "../utils/token";
import { validateBlogData } from "../utils/validation";
import { addUserBlogService, deleteUserBlogService, getAllBlogsService, updateUserBlogService } from "../services/blog.service";


export const getAllBlogs = async (req: any, res: any) => { //in progress
    const categoriesParam = req.query.categories as string;
    const categories = categoriesParam ? categoriesParam.split(',') : [];

    const blogs = await getAllBlogsService(categories);

    res.status(200).json({ message: "All blogs fetched successfully", blogs });
}

export const addUserBlog = async (req: any, res: any) => {
    const userId = parseInt(req.params.id);
    const token = req.cookies.token;
    const payload = await verifyToken(token);
    const { title, content, category } = req.body;
    const categorySmallCase = category.map((e: string) => e.toLowerCase());

    const blogData = validateBlogData({ title, content, category: categorySmallCase });

    if (!token) throw new Error('No token found');

    if (payload.id !== userId) throw new Error('Unauthorized');

    if (!blogData) throw new Error('Invalid blog data');

    const addedBlog = await addUserBlogService(payload.id, blogData);

    res.status(200).json({ message: "Add Blog successfully", addedBlog });
}

export const updateUserBlog = async (req: any, res: any) => {
    const blogId = parseInt(req.params.id);
    const { title, content, category } = req.body;
    const categorySmallCase = category.map((e: string) => e.toLowerCase());

    const token = req.cookies.token;
    const payload = await verifyToken(token);

    const blogData = validateBlogData({ title, content, category: categorySmallCase });

    if (!token) throw new Error('No token found');

    console.log('mazen')

    const updateBlog = await updateUserBlogService(payload.id as number, { ...blogData, blogId});

    res.status(200).json({ message: "Update Blog successfully", updateBlog });
}

export const deleteUserBlog = async (req: any, res: any) => {
    const blogId = parseInt(req.params.id);
    const token = req.cookies.token;
    const payload = await verifyToken(token);

    if (!token) throw new Error('No token found');

    const deletedBlog = await deleteUserBlogService(payload.id as number, blogId);

    res.status(200).json({ message: "Delete Blog successfully", deletedBlog });
}