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
    if (files && files.length > 0) {
        const uploadedMedia = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(files);
        req.body.media = uploadedMedia.map(media => media.secure_url);
    }
    return req.body;
});
const createCampsiteIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCampsite = yield prismaClient_1.default.campsite.findFirst({
        where: {
            name: payload.name,
            location: payload.location,
        },
    });
    if (existingCampsite) {
        throw new ApiErrors_1.default(409, "A campsite with this name already exists");
    }
    const campsite = yield prismaClient_1.default.campsite.create({
        data: Object.assign({}, payload),
    });
    return {
        campsite: campsite,
    };
});
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
    insertIntoDB
};
