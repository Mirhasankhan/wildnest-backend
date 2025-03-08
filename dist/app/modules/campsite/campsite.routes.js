"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campsiteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const campsite_controller_1 = require("./campsite.controller");
const campsite_validation_1 = require("./campsite.validation");
const client_1 = require("@prisma/client");
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const router = express_1.default.Router();
router.post("/create/sdfdsf", 
// auth(UserRole.ADMIN),
(0, validateRequest_1.default)(campsite_validation_1.campsiteValidation.campsiteValidationSchema), campsite_controller_1.campsiteController.createCampsite);
router.get("/allCampsites", campsite_controller_1.campsiteController.getCampsites);
router.get("/campsite/:id", (0, auth_1.default)(), campsite_controller_1.campsiteController.getSingleCampsite);
router.put("/:id", 
//   validateRequest(campsiteValidation.updateCampsiteSchema),
(0, auth_1.default)(client_1.UserRole.ADMIN), campsite_controller_1.campsiteController.updateCampsite);
router.delete("/campsite/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), campsite_controller_1.campsiteController.deleteCampsite);
router.post("/uploadImage", fileUploadHelper_1.FileUploadHelper.upload.array("files", 5), campsite_controller_1.campsiteController.insertImage);
exports.campsiteRoutes = router;
