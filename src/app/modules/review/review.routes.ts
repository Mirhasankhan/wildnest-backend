import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { revieController } from "./review.controller";

const router = express.Router();

router.post("/create", revieController.createReview);

export const reviewRoutes = router;
