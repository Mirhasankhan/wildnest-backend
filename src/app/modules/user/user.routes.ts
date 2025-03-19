import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/create", UserControllers.createUser);
router.get("/", auth(UserRole.ADMIN), UserControllers.getUsers);
router.get("/:id", auth(), UserControllers.getSingleUser);
router.put(
  "/update",
  validateRequest(userValidation.userUpdateValidationSchema),
  auth(),
  UserControllers.updateUser
);
// router.delete("/:id", UserControllers.deleteUser);

export const userRoutes = router;
