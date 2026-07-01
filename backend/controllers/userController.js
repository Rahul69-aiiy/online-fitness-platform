import prisma from "../config/db.js";
import { handleAvatarUpload } from "../services/cloudinaryService.js";
import ExpressError from "../utils/ExpressError.js";

// Update current user's profile
export const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    let avatarUrl;
    try {
      avatarUrl = await handleAvatarUpload(avatar);
    } catch (uploadError) {
      return next(new ExpressError("Failed to upload avatar", 500));
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        avatar: avatarUrl || undefined,
      },
      include: { trainerProfile: true },
      omit: { password: true},
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete current user's account
export const deleteCurrentUser = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.user.id },
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};