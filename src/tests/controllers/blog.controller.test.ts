import { addUserBlog, deleteUserBlog, getAllBlogs, updateUserBlog } from "../../controllers/blog.controller";
import { addUserBlogService, deleteUserBlogService, getAllBlogsService, updateUserBlogService } from "../../services/blog.service";
import { verifyToken } from "../../utils/token";
import { validateBlogData } from "../../utils/validation";


jest.mock("../utils/token");
jest.mock("../utils/validation");
jest.mock("../services/blog.service");

describe("Blog Controller", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        req = { params: {}, body: {}, query: {}, cookies: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe("getAllBlogs", () => {
        it("should fetch all blogs with categories", async () => {
            req.query.categories = "tech,science";
            const mockBlogs = [{ id: 1, title: "Blog1" }];
            (getAllBlogsService as jest.Mock).mockResolvedValue(mockBlogs);

            await getAllBlogs(req, res);

            expect(getAllBlogsService).toHaveBeenCalledWith(["tech", "science"]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "All blogs fetched successfully",
                blogs: mockBlogs
            });
        });
    });

    describe("addUserBlog", () => {
        it("should add a new blog for the user", async () => {
            req.params.id = "1";
            req.cookies.token = "fakeToken";
            req.body = { title: "T", content: "C", category: ["Tech"] };

            (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
            (validateBlogData as jest.Mock).mockReturnValue({ title: "T", content: "C", category: ["tech"] });
            const mockAddedBlog = { id: 10, title: "T" };
            (addUserBlogService as jest.Mock).mockResolvedValue(mockAddedBlog);

            await addUserBlog(req, res);

            expect(verifyToken).toHaveBeenCalledWith("fakeToken");
            expect(validateBlogData).toHaveBeenCalledWith({
                title: "T",
                content: "C",
                category: ["tech"]
            });
            expect(addUserBlogService).toHaveBeenCalledWith(1, { title: "T", content: "C", category: ["tech"] });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Add Blog successfully",
                addedBlog: mockAddedBlog
            });
        });
    });

    describe("updateUserBlog", () => {
        it("should update a blog", async () => {
            req.params.id = "5";
            req.cookies.token = "fakeToken";
            req.body = { title: "Updated", content: "Updated Content", category: ["Tech"] };

            (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
            (validateBlogData as jest.Mock).mockReturnValue({
                title: "Updated",
                content: "Updated Content",
                category: ["tech"]
            });
            const mockUpdatedBlog = { id: 5, title: "Updated" };
            (updateUserBlogService as jest.Mock).mockResolvedValue(mockUpdatedBlog);

            await updateUserBlog(req, res);

            expect(updateUserBlogService).toHaveBeenCalledWith(1, {
                blogId: 5,
                title: "Updated",
                content: "Updated Content",
                category: ["tech"]
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Update Blog successfully",
                updateBlog: mockUpdatedBlog
            });
        });
    });

    describe("deleteUserBlog", () => {
        it("should delete a blog", async () => {
            req.params.id = "3";
            req.cookies.token = "fakeToken";

            (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
            const mockDeletedBlog = { id: 3, title: "Deleted" };
            (deleteUserBlogService as jest.Mock).mockResolvedValue(mockDeletedBlog);

            await deleteUserBlog(req, res);

            expect(deleteUserBlogService).toHaveBeenCalledWith(1, 3);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Delete Blog successfully",
                deletedBlog: mockDeletedBlog
            });
        });
    });
});
