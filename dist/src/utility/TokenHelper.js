"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecodeToken = exports.EncodeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EncodeToken = (email, user_id) => {
    const KEY = process.env.JWT_SECRET_KEY;
    const EXPIRE = { expiresIn: '30d' };
    const PAYLOAD = { email, user_id };
    return jsonwebtoken_1.default.sign(PAYLOAD, KEY, EXPIRE);
};
exports.EncodeToken = EncodeToken;
const DecodeToken = (token) => {
    try {
        const KEY = process.env.JWT_SECRET_KEY;
        return jsonwebtoken_1.default.verify(token, KEY);
    }
    catch (e) {
        return null;
    }
};
exports.DecodeToken = DecodeToken;
