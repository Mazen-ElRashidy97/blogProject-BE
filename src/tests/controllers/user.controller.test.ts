
import { loginUser, registerUser } from "../../controllers/user.controller";
import { userLogInService, userSignUpService } from "../../services/user.service";
import { validateUserLogIn, validateUserSignUp } from "../../utils/validation";

// Mock the imports
jest.mock("../../src/services/user.service");
jest.mock("../../src/utils/validation");

describe("User Controller", () => {
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            body: {},
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis(),
        };
    });

    describe("registerUser", () => {
        it("should validate input, call service, and send a 201 response", async () => {
            // Arrange
            mockReq.body = { name: "John", email: "john@example.com", password: "pass123" };
            (validateUserSignUp as jest.Mock).mockReturnValue(mockReq.body);
            (userSignUpService as jest.Mock).mockResolvedValue({ id: 1, name: "John", email: "john@example.com" });

            // Act
            await registerUser(mockReq, mockRes);

            // Assert
            expect(validateUserSignUp).toHaveBeenCalledWith(mockReq.body);
            expect(userSignUpService).toHaveBeenCalledWith("John", "john@example.com", "pass123");
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "User created",
                user: { id: 1, name: "John", email: "john@example.com" },
            });
        });
    });

    describe("loginUser", () => {
        it("should validate input, call service, set cookie, and send a 200 response", async () => {
            // Arrange
            mockReq.body = { email: "john@example.com", password: "pass123" };
            (validateUserLogIn as jest.Mock).mockReturnValue(mockReq.body);
            (userLogInService as jest.Mock).mockResolvedValue({
                id: 1,
                name: "John",
                email: "john@example.com",
                token: "fake-token",
            });

            // Act
            await loginUser(mockReq, mockRes);

            // Assert
            expect(validateUserLogIn).toHaveBeenCalledWith(mockReq.body);
            expect(userLogInService).toHaveBeenCalledWith("john@example.com", "pass123");
            expect(mockRes.cookie).toHaveBeenCalledWith("token", "fake-token", { httpOnly: true });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Login successful",
                user: {
                    id: 1,
                    name: "John",
                    email: "john@example.com",
                    token: "fake-token",
                },
            });
        });
    });
});
