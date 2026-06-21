import prisma from "../config/db.js";

// Get All Trainers with Pagination & Filters
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
      where.categories = { has: category };
    }
    if (rating) {
      where.rating = { gte: rating };
    }

    const [trainers, total] = await Promise.all([
      prisma.trainerProfile.findMany({
        where,
        include: { user: true, plans: true, reviews: { take: 3 } },
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
        user: true,
        plans: true,
        sessions: { where: { time: { gte: new Date() } }, orderBy: { time: 'asc' } },
        reviews: { include: { user: true } }
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

    let profile = await prisma.trainerProfile.update({
        where: { userId: req.user.id },
        data: { specialization, experience: parseInt(experience), bio, primaryLocation, certifications, categories },
        include: { 
            user: {
                omit : {password: true}
            }
        },
    })

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Update trainer profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};