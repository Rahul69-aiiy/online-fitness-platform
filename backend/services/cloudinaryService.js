import { cloudinary } from "../config/cloudinary.js";

export const uploadToCloudinary = async (fileUri, options = {}) => {
  return await cloudinary.uploader.upload(fileUri, {
    folder: "fitness-app/avatars",
    ...options,
  });
};
