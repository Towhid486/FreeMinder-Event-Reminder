import jwt, { SignOptions } from 'jsonwebtoken';

export const EncodeToken = (email: string, user_id: string) => {
    const KEY = process.env.JWT_SECRET_KEY;
    const EXPIRE: SignOptions = { expiresIn: '30d' };
    const PAYLOAD = { email, user_id };
    return jwt.sign(PAYLOAD, KEY as string, EXPIRE);
};

export const DecodeToken = (token: string) => {
    try {
        const KEY = process.env.JWT_SECRET_KEY;
        return jwt.verify(token, KEY as string);
    } catch (e) {
        return null;
    }
};