import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoute } from "../modules/auth/auth.routes";
import { campsiteRoutes } from "../modules/campsite/campsite.routes";
import { bookingRoutes } from "../modules/booking/booking.routes";
import { reviewRoutes } from "../modules/review/review.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/campsite",
    route: campsiteRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
  {
    path: "/review",
    route: reviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
