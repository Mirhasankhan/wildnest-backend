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
exports.FileUploadHelper = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const streamifier_1 = __importDefault(require("streamifier"));
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret,
});
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "video/mp4",
            "video/mov",
            "video/avi",
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only images and videos are allowed."));
        }
    },
});
const uploadToCloudinary = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                resource_type: file.mimetype.startsWith("video") ? "video" : "image",
            }, (error, result) => {
                if (error || !result) {
                    reject(error || new Error("Cloudinary upload failed"));
                }
                else {
                    resolve(result);
                }
            });
            streamifier_1.default.createReadStream(file.buffer).pipe(stream);
        });
    });
    return Promise.all(uploadPromises);
});
exports.FileUploadHelper = {
    uploadToCloudinary,
    upload,
};
