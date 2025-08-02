import express from "express";
import * as UserController from "../controller/UserController"
import * as ReminderController from "../controller/ReminderController"
import AuthVerification from "../middleware/AuthVerification";

const router = express.Router()

router.post("/register",UserController.register)
router.post("/login",UserController.login)

router.get('/recoverVerifyEmail/:email',UserController.recoverVerifyEmail)
router.get('/recoverVerifyOTP/:email/:otp',UserController.recoverVerifyOTP)
router.post('/recoverResetPass',UserController.recoverResetPass)

router.get("/profile",AuthVerification,UserController.profile)
router.put("/profileUpdate",AuthVerification,UserController.profileUpdate)

router.put("/changePassword",AuthVerification,UserController.changePassword)

router.post("/addReminder", AuthVerification,ReminderController.addReminder)
router.get("/allReminder", AuthVerification,ReminderController.allReminder)
router.put("/updateReminder/:id", AuthVerification,ReminderController.updateReminder)

router.post("/addTag",ReminderController.addTag)
router.get("/allTags",ReminderController.allTags)
router.put("/updateTag/:id",ReminderController.updateTag)


export default router;
