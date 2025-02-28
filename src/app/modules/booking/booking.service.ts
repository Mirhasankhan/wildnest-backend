import { Booking, Campsite } from "@prisma/client";
import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";

const createBookingIntoDB = async (payload: Booking) => {
  const existingBooking = await prisma.booking.findFirst({
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
    throw new ApiError(
      409,
      "This campsite is already booked for the selected dates"
    );
  }

  // Create the booking if no conflict exists
  const booking = await prisma.booking.create({
    data: {
      ...payload,
    },
  });

  return { booking };
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

export const bookingService = {
  createBookingIntoDB,
  getAllBookings,
  getSingleBookingFromDB,
  deletBookingFromDB
};
