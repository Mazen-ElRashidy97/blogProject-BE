
import { addBlogInDatabase, checkUserOwnsBlog, deleteBlogInDatabase, getBlogsFromDatabase, updateBlogInDatabase } from "../utils/database";
import { BlogDataBody, BlogDataBodyUpdate } from "../models/models";
import { validateBlogData, validateCategoryQuery } from "../utils/validation";


export const getAllBlogsService = async (categoriesParam?: string) => {
    let categories: string[] | undefined;

    if (categoriesParam) {
        categories = validateCategoryQuery(categoriesParam);
    }
    
    const blogs = await getBlogsFromDatabase(categories);

    return blogs;
}

export const addUserBlogService = async (userId: number, blogData: BlogDataBody) => {
    const { title, content, category } = blogData;
    const validatedBlogData = validateBlogData({ title, content, category });

    const categorySmallCase = validatedBlogData?.category.map((e: string) => e.toLowerCase());
    const addedBlog = await addBlogInDatabase(userId, { ...blogData, category: categorySmallCase });

    return addedBlog;
}

export const updateUserBlogService = async (userId: number, blogData: BlogDataBodyUpdate) => {
    const userBlog = await checkUserOwnsBlog(userId, blogData.blogId);
    if (!userBlog) throw new Error(`Not user's blog`);

    const { title, content, category } = blogData;

    const validatedBlogData = validateBlogData({ title, content, category });

    const categorySmallCase = validatedBlogData?.category.map((e: string) => e.toLowerCase());

    const updatedBlog = await updateBlogInDatabase(userId, blogData);

    return updatedBlog
}

export const deleteUserBlogService = async (userId: number, blogId: number) => {
    const userBlog = await checkUserOwnsBlog(userId, blogId);
    if (!userBlog) throw new Error(`Not user's blog`);

    const deletedBlog = await deleteBlogInDatabase(userId, blogId);

    return deletedBlog;
}