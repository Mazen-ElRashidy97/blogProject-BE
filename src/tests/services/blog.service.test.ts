import { addUserBlogService, deleteUserBlogService, getAllBlogsService, updateUserBlogService } from "../../services/blog.service";
import { addBlogInDatabase, deleteBlogInDatabase, getBlogsFromDatabase, updateBlogInDatabase } from "../../utils/database";


jest.mock("../utils/database");

describe("Blog Services", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllBlogsService", () => {
        it("should call getBlogsFromDatabase with categories and return blogs", async () => {
            const mockBlogs = [{ id: 1, title: "Test Blog" }];
            (getBlogsFromDatabase as jest.Mock).mockResolvedValue(mockBlogs);

            const result = await getAllBlogsService(["tech"]);
            expect(getBlogsFromDatabase).toHaveBeenCalledWith(["tech"]);
            expect(result).toEqual(mockBlogs);
        });
    });

    describe("addUserBlogService", () => {
        it("should call addBlogInDatabase and return added blog", async () => {
            const blogData = { title: "Test", content: "Content", category: ["tech"] };
            const mockBlog = { id: 1, ...blogData };
            (addBlogInDatabase as jest.Mock).mockResolvedValue(mockBlog);

            const result = await addUserBlogService(1, blogData);
            expect(addBlogInDatabase).toHaveBeenCalledWith(1, blogData);
            expect(result).toEqual(mockBlog);
        });
    });

    describe("updateUserBlogService", () => {
        it("should call updateBlogInDatabase and return updated blog", async () => {
            const blogData = { blogId: 1, title: "Updated", content: "Updated content", category: ["tech"] };
            const mockUpdatedBlog = { id: 1, ...blogData };
            (updateBlogInDatabase as jest.Mock).mockResolvedValue(mockUpdatedBlog);

            const result = await updateUserBlogService(1, blogData);
            expect(updateBlogInDatabase).toHaveBeenCalledWith(1, blogData);
            expect(result).toEqual(mockUpdatedBlog);
        });
    });

    describe("deleteUserBlogService", () => {
        it("should call deleteBlogInDatabase and return deleted blog", async () => {
            const mockDeletedBlog = { id: 1, title: "Deleted" };
            (deleteBlogInDatabase as jest.Mock).mockResolvedValue(mockDeletedBlog);

            const result = await deleteUserBlogService(1, 1);
            expect(deleteBlogInDatabase).toHaveBeenCalledWith(1, 1);
            expect(result).toEqual(mockDeletedBlog);
        });
    });
});
