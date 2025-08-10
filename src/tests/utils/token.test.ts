
import { createToken, verifyToken } from "../../utils/token";


jest.mock('jose', () => ({
    jwtVerify: jest.fn().mockResolvedValue({ payload: { id: 1, email: 'test@example.com' } }),
    SignJWT: jest.fn().mockImplementation(() => ({
        setProtectedHeader: jest.fn().mockReturnThis(),
        setIssuedAt: jest.fn().mockReturnThis(),
        setExpirationTime: jest.fn().mockReturnThis(),
        sign: jest.fn().mockResolvedValue('mocked-token')
    }))
}));

describe('Token Utils', () => {
    beforeAll(() => {
        process.env.JWT_SECRET = 'testsecret';
    });

    describe('verifyToken', () => {
        it('should return payload from jwtVerify', async () => {
            const payload = await verifyToken('fake-token');
            expect(payload).toEqual({ id: 1, email: 'test@example.com' });
        });
    });

    describe('createToken', () => {
        it('should return a token string', async () => {
            const token = await createToken({ id: 1, email: 'test@example.com' });
            expect(token).toBe('mocked-token');
        });
    });
});
