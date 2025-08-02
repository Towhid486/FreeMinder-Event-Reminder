"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverResetPass = exports.recoverVerifyOTP = exports.recoverVerifyEmail = exports.changePassword = exports.profileUpdate = exports.profile = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_prisma_1 = __importDefault(require("../db/db.prisma"));
const TokenHelper_1 = require("../utility/TokenHelper");
const client_1 = require("@prisma/client");
const SendEmailUtility_1 = __importDefault(require("../utility/SendEmailUtility"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, password, country, language } = req.body;
        if (!Object.values(client_1.Country).includes(country)) {
            return res.status(400).json({
                message: `Invalid country. Allowed values: ${Object.values(client_1.Country).join(", ")}`,
            });
        }
        else if (!Object.values(client_1.Language).includes(language)) {
            return res.status(400).json({ message: `Invalid language. Allowed values: ${Object.values(client_1.Language).join(", ")}` });
        }
        let hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const data = yield db_prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                country,
                language,
            }
        });
        if (data) {
            res.status(201).json({ message: "User registered successfully!", data: data });
        }
        else {
            res.status(400).json({ message: "User registration failed!" });
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.status(500).json({ message: "Something went wrong", error: e.message });
        }
        else {
            console.error(e);
            return res.status(500).json({ message: "Something went wrong", error: String(e) });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        const data = yield db_prisma_1.default.user.findUnique({
            where: {
                email: email
            }
        });
        if (!data) {
            return res.json({ status: false, message: "No User Exist With this Email" });
        }
        else {
            let comparePassword = yield bcrypt_1.default.compare(password, data.password);
            if (!comparePassword) {
                return res.json({ status: false, message: "Invalid email or password" });
            }
            let token = (0, TokenHelper_1.EncodeToken)(data['email'], data['id']);
            res.json({ status: true, message: "Login Success!", token: token, data: data });
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({ status: false, message: "Internal server error", error: e.message });
        }
        else {
            console.error(e);
            return res.json({ status: false, message: "Internal server error", error: String(e) });
        }
    }
});
exports.login = login;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = req.headers.email;
        const data = yield db_prisma_1.default.user.findUnique({
            where: {
                email: email
            }
        });
        return res.json({ status: true, message: "User profile fetched successfully", data: data });
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({ status: false, message: "Internal server error", error: e.message });
        }
        else {
            console.error(e);
            return res.json({ status: false, message: "Internal server error", error: String(e) });
        }
    }
});
exports.profile = profile;
const profileUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = req.headers.email;
        let { name, country, birthday } = req.body;
        const data = yield db_prisma_1.default.user.update({
            where: {
                email: email
            },
            data: {
                name,
                country,
                birthday
            }
        });
        return res.json({ status: true, message: "User profile updated", data: data });
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({ status: false, message: "Internal server error", error: e.message });
        }
        else {
            console.error(e);
            return res.json({ status: false, message: "Internal server error", error: String(e) });
        }
    }
});
exports.profileUpdate = profileUpdate;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = req.headers.email;
        let { password, newPassword } = req.body;
        const data = yield db_prisma_1.default.user.findUnique({
            where: {
                email: email
            }
        });
        console.log(data);
        let comparePassword = yield bcrypt_1.default.compare(password, data.password);
        if (!comparePassword) {
            return res.json({ status: false, message: "Password doesn't matched!" });
        }
        else {
            const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
            yield db_prisma_1.default.user.update({
                where: {
                    email: email
                },
                data: {
                    password: hashedNewPassword
                }
            });
            return res.json({ status: true, message: "User Password updated" });
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({ status: false, message: "Internal server error", error: e.message });
        }
        else {
            console.error(e);
            return res.json({ status: false, message: "Internal server error", error: String(e) });
        }
    }
});
exports.changePassword = changePassword;
const recoverVerifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        const OTPCode = Math.floor(100000 + Math.random() * 900000);
        // Check if user exists
        const user = yield db_prisma_1.default.user.findUnique({
            where: { email: email },
        });
        if (user) {
            // Create OTP
            yield db_prisma_1.default.otp.create({
                data: {
                    email: email,
                    otp: OTPCode.toString(),
                },
            });
            // Send OTP Email
            const sendEmail = yield (0, SendEmailUtility_1.default)(email, "FreeMinder PIN Verification", `Your PIN Code is ${OTPCode}`);
            return res.status(200).json({ status: true, message: "OTP sent to your email" });
        }
        else {
            return res.status(200).json({ status: false, message: "No User Found" });
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({ status: false, message: "Internal server error", error: e.message });
        }
        else {
            console.error(e);
            return res.json({ status: false, message: "Internal server error", error: String(e) });
        }
    }
});
exports.recoverVerifyEmail = recoverVerifyEmail;
const recoverVerifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        const OTPCode = req.params.otp; // OTP is typically a string
        const status = 0;
        const statusUpdate = 1;
        // Check if OTP exists and is not used yet
        const otpCount = yield db_prisma_1.default.otp.count({
            where: {
                email: email,
                otp: OTPCode,
                status: status,
            },
        });
        if (otpCount > 0) {
            // Update OTP status to used
            const otpUpdate = yield db_prisma_1.default.otp.updateMany({
                where: {
                    email: email,
                    otp: OTPCode,
                    status: status,
                },
                data: {
                    status: statusUpdate,
                },
            });
            return res.status(200).json({ status: true, message: "OTP Verification Success", data: otpUpdate });
        }
        else {
            return res.status(200).json({ status: false, message: "Invalid OTP Code" });
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({ status: false, message: "Internal server error", error: e.message });
        }
        else {
            console.error(e);
            return res.json({ status: false, message: "Internal server error", error: String(e) });
        }
    }
});
exports.recoverVerifyOTP = recoverVerifyOTP;
const recoverResetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, OTPCode, NewPass } = req.body;
    const statusUpdate = 1;
    const OTPpassReset = 999;
    try {
        // Check if OTP has been used
        const otpUsedCount = yield db_prisma_1.default.otp.count({
            where: {
                email: email,
                otp: OTPCode,
                status: statusUpdate,
            },
        });
        if (otpUsedCount > 0) {
            // Hash the new password before updating
            const hashedPassword = yield bcrypt_1.default.hash(NewPass, 10);
            // Update the user's password
            const passUpdate = yield db_prisma_1.default.user.update({
                where: {
                    email: email,
                },
                data: {
                    password: hashedPassword, // Ensure the password is hashed
                },
            });
            // Mark OTP as used (reset status)
            yield db_prisma_1.default.otp.updateMany({
                where: {
                    email: email,
                    otp: OTPCode,
                },
                data: {
                    status: OTPpassReset,
                },
            });
            return res.status(200).json({ status: true, message: "Password Updated", data: passUpdate });
        }
        else {
            return res.status(200).json({ status: false, message: "Invalid Request" });
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({ status: false, message: "Internal server error", error: e.message });
        }
        else {
            console.error(e);
            return res.json({ status: false, message: "Internal server error", error: String(e) });
        }
    }
});
exports.recoverResetPass = recoverResetPass;
