"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidation = void 0;
const zod_1 = require("zod");
const bookingValidationSchema = zod_1.z
    .object({
    userId: zod_1.z.string().min(1, "User ID is required"),
    campsiteId: zod_1.z.string().min(1, "Campsite ID is required"),
    checkIn: zod_1.z.coerce.date().refine((date) => date >= new Date(), {
        message: "Check-in date must be in the future",
    }),
    checkOut: zod_1.z.coerce.date(),
})
    .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
});
exports.bookingValidation = {
    bookingValidationSchema,
};
