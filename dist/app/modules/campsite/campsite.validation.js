"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campsiteValidation = exports.updateCampsiteSchema = void 0;
const zod_1 = require("zod");
const campsiteValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must be at least 3 characters long"),
    description: zod_1.z
        .string()
        .min(10, "Description must be at least 10 characters long"),
    location: zod_1.z.string().min(5, "Location must be at least 5 characters long"),
    latitude: zod_1.z.number().min(-90).max(90, "Invalid latitude value"),
    longitude: zod_1.z.number().min(-180).max(180, "Invalid longitude value"),
    category: zod_1.z.enum(["cabin", "trailer", "tent"], {
        message: "Category must be one of: cabin, trailer, or tent",
    }),
    capacity: zod_1.z.number().int().positive("Capacity must be a positive integer"),
    available: zod_1.z.boolean(),
    pricePerNight: zod_1.z
        .number()
        .positive("Price per night must be a positive number"),
    amenities: zod_1.z
        .array(zod_1.z.string())
        .min(1, "At least one amenity must be provided"),
    images: zod_1.z
        .array(zod_1.z.string().url("Each image must be a valid URL"))
        .min(1, "At least one image must be provided"),
});
exports.updateCampsiteSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    capacity: zod_1.z.number().optional(),
    available: zod_1.z.boolean().optional(),
    pricePerNight: zod_1.z.number().optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    images: zod_1.z.array(zod_1.z.string().url("Each image must be a valid URL")).optional(),
});
exports.campsiteValidation = {
    campsiteValidationSchema,
    updateCampsiteSchema: exports.updateCampsiteSchema,
};
