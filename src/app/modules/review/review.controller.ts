import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
 
  const result = await reviewService.createReviewIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review provied successfully",
    data: result,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await reviewService.getAllReviewsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});

export const revieController = {
  createReview,
  getReviews
};
