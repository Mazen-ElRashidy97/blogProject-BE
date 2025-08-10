
import { validateBlogData, validateUserLogIn, validateUserSignUp } from '../../utils/validation';
import { ZodError } from 'zod';

describe('Validation Utils', () => {
    describe('validateUserSignUp', () => {
        it('should return data when valid', () => {
            const data = { name: 'John', email: 'john@example.com', password: 'Password123' };
            expect(validateUserSignUp(data)).toEqual(data);
        });

        it('should throw ZodError when invalid', () => {
            const data = { name: '', email: 'bademail', password: '123' };
            expect(() => validateUserSignUp(data as any)).toThrow(ZodError);
        });
    });

    describe('validateUserLogIn', () => {
        it('should return data when valid', () => {
            const data = { email: 'john@example.com', password: 'Password123' };
            expect(validateUserLogIn(data)).toEqual(data);
        });

        it('should throw ZodError when invalid', () => {
            const data = { email: 'bademail', password: '' };
            expect(() => validateUserLogIn(data as any)).toThrow(ZodError);
        });
    });

    describe('validateBlogData', () => {
        it('should return data when valid', () => {
            const data = { title: 'My Blog', content: 'Content', category: ['tech'] };
            expect(validateBlogData(data)).toEqual(data);
        });

        it('should throw ZodError when invalid', () => {
            const data = { title: '', content: '', category: [] };
            expect(() => validateBlogData(data as any)).toThrow(ZodError);
        });
    });
});
