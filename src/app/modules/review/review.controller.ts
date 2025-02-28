import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.createReviewIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Campsite Booked Successfully",
    data: result,
  });
});

const getBookings = catchAsync(async (req: Request, res: Response) => {
  const campsites = await reviewService.getAllBookings(
    req.query.email as string
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Bookings retrived successfully",
    data: campsites,
  });
});

//get single user
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const campsite = await reviewService.getSingleBookingFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking retrived successfully",
    data: campsite,
  });
});

export const revieController = {
  createReview,
  getBookings,
  getSingleBooking,
};
