import express from "express";
import * as UserController from "../controller/UserController"
import AuthVerification from "../middleware/AuthVerification";

const router = express.Router()

router.post("/register",UserController.register)
router.post("/login",UserController.login)
router.get("/profile",AuthVerification,UserController.profile)
router.put("/profileUpdate",AuthVerification,UserController.profileUpdate)

export default router
