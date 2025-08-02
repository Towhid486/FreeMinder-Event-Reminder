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
exports.allTags = exports.updateTag = exports.addTag = exports.updateReminder = exports.allReminder = exports.addReminder = void 0;
const db_prisma_1 = __importDefault(require("../db/db.prisma"));
const addReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserId = req.headers['user_id'];
        let { name, date, gender, tags, location, oneWeekBefore, twoWeekBefore, link } = req.body;
        console.log(UserId);
        const data = yield db_prisma_1.default.reminder.create({
            data: {
                userId: UserId,
                name,
                date,
                gender,
                tags,
                location,
                oneWeekBefore,
                twoWeekBefore,
                link
            }
        });
        if (data) {
            res.status(201).json({ status: true, message: "Reminder added successfully!", data: data });
        }
        else {
            res.status(400).json({ status: false, message: "Failed to create reminder!" });
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
exports.addReminder = addReminder;
const allReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserId = req.headers['user_id'];
        const data = yield db_prisma_1.default.reminder.findMany({
            where: {
                userId: UserId
            }
        });
        if (data.length > 0) {
            return res.json({ status: true, message: "Reminder List Found", data: data });
        }
        else {
            return res.json({ status: false, message: "No reminder found for you.", data: data });
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
exports.allReminder = allReminder;
const updateReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserId = req.headers['user_id'];
        const id = req.params.id;
        let { name, date, gender, tags, location, oneWeekBefore, twoWeekBefore, link } = req.body;
        const data = yield db_prisma_1.default.reminder.update({
            where: {
                userId: UserId,
                id: id
            },
            data: {
                name,
                date,
                gender,
                tags,
                location,
                oneWeekBefore,
                twoWeekBefore,
                link
            }
        });
        return res.json({ status: true, message: "Reminder updated", data: data });
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
exports.updateReminder = updateReminder;
const addTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name } = req.body;
        const data = yield db_prisma_1.default.tag.create({
            data: {
                name: name
            }
        });
        if (data) {
            res.status(201).json({ status: true, message: "Tag added successfully!", data: data });
        }
        else {
            res.status(400).json({ status: false, message: "Failed to create tag!" });
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
exports.addTag = addTag;
const updateTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let { name } = req.body;
        const data = yield db_prisma_1.default.tag.update({
            where: {
                id: id
            },
            data: {
                name
            }
        });
        return res.json({ status: true, message: "Tag updated", data: data });
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
exports.updateTag = updateTag;
const allTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db_prisma_1.default.tag.findMany();
        if (data.length > 0) {
            return res.json({ status: true, message: "Tag List Found", data: data });
        }
        else {
            return res.json({ status: false, message: "No tag found.", data: data });
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
exports.allTags = allTags;
