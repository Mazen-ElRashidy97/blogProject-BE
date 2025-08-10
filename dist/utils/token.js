import { jwtVerify, SignJWT } from 'jose';
export const verifyToken = async (token) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // const { jwtVerify } = await import('jose');
    const { payload } = await jwtVerify(token, secret);
    return payload;
};
export const createToken = async (user) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // const { SignJWT } = await import('jose');
    return new SignJWT({ id: user.id, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);
};
//# sourceMappingURL=token.js.map