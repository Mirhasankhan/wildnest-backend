"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), "uploads"));
    },
    filename: function (req, file, cb) {
        // Add a timestamp to the original filename
        const timestamp = Date.now();
        const ext = path_1.default.extname(file.originalname);
        const baseName = path_1.default.basename(file.originalname, ext);
        const newFilename = `${timestamp}-${baseName}${ext}`;
        cb(null, newFilename);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
// Upload single images
const updateProfileImage = upload.single("avatar");
const uploadQuizImage = upload.single("quizImage");
// Upload multiple images for portfolio
const sendFiles = upload.fields([
    { name: "sendFiles", maxCount: 10 },
    { name: "messageFiles", maxCount: 10 },
]);
exports.fileUploader = {
    sendFiles,
    updateProfileImage,
    uploadQuizImage,
};
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 3000 * 1024 * 1024 }, // 3000 MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedMimeTypes = [
//       "image/jpeg",
//       "image/png",
//       "video/mp4",
//       "video/x-matroska",
//     ];
//     if (!allowedMimeTypes.includes(file.mimetype)) {
//       return cb(new Error("File type not allowed") as unknown as null, false);
//     }
//     cb(null, true);
//   },
// });
// // upload single image
// const courseImage = upload.single("courseImage");
// const profileImage = upload.single("profileImage");
// const coverPhoto = upload.single("coverPhoto");
// // upload multiple image
// const uploadMultiple = upload.fields([
//   { name: "thumbnail", maxCount: 1 },
//   { name: "classVideo", maxCount: 1 },
// ]);
// export const fileUploader = {
//   upload,
//   courseImage,
//   uploadMultiple,
//   profileImage,
//   coverPhoto,
// };
