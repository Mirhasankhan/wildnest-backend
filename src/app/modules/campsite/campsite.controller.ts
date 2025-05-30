import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { campsiteService } from "./campsite.service";
import prisma from "../../../prisma/prismaClient";

const insertImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await campsiteService.insertIntoDB(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Media uploaded successfully",
      data: result,
    });
  }
);
// const getImages = catchAsync(async (req: Request, res: Response) => {
//   const result = await campsiteService.getImagesFromDB();
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Media Retrieved successfully",
//     data: result,
//   });
// });
const getImages = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 2;
  
  const result = await campsiteService.getImagesFromDB(page);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media Retrieved successfully",
    data: result,
  });
});



const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const result = await campsiteService.deleteImageFromDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media Deleted successfully",
    data: result,
  });
});

const createCampsite = catchAsync(async (req: Request, res: Response) => {
  const result = await campsiteService.createCampsiteIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Campsite created successfully",
    data: result,
  });
});

const getCampsites = catchAsync(async (req: Request, res: Response) => {
  const { search, limit, pricePerNight, page } = req.query;

  const limitNum = limit ? parseInt(limit as string, 10) : 10;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const skip = (pageNum - 1) * limitNum;

  const campsites = await campsiteService.getAllCampsites({
    search: search as string | undefined,
    limit: limitNum,
    pricePerNight: pricePerNight
      ? parseFloat(pricePerNight as string)
      : undefined,
    skip,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Campsites retrieved successfully",
    data: campsites,
  });
});

//get single user
const getSingleCampsite = catchAsync(async (req: Request, res: Response) => {
  const campsite = await campsiteService.getSingleCampsite(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Campsite retrived successfully",
    data: campsite,
  });
});

const deleteCampsite = catchAsync(async (req: any, res: Response) => {
  await campsiteService.deleteCampsiteIntoDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Campsite deleted successfully",
  });
});

//update user
const updateCampsite = catchAsync(async (req: Request, res: Response) => {
  const updatedCampsite = await campsiteService.updateCampsiteIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Campsite updated successfully",
    data: updatedCampsite,
  });
});

export const campsiteController = {
  createCampsite,
  getCampsites,
  getSingleCampsite,
  deleteCampsite,
  updateCampsite,
  insertImage,
  deleteImage,
  getImages,
};
