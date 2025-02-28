import { z } from "zod";

const bookingValidationSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    campsiteId: z.string().min(1, "Campsite ID is required"),
    checkIn: z.coerce.date().refine((date) => date >= new Date(), {
      message: "Check-in date must be in the future",
    }),
    checkOut: z.coerce.date(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

export const bookingValidation = {
  bookingValidationSchema,
};
