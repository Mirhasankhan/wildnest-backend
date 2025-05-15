"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const campsite_routes_1 = require("../modules/campsite/campsite.routes");
const booking_routes_1 = require("../modules/booking/booking.routes");
const review_routes_1 = require("../modules/review/review.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.authRoute,
    },
    {
        path: "/campsite",
        route: campsite_routes_1.campsiteRoutes,
    },
    {
        path: "/booking",
        route: booking_routes_1.bookingRoutes,
    },
    {
        path: "/review",
        route: review_routes_1.reviewRoutes,
    },
    {
        path: "/payment",
        route: payment_routes_1.paymentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
