import prisma from '../config/db.js';

// Create a Review
export const createReview = async (req, res) => {
  try {
    const { trainerId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        trainerId,
        rating: parseInt(rating),
        comment
      },
      include: { user: true }
    });

    // Recalculate trainer rating
    const reviews = await prisma.review.findMany({ where: { trainerId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await prisma.trainerProfile.update({
      where: { id: trainerId },
      data: { rating: avgRating }
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Reviews for a Trainer
export const getReviewsByTrainer = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { trainerId: req.params.trainerId },
      include: { user: true },
      orderBy: { date: 'desc' }
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
