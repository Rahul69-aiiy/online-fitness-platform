import prisma from "../config/db.js";
import { handleAvatarUpload } from "../services/cloudinaryService.js";

// Get All Trainers with Pagination and Filters
export const getTrainers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const category = req.query.category;
    const rating = req.query.rating ? parseFloat(req.query.rating) : null;

    let where = {};
    if (search) {
      where.OR = [
        { specialization: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }
    if (category) {
      where.categories = { has: category.toUpperCase() };
    }
    if (rating) {
      where.rating = { gte: rating };
    }

    const [trainers, total] = await Promise.all([
      prisma.trainerProfile.findMany({
        where,
        include: {
          user: { omit: { password: true } },
          plans: true,
          reviews: { take: 3 }
        },
        skip,
        take: limit,
        orderBy: { rating: 'desc' }
      }),
      prisma.trainerProfile.count({ where })
    ]);

    res.json({
      success: true,
      data: trainers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Trainer Profile by ID
export const getTrainerById = async (req, res) => {
  try {
    const trainer = await prisma.trainerProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { omit: { password: true } },
        plans: true,
        reviews: {
          include: {
            user: { omit: { password: true } }
          }
        }
      }
    });

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    res.json({ success: true, data: trainer });
  } catch (error) {
    console.error('Get trainer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Trainer Profile
export const updateTrainerProfile = async (req, res) => {
  try {
    const { name, avatar, specialization, experience, bio, primaryLocation, certifications, categories } = req.body;

    let avatarUrl;
    try {
      avatarUrl = await handleAvatarUpload(avatar);
    } catch (uploadError) {
      console.error("Cloudinary trainer upload error:", uploadError);
      return res.status(500).json({ success: false, message: "Failed to upload avatar" });
    }

    if (name || avatar) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          name: name || undefined,
          avatar: avatarUrl || undefined,
        },
      });
    }
    const profile = await prisma.trainerProfile.update({
        where: { userId: req.user.id },
        data: { 
          specialization: specialization || undefined, 
          experience: parseInt(experience),
          bio: bio || undefined, 
          primaryLocation: primaryLocation || undefined, 
          certifications: certifications || undefined, 
          categories: categories !== undefined ? categories.map(c => c.toUpperCase()) : undefined 
        },
        include: { 
            user: {
              omit : {password: true}
            }
        },
    });

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Update trainer profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};