import bcrypt from 'bcrypt';
import { getUserFromDatabase, signUpUserToDatabase } from '../../utils/database';
import { userLogInService, userSignUpService } from '../../services/user.service';
import { createToken } from '../../utils/token';


jest.mock('bcrypt');
jest.mock('../../src/utils/database');
jest.mock('../../src/utils/token');

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('userSignUpService', () => {
        it('should hash password and create user successfully', async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');
            (signUpUserToDatabase as jest.Mock).mockResolvedValue({
                id: 1, name: 'John', email: 'john@example.com'
            });

            const result = await userSignUpService('John', 'john@example.com', 'Password123');

            expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);
            expect(signUpUserToDatabase).toHaveBeenCalledWith('John', 'john@example.com', 'hashed_pass');
            expect(result).toEqual({ id: 1, name: 'John', email: 'john@example.com' });
        });

        it('should throw error if user creation fails', async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');
            (signUpUserToDatabase as jest.Mock).mockResolvedValue(null);

            await expect(
                userSignUpService('John', 'john@example.com', 'Password123')
            ).rejects.toThrow('User registration failed');
        });
    });

    describe('userLogInService', () => {
        it('should log in user and return token', async () => {
            const fakeUser = { id: 1, email: 'john@example.com', password: 'hashed_pass' };

            (getUserFromDatabase as jest.Mock).mockResolvedValue(fakeUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockResolvedValue('fake_token');

            const result = await userLogInService('john@example.com', 'Password123');

            expect(getUserFromDatabase).toHaveBeenCalledWith('john@example.com', 'Password123');
            expect(bcrypt.compare).toHaveBeenCalledWith('Password123', 'hashed_pass');
            expect(createToken).toHaveBeenCalledWith({ id: 1, email: 'john@example.com' });
            expect(result).toEqual({ id: 1, email: 'john@example.com', token: 'fake_token' });
        });

        it('should throw error if password does not match', async () => {
            const fakeUser = { id: 1, email: 'john@example.com', password: 'hashed_pass' };

            (getUserFromDatabase as jest.Mock).mockResolvedValue(fakeUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                userLogInService('john@example.com', 'wrongpass')
            ).rejects.toThrow('Wrong email or password!');
        });
    });
});
