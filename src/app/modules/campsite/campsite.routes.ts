import express, { Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { campsiteController } from "./campsite.controller";
import { campsiteValidation } from "./campsite.validation";
import { UserRole } from "@prisma/client";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import prisma from "../../../prisma/prismaClient";

const router = express.Router();

router.post(
  "/create/sdfdsf",
  auth(UserRole.ADMIN),
  validateRequest(campsiteValidation.campsiteValidationSchema),
  campsiteController.createCampsite
);
router.get(
  "/allCampsites",
  auth(UserRole.ADMIN),
  campsiteController.getCampsites
);
router.get("/campsite/:id", auth(), campsiteController.getSingleCampsite);
router.put(
  "/:id",
  //   validateRequest(campsiteValidation.updateCampsiteSchema),
  auth(UserRole.ADMIN),
  campsiteController.updateCampsite
);
router.delete(
  "/campsite/:id",
  auth(UserRole.ADMIN),
  campsiteController.deleteCampsite
);
router.post(
  "/uploadImage",
  FileUploadHelper.upload.array("files", 5),
  campsiteController.insertImage
);

export const campsiteRoutes = router;
