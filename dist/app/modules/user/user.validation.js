"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const userRegisterValidationSchema = zod_1.z.object({
    userName: zod_1.z.string().min(2, "User name must be at least 2 characters long"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
});
const userUpdateValidationSchema = zod_1.z.object({
    userName: zod_1.z
        .string()
        .min(2, "user name must be at least 2 characters long")
        .optional(),
    contact: zod_1.z
        .string()
        .min(7, "Mobile Number must be at least 7 digits long")
        .max(15, "Mobile Number must be at most 15 digits long")
        .optional(),
    role: zod_1.z.enum(["ADMIN", "USER"]).optional(),
    profileImg: zod_1.z.string().url("Profile image must be a valid URL").optional(),
});
exports.userValidation = {
    userRegisterValidationSchema,
    userUpdateValidationSchema,
};
