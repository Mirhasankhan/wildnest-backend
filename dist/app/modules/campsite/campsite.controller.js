"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campsiteController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const campsite_service_1 = require("./campsite.service");
const insertImage = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campsite_service_1.campsiteService.insertIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Media uploaded successfully',
        data: result,
    });
}));
const createCampsite = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campsite_service_1.campsiteService.createCampsiteIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Campsite created successfully",
        data: result,
    });
}));
const getCampsites = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, limit, pricePerNight, page } = req.query;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const pageNum = page ? parseInt(page, 10) : 1;
    const skip = (pageNum - 1) * limitNum;
    const campsites = yield campsite_service_1.campsiteService.getAllCampsites({
        search: search,
        limit: limitNum,
        pricePerNight: pricePerNight ? parseFloat(pricePerNight) : undefined,
        skip,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Campsites retrieved successfully",
        data: campsites,
    });
}));
//get single user
const getSingleCampsite = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campsite = yield campsite_service_1.campsiteService.getSingleCampsite(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Campsite retrived successfully",
        data: campsite,
    });
}));
const deleteCampsite = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield campsite_service_1.campsiteService.deleteCampsiteIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Campsite deleted successfully",
    });
}));
//update user
const updateCampsite = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedCampsite = yield campsite_service_1.campsiteService.updateCampsiteIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Campsite updated successfully",
        data: updatedCampsite,
    });
}));
exports.campsiteController = {
    createCampsite,
    getCampsites,
    getSingleCampsite,
    deleteCampsite,
    updateCampsite,
    insertImage
};
