"use strict";
// import { v2 as cloudinary } from "cloudinary";
// import multer from "multer";
// import { Readable } from "stream";
// import config from "../config";
// import { ICloudinaryResponsee, IUploadFile } from "../app/interfaces/file";
// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: config.cloudinary.cloud_name,
//   api_key: config.cloudinary.api_key,
//   api_secret: config.cloudinary.api_secret,
// });
// // Multer memory storage (instead of disk storage)
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/gif",
//       "video/mp4",
//       "video/mov",
//       "video/avi",
//     ];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Invalid file type. Only images and videos are allowed."));
//     }
//   },
// });
// // Helper function to upload to Cloudinary
// const uploadToCloudinary = async (
//   files: IUploadFile[]
// ): Promise<ICloudinaryResponsee[]> => {
//   const uploadPromises = files.map((file) => {
//     return new Promise<ICloudinaryResponsee>((resolve, reject) => {
//       // Create a readable stream from the buffer
//       const bufferStream = new Readable();
//       bufferStream.push(file.buffer);
//       bufferStream.push(null); // End of stream
//       // Upload the stream to Cloudinary
//       cloudinary.uploader.upload_stream(
//         {
//           resource_type: file.mimetype.startsWith("video") ? "video" : "image",
//         },
//         (error, result) => {
//           if (error) {
//             reject(error);
//           } else {
//             resolve(result);
//           }
//         }
//       ).end(bufferStream);
//     });
//   });
//   return Promise.all(uploadPromises);
// };
// // Insert the uploaded media URLs into the database
// export const insertIntoDB = async (req: Request) => {
//   const files = req.files as IUploadFile[];
//   if (!files || files.length === 0) {
//     throw new Error("No files uploaded");
//   }
//   // Upload files to Cloudinary
//   const uploadedMedia = await uploadToCloudinary(files);
//   const newImageUrls = uploadedMedia.map((media) => media.secure_url);
//   // Retrieve existing image entry from the database
//   const existingImage = await prisma.image.findFirst();
//   if (!existingImage) {
//     // Create a new entry if no existing image
//     return await prisma.image.create({
//       data: {
//         imageUrls: newImageUrls,
//       },
//     });
//   }
//   // Update the existing image entry with new URLs
//   return await prisma.image.update({
//     where: { id: existingImage.id },
//     data: {
//       imageUrls: {
//         push: newImageUrls,
//       },
//     },
//   });
// };
// export const FileUploadHelper = {
//   uploadToCloudinary,
//   upload,
// };
