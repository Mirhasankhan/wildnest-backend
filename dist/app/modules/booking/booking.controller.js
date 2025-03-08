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
exports.bookkingController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookingService.createBookingIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Campsite Booked Successfully",
        data: result,
    });
}));
const getBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campsites = yield booking_service_1.bookingService.getAllBookings(req.query.email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Bookings retrived successfully",
        data: campsites,
    });
}));
//get single user
const getSingleBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campsite = yield booking_service_1.bookingService.getSingleBookingFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Booking retrived successfully",
        data: campsite,
    });
}));
const approveBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_service_1.bookingService.approvePendingBookings(req.body.bookingId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Booking confirmed successfully",
        data: booking,
    });
}));
const deleteBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield booking_service_1.bookingService.deletBookingFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Booking deleted successfully",
    });
}));
exports.bookkingController = {
    createBooking,
    getBookings,
    getSingleBooking,
    approveBooking,
    deleteBooking
};
