import { z } from "zod";

const userRegisterValidationSchema = z.object({
  userName: z.string().min(2, "User name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const userUpdateValidationSchema = z.object({
  userName: z
    .string()
    .min(2, "user name must be at least 2 characters long")
    .optional(),
  contact: z
    .string()
    .min(7, "Mobile Number must be at least 7 digits long")
    .max(15, "Mobile Number must be at most 15 digits long")
    .optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  profileImg: z.string().url("Profile image must be a valid URL").optional(),
});

export const userValidation = {
  userRegisterValidationSchema,
  userUpdateValidationSchema,
};
