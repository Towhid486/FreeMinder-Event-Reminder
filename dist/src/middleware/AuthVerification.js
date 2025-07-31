"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TokenHelper_1 = require("../utility/TokenHelper");
const AuthVerification = (req, res, next) => {
    // Receive Token
    let token = req.headers['token'];
    if (!token) {
        token = req.cookies['recruiter_token'] || req.cookies['user_token'];
    }
    // Token Decode
    let decoded = (0, TokenHelper_1.DecodeToken)(token);
    // Request Header Email+UserID Add
    if (decoded === null) {
        return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }
    else {
        let email = decoded['email'];
        let user_id = decoded['user_id'];
        req.headers.email = email;
        req.headers.user_id = user_id;
        next();
    }
};
exports.default = AuthVerification;
