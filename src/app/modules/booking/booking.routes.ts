import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { bookkingController } from "./booking.controller";


const router = express.Router();

router.post("/create",auth(UserRole.ADMIN), bookkingController.createBooking);
router.get("/bookings",auth(), bookkingController.getBookings);
router.get("/booking/:id",auth(), bookkingController.getSingleBooking);
router.delete("/booking/:id",auth(), bookkingController.deleteBooking);

export const bookingRoutes = router;
