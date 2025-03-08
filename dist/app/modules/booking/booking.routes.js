"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(client_1.UserRole.ADMIN), booking_controller_1.bookkingController.createBooking);
router.get("/bookings", (0, auth_1.default)(), booking_controller_1.bookkingController.getBookings);
router.get("/booking/:id", (0, auth_1.default)(), booking_controller_1.bookkingController.getSingleBooking);
router.patch("/approveBooking", booking_controller_1.bookkingController.approveBooking);
router.delete("/booking/:id", (0, auth_1.default)(), booking_controller_1.bookkingController.deleteBooking);
exports.bookingRoutes = router;
