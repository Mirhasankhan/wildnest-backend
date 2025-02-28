import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

//login user
router.post(
  "/login",
  // validateRequest(authValidation.authLoginSchema),
  authController.loginUser
);
router.post("/send-otp", authController.sendForgotPasswordOtp);
router.post("/verify-otp", authController.verifyForgotPasswordOtpCode);
router.patch("/reset-password", auth(), authController.resetPassword);

export const authRoute = router;
