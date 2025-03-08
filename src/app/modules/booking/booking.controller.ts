import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.createBookingIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Campsite Booked Successfully",
    data: result,
  });
});

const getBookings = catchAsync(async (req: Request, res: Response) => {
  const campsites = await bookingService.getAllBookings(req.query.email as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Bookings retrived successfully",
    data: campsites,
  });
});

//get single user
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const campsite = await bookingService.getSingleBookingFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking retrived successfully",
    data: campsite,
  });
});


const approveBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.approvePendingBookings(req.body.bookingId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking confirmed successfully",
    data: booking,
  });
});


const deleteBooking = catchAsync(async (req: any, res: Response) => { 
  await bookingService.deletBookingFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking deleted successfully",
  });
});

export const bookkingController = {
  createBooking,
  getBookings,
  getSingleBooking,
  approveBooking,
  deleteBooking
};
