"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
//login user
router.post("/login", 
// validateRequest(authValidation.authLoginSchema),
auth_controller_1.authController.loginUser);
router.post("/socialLogin", 
// validateRequest(authValidation.authLoginSchema),
auth_controller_1.authController.socialLogin);
router.post("/send-otp", auth_controller_1.authController.sendForgotPasswordOtp);
router.post("/verify-otp", auth_controller_1.authController.verifyForgotPasswordOtpCode);
router.patch("/reset-password", (0, auth_1.default)(), auth_controller_1.authController.resetPassword);
exports.authRoute = router;
