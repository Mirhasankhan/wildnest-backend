import { Booking, Campsite } from "@prisma/client";
import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";

const createReviewIntoDB = async (
  userId: string,
  payload: {
    campsiteId: string;
    rating: number;
    comment?: string;
  }
) => {
  const existingBooking = await prisma.booking.findFirst({
    where: {
      campsiteId: payload.campsiteId,
      userId: userId,
      status: "pending",
    },
  });

  if (!existingBooking) {
    throw new Error("You can only review a campsite if you have booked it.");
  }

  const review = await prisma.review.create({
    data: {
      ...payload,
    },
  });

  return { review };
};

const getAllReviewsFromDB = async () => {
  const reviews = await prisma.review.findMany();

  if (reviews.length === 0) {
    throw new ApiError(404, "Reviews not found!");
  }

  return reviews;
};

export const reviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB
};
