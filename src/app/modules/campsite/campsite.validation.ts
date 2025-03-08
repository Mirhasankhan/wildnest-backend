import { z } from "zod";

const campsiteValidationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  location: z.string().min(5, "Location must be at least 5 characters long"),
  latitude: z.number().min(-90).max(90, "Invalid latitude value"),
  longitude: z.number().min(-180).max(180, "Invalid longitude value"),
  category: z.enum(["cabin", "trailer", "tent"], {
    message: "Category must be one of: cabin, trailer, or tent",
  }),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  available: z.boolean(),
  pricePerNight: z
    .number()
    .positive("Price per night must be a positive number"),
  amenities: z
    .array(z.string())
    .min(1, "At least one amenity must be provided"),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "At least one image must be provided"),
});

export const updateCampsiteSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  capacity: z.number().optional(),
  available: z.boolean().optional(),
  pricePerNight: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url("Each image must be a valid URL")).optional(),
});

export const campsiteValidation = {
  campsiteValidationSchema,
  updateCampsiteSchema,
};
