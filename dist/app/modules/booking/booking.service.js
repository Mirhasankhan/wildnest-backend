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
exports.bookingService = void 0;
const prismaClient_1 = __importDefault(require("../../../prisma/prismaClient"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const createBookingIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBooking = yield prismaClient_1.default.booking.findFirst({
        where: {
            campsiteId: payload.campsiteId,
            OR: [
                {
                    checkIn: { lte: payload.checkOut },
                    checkOut: { gte: payload.checkIn },
                },
            ],
        },
    });
    if (existingBooking) {
        throw new ApiErrors_1.default(409, "This campsite is already booked for the selected dates");
    }
    // Create the booking if no conflict exists
    const booking = yield prismaClient_1.default.booking.create({
        data: Object.assign({}, payload),
    });
    return { booking };
});
const getAllBookings = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield prismaClient_1.default.booking.findMany({
        where: {
            user: {
                email: email,
            },
        },
        include: {
            user: {
                select: {
                    email: true,
                    id: true,
                    userName: true,
                },
            },
        },
    });
    if (bookings.length === 0) {
        throw new ApiErrors_1.default(404, "Bookings not found!");
    }
    return bookings;
});
//get single user
const getSingleBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield prismaClient_1.default.booking.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    email: true,
                    userName: true,
                },
            },
        },
    });
    if (!booking) {
        throw new ApiErrors_1.default(404, "Booking not found!");
    }
    return booking;
});
const approvePendingBookings = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield prismaClient_1.default.booking.findUnique({
        where: { id },
    });
    if (!booking) {
        throw new ApiErrors_1.default(404, "Booking not found!");
    }
    const result = yield prismaClient_1.default.booking.update({
        where: {
            id: id,
        },
        data: {
            status: "confirmed",
        },
    });
    return result;
});
const deletBookingFromDB = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!ObjectId.isValid(userId)) {
    //   throw new ApiError(400, "Invalid user ID format");
    // }
    const existingBooking = yield getSingleBookingFromDB(bookingId);
    if (!existingBooking) {
        throw new ApiErrors_1.default(404, "Booking not found for delete this");
    }
    yield prismaClient_1.default.booking.delete({
        where: { id: bookingId },
    });
    return;
});
exports.bookingService = {
    createBookingIntoDB,
    getAllBookings,
    getSingleBookingFromDB,
    approvePendingBookings,
    deletBookingFromDB
};
