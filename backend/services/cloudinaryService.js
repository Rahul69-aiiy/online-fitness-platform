import { cloudinary } from "../config/cloudinary.js";

export const uploadToCloudinary = (fileUri, options = {}) => {
  return cloudinary.uploader.upload(fileUri, {
    folder: "fitness-app/avatars",
    ...options,
  });
};

export const handleAvatarUpload = async (avatar) => {
  if (!avatar) return undefined;

  if (avatar.startsWith("data:image/")) {
    const uploadResponse = await uploadToCloudinary(avatar, {
      folder: "fitness-app/avatars",
    });
    return uploadResponse.secure_url;
  }

  return avatar; // already URL
};
