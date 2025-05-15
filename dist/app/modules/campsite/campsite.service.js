"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campsiteService = void 0;
const prismaClient_1 = __importDefault(require("../../../prisma/prismaClient"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const insertIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files || files.length === 0) {
        throw new Error("No files uploaded");
    }
    const uploadedMedia = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(files);
    const newImageUrls = uploadedMedia.map((media) => media.secure_url);
    const existingImage = yield prismaClient_1.default.image.findFirst();
    if (!existingImage) {
        return yield prismaClient_1.default.image.create({
            data: {
                imageUrls: newImageUrls,
            },
        });
    }
    return yield prismaClient_1.default.image.update({
        where: { id: existingImage.id },
        data: {
            imageUrls: {
                push: newImageUrls,
            },
        },
    });
});
const deleteImageFromDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const imageUrlToDelete = req.body.imageUrl;
    if (!imageUrlToDelete) {
        throw new Error("No image URL provided for deletion");
    }
    const existingImage = yield prismaClient_1.default.image.findFirst();
    if (!existingImage) {
        throw new Error("Image document not found");
    }
    const updatedImageUrls = existingImage.imageUrls.filter((url) => url !== imageUrlToDelete);
    const updatedImage = yield prismaClient_1.default.image.update({
        where: { id: existingImage.id },
        data: {
            imageUrls: updatedImageUrls,
        },
    });
    return updatedImage;
});
// const getImagesFromDB = async () => {
//   const images = await prisma.image.findMany({});
//   return images;
// };
const getImagesFromDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1) {
    const limit = 4;
    const imageRecord = yield prismaClient_1.default.image.findFirst();
    if (!imageRecord || !Array.isArray(imageRecord.imageUrls)) {
        return [];
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUrls = imageRecord.imageUrls.slice(start, end);
    const totalPages = Math.ceil(imageRecord.imageUrls.length / limit);
    return {
        paginatedUrls,
        totalPages
    };
});
const createCampsiteIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const existingCampsite = yield prismaClient_1.default.campsite.findFirst({
        where: {
            name: payload.name,
            location: payload.location,
        },
    });
    if (existingCampsite) {
        throw new ApiErrors_1.default(409, "A campsite with this name already exists");
    }
    const files = req.files;
    if (files && files.length > 0) {
        const uploadedMedia = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(files);
        payload.images = uploadedMedia.map((media) => media.secure_url);
    }
    if (!payload.images) {
        throw new ApiErrors_1.default(409, "NO image Uploaded");
    }
    const campsite = yield prismaClient_1.default.campsite.create({
        data: Object.assign({}, payload),
    });
    return {
        campsite: campsite,
    };
});
// const createCampsiteIntoDB = async (payload: Campsite) => {
//   const existingCampsite = await prisma.campsite.findFirst({
//     where: {
//       name: payload.name,
//       location: payload.location,
//     },
//   });
//   if (existingCampsite) {
//     throw new ApiError(409, "A campsite with this name already exists");
//   }
//   const campsite = await prisma.campsite.create({
//     data: {
//       ...payload,
//     },
//   });
//   return {
//     campsite: campsite,
//   };
// };
const getAllCampsites = (_a) => __awaiter(void 0, [_a], void 0, function* ({ search, limit = 10, pricePerNight, skip = 0, }) {
    const campsites = yield prismaClient_1.default.campsite.findMany({
        where: {
            AND: [
                search
                    ? {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            { location: { contains: search, mode: "insensitive" } },
                        ],
                    }
                    : {},
                pricePerNight ? { pricePerNight: { lte: pricePerNight } } : {},
            ],
        },
        take: limit,
        skip: skip,
        include: {
            bookings: true,
            reviews: true,
        },
    });
    if (campsites.length === 0) {
        throw new ApiErrors_1.default(404, "Campsites not found!");
    }
    return campsites;
});
//get single user
const getSingleCampsite = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const campsite = yield prismaClient_1.default.campsite.findUnique({
        where: { id },
        include: { bookings: true },
    });
    if (!campsite) {
        throw new ApiErrors_1.default(404, "Campsite not found!");
    }
    return campsite;
});
const deleteCampsiteIntoDB = (campsiteId) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!ObjectId.isValid(userId)) {
    //   throw new ApiError(400, "Invalid user ID format");
    // }
    const existingCampsite = yield getSingleCampsite(campsiteId);
    if (!existingCampsite) {
        throw new ApiErrors_1.default(404, "Campsite not found for delete this");
    }
    yield prismaClient_1.default.campsite.delete({
        where: { id: campsiteId },
    });
    return;
});
//update user
const updateCampsiteIntoDB = (id, campsiteData) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!ObjectId.isValid(id)) {
    //   throw new ApiError(400, "Invalid user ID format");
    // }
    const existingCampsite = yield getSingleCampsite(id);
    if (!existingCampsite) {
        throw new ApiErrors_1.default(404, "Campsite not found for edit");
    }
    const updatedCampsite = yield prismaClient_1.default.campsite.update({
        where: { id },
        data: campsiteData,
    });
    return updatedCampsite;
});
exports.campsiteService = {
    createCampsiteIntoDB,
    getAllCampsites,
    getSingleCampsite,
    deleteCampsiteIntoDB,
    updateCampsiteIntoDB,
    insertIntoDB,
    deleteImageFromDB,
    getImagesFromDB,
};
