import { Campsite } from "@prisma/client";
import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";
import { IUploadFile } from "../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { Request } from "express";

const insertIntoDB = async (req: Request) => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    req.body.image = uploadedImage?.secure_url;
  }

  return req.body;
};

const createCampsiteIntoDB = async (payload: Campsite) => {
  const existingCampsite = await prisma.campsite.findFirst({
    where: {
      name: payload.name,
      location: payload.location,
    },
  });

  if (existingCampsite) {
    throw new ApiError(409, "A campsite with this name already exists");
  }

  const campsite = await prisma.campsite.create({
    data: {
      ...payload,
    },
  });

  return {
    campsite: campsite,
  };
};

const getAllCampsites = async ({
  search,
  limit = 10,
  pricePerNight,
  skip = 0,
}: {
  search?: string;
  limit?: number;
  pricePerNight?: number;
  skip?: number;
}) => {
  const campsites = await prisma.campsite.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        pricePerNight ? { pricePerNight: { lte: pricePerNight } } : {},
      ],
    },
    take: limit,
    skip: skip,
    include: {
      bookings: true,
      reviews: true,
    },
  });

  if (campsites.length === 0) {
    throw new ApiError(404, "Campsites not found!");
  }

  return campsites;
};

//get single user
const getSingleCampsite = async (id: string) => {
  const campsite = await prisma.campsite.findUnique({
    where: { id },
    include: { bookings: true },
  });
  if (!campsite) {
    throw new ApiError(404, "Campsite not found!");
  }

  return campsite;
};

const deleteCampsiteIntoDB = async (campsiteId: string) => {
  // if (!ObjectId.isValid(userId)) {
  //   throw new ApiError(400, "Invalid user ID format");
  // }

  const existingCampsite = await getSingleCampsite(campsiteId);
  if (!existingCampsite) {
    throw new ApiError(404, "Campsite not found for delete this");
  }
  await prisma.campsite.delete({
    where: { id: campsiteId },
  });
  return;
};

//update user
const updateCampsiteIntoDB = async (id: string, campsiteData: any) => {
  // if (!ObjectId.isValid(id)) {
  //   throw new ApiError(400, "Invalid user ID format");
  // }
  const existingCampsite = await getSingleCampsite(id);
  if (!existingCampsite) {
    throw new ApiError(404, "Campsite not found for edit");
  }
  const updatedCampsite = await prisma.campsite.update({
    where: { id },
    data: campsiteData,
  });

  return updatedCampsite;
};

export const campsiteService = {
  createCampsiteIntoDB,
  getAllCampsites,
  getSingleCampsite,
  deleteCampsiteIntoDB,
  updateCampsiteIntoDB,
  insertIntoDB
};
