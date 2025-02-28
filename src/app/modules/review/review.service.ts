import { Booking, Campsite } from "@prisma/client";
import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";

const createReviewIntoDB = async (payload: {
  campsiteId: string;
  rating: number;
  comment?: string;
}) => {
  // const existingBooking = await prisma.booking.findFirst({
  //   where: {
  //     campsiteId: payload.campsiteId,
  //   },
  // });

  // if (!existingBooking) {
  //   throw new ApiError(400, "You can only review a campsite you have booked.");
  // }

  // Create the review if a valid booking exists
  const review = await prisma.review.create({
    data: {
      ...payload,
    },
  });

  return { review };
};

const getAllBookings = async (email: string) => {
  const bookings = await prisma.booking.findMany({
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
    throw new ApiError(404, "Bookings not found!");
  }

  return bookings;
};

//get single user
const getSingleBookingFromDB = async (id: string) => {
  const booking = await prisma.booking.findUnique({
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
    throw new ApiError(404, "Booking not found!");
  }

  return booking;
};

const deletBookingFromDB = async (bookingId: string) => {
  // if (!ObjectId.isValid(userId)) {
  //   throw new ApiError(400, "Invalid user ID format");
  // }

  const existingBooking = await getSingleBookingFromDB(bookingId);
  if (!existingBooking) {
    throw new ApiError(404, "Booking not found for delete this");
  }
  await prisma.booking.delete({
    where: { id: bookingId },
  });
  return;
};

export const reviewService = {
  createReviewIntoDB,
  getAllBookings,
  getSingleBookingFromDB,
  deletBookingFromDB,
};
