import { Booking } from "@prisma/client";
import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";
import { differenceInDays } from "date-fns";

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

  const duration = differenceInDays(
    new Date(payload.checkOut),
    new Date(payload.checkIn)
  );

  if (duration > 7) {
    throw new ApiError(400, "Camping duration cannot exceed 7 days");
  }

  // const extraPeople = payload.numberOfPeople > 10 ? payload.numberOfPeople - 10 : 0;
  // const extraCost = extraPeople * 2 * duration;

  const booking = await prisma.booking.create({
    data: {
      ...payload,
      // totalCost: payload.baseCost + extraCost,
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

const approvePendingBookings = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });
  if (!booking) {
    throw new ApiError(404, "Booking not found!");
  }

  const result = await prisma.booking.update({
    where: {
      id: id,
    },
    data: {
      status: "confirmed",
    },
  });
  return result;
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
  approvePendingBookings,
  deletBookingFromDB,
};
