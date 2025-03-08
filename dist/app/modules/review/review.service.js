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
exports.reviewService = void 0;
const prismaClient_1 = __importDefault(require("../../../prisma/prismaClient"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const createReviewIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBooking = yield prismaClient_1.default.booking.findFirst({
        where: {
            campsiteId: payload.campsiteId,
            userId: userId,
            status: "pending",
        },
    });
    if (!existingBooking) {
        throw new Error("You can only review a campsite if you have booked it.");
    }
    const review = yield prismaClient_1.default.review.create({
        data: Object.assign({}, payload),
    });
    return { review };
});
const getAllReviewsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prismaClient_1.default.review.findMany();
    if (reviews.length === 0) {
        throw new ApiErrors_1.default(404, "Reviews not found!");
    }
    return reviews;
});
exports.reviewService = {
    createReviewIntoDB,
    getAllReviewsFromDB
};
