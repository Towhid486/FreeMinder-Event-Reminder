"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController = __importStar(require("../controller/UserController"));
const ReminderController = __importStar(require("../controller/ReminderController"));
const AuthVerification_1 = __importDefault(require("../middleware/AuthVerification"));
const router = express_1.default.Router();
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get('/recoverVerifyEmail/:email', UserController.recoverVerifyEmail);
router.get('/recoverVerifyOTP/:email/:otp', UserController.recoverVerifyOTP);
router.post('/recoverResetPass', UserController.recoverResetPass);
router.get("/profile", AuthVerification_1.default, UserController.profile);
router.put("/profileUpdate", AuthVerification_1.default, UserController.profileUpdate);
router.put("/changePassword", AuthVerification_1.default, UserController.changePassword);
router.post("/addReminder", AuthVerification_1.default, ReminderController.addReminder);
router.get("/allReminder", AuthVerification_1.default, ReminderController.allReminder);
router.put("/updateReminder/:id", AuthVerification_1.default, ReminderController.updateReminder);
router.post("/addTag", ReminderController.addTag);
router.get("/allTags", ReminderController.allTags);
router.put("/updateTag/:id", ReminderController.updateTag);
exports.default = router;
