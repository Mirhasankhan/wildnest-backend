import { Campsite } from "@prisma/client";
import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";
import { IUploadFile } from "../../interfaces/file";
import { Request } from "express";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";

const insertIntoDB = async (req: Request) => {
  const files = req.files as IUploadFile[];

  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }

  const uploadedMedia = await FileUploadHelper.uploadToCloudinary(files);
  const newImageUrls = uploadedMedia.map((media) => media.secure_url);

  const existingImage = await prisma.image.findFirst();
  if (!existingImage) {
    return await prisma.image.create({
      data: {
        imageUrls: newImageUrls,
      },
    });
  }

  return await prisma.image.update({
    where: { id: existingImage.id },
    data: {
      imageUrls: {
        push: newImageUrls,
      },
    },
  });
};
const deleteImageFromDB = async (req: Request) => {
  const imageUrlToDelete = req.body.imageUrl as string;

  if (!imageUrlToDelete) {
    throw new Error("No image URL provided for deletion");
  }

  const existingImage = await prisma.image.findFirst();

  if (!existingImage) {
    throw new Error("Image document not found");
  }

  const updatedImageUrls = existingImage.imageUrls.filter(
    (url) => url !== imageUrlToDelete
  );

  const updatedImage = await prisma.image.update({
    where: { id: existingImage.id },
    data: {
      imageUrls: updatedImageUrls,
    },
  });

  return updatedImage;
};
// const getImagesFromDB = async () => {
//   const images = await prisma.image.findMany({});

//   return images;
// };
const getImagesFromDB = async (page: number = 1) => {
  const limit = 4
  const imageRecord = await prisma.image.findFirst(); 

  if (!imageRecord || !Array.isArray(imageRecord.imageUrls)) {
    return [];
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedUrls = imageRecord.imageUrls.slice(start, end); 
  const totalPages = Math.ceil(imageRecord.imageUrls.length / limit);

  return {
    paginatedUrls,
    totalPages
  };
};


const createCampsiteIntoDB = async (req: Request) => {
  const payload = req.body;
  const existingCampsite = await prisma.campsite.findFirst({
    where: {
      name: payload.name,
      location: payload.location,
    },
  });

  if (existingCampsite) {
    throw new ApiError(409, "A campsite with this name already exists");
  }

  const files = req.files as IUploadFile[];
  if (files && files.length > 0) {
    const uploadedMedia = await FileUploadHelper.uploadToCloudinary(files);
    payload.images = uploadedMedia.map((media) => media.secure_url);
  }
  if (!payload.images) {
    throw new ApiError(409, "NO image Uploaded");
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

// const createCampsiteIntoDB = async (payload: Campsite) => {
//   const existingCampsite = await prisma.campsite.findFirst({
//     where: {
//       name: payload.name,
//       location: payload.location,
//     },
//   });

//   if (existingCampsite) {
//     throw new ApiError(409, "A campsite with this name already exists");
//   }

//   const campsite = await prisma.campsite.create({
//     data: {
//       ...payload,
//     },
//   });

//   return {
//     campsite: campsite,
//   };
// };

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
  insertIntoDB,
  deleteImageFromDB,
  getImagesFromDB,
};
