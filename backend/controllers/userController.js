import prisma from "../config/db.js";

// Update current user's profile
export const updateCurrentUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        avatar: avatar || undefined,
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

    res.clearCookie("token");
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};