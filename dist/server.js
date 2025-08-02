"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const cloudinary_1 = require("./src/config/cloudinary");
const api_1 = __importDefault(require("./src/routes/api"));
//Initialize Express
const app = (0, express_1.default)();
(0, cloudinary_1.connectCloudinary)();
//Middleware
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization","token"],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.set('etag', false);
//Routes
app.use('/api/v1', api_1.default);
app.get('/', (req, res) => res.send("API Working"));
app.use("*", (req, res) => {
    res.status(404).json({ status: "fail", data: "Incorrect API" });
});
//Port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
