"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campsiteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const campsite_controller_1 = require("./campsite.controller");
const client_1 = require("@prisma/client");
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const parseBodyData_1 = require("../../middlewares/parseBodyData");
const router = express_1.default.Router();
router.post("/create", 
// auth(UserRole.ADMIN),
fileUploadHelper_1.FileUploadHelper.upload.array("files", 5), parseBodyData_1.parseBodyData, 
// validateRequest(campsiteValidation.campsiteValidationSchema),
campsite_controller_1.campsiteController.createCampsite);
router.get("/allCampsites", campsite_controller_1.campsiteController.getCampsites);
router.get("/campsite/:id", (0, auth_1.default)(), campsite_controller_1.campsiteController.getSingleCampsite);
router.put("/:id", 
//   validateRequest(campsiteValidation.updateCampsiteSchema),
(0, auth_1.default)(client_1.UserRole.ADMIN), campsite_controller_1.campsiteController.updateCampsite);
router.delete("/campsite/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), campsite_controller_1.campsiteController.deleteCampsite);
router.post("/uploadImage", fileUploadHelper_1.FileUploadHelper.upload.array("files", 5), campsite_controller_1.campsiteController.insertImage);
router.get("/allImages", campsite_controller_1.campsiteController.getImages);
router.delete("/image/delete", campsite_controller_1.campsiteController.deleteImage);
exports.campsiteRoutes = router;
