
import { addBlogInDatabase, checkUserOwnsBlog, deleteBlogInDatabase, getBlogsFromDatabase, updateBlogInDatabase } from "../utils/database";
import { BlogDataBody, BlogDataBodyUpdate } from "../models/models";


export const getAllBlogsService = async (categories?: string[]) => {
    const blogs = await getBlogsFromDatabase(categories);

    return blogs;
}

export const addUserBlogService = async (userId: number, blogData: BlogDataBody) => {
    const addedBlog = await addBlogInDatabase(userId, blogData);

    return addedBlog;
}

export const updateUserBlogService = async (userId: number, blogData: BlogDataBodyUpdate) => {
    const userBlog = await checkUserOwnsBlog(userId, blogData.blogId);
    if (!userBlog) throw new Error(`Not user's blog`);

    const updatedBlog = await updateBlogInDatabase(userId, blogData);

    return updatedBlog
}

export const deleteUserBlogService = async (userId: number, blogId: number) => {
    const userBlog = await checkUserOwnsBlog(userId, blogId);
    if (!userBlog) throw new Error(`Not user's blog`);

    const deletedBlog = await deleteBlogInDatabase(userId, blogId);

    return deletedBlog;
}