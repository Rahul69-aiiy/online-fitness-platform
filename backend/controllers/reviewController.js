import prisma from '../config/db.js';
import ExpressError from '../utils/ExpressError.js';

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
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
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
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
  }
};

// Update a Review
export const updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    // Check if review exists and belongs to current user
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!existingReview) {
      return next(new ExpressError('Review not found', 404));
    }

    if (existingReview.userId !== req.user.id) {
      return next(new ExpressError('You do not have permission to update this review', 403));
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating ? parseInt(rating) : undefined,
        comment: comment || undefined
      },
      include: { user: true }
    });

    // Recalculate trainer rating
    const reviews = await prisma.review.findMany({ where: { trainerId: updatedReview.trainerId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await prisma.trainerProfile.update({
      where: { id: updatedReview.trainerId },
      data: { rating: avgRating }
    });

    res.json({ success: true, data: updatedReview });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
  }
};

// Delete a Review
export const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;

    // Check if review exists and belongs to current user
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!existingReview) {
      return next(new ExpressError('Review not found', 404));
    }

    if (existingReview.userId !== req.user.id) {
      return next(new ExpressError('You do not have permission to delete this review', 403));
    }

    const trainerId = existingReview.trainerId;

    await prisma.review.delete({
      where: { id: reviewId }
    });

    // Recalculate trainer rating
    const reviews = await prisma.review.findMany({ where: { trainerId } });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    
    await prisma.trainerProfile.update({
      where: { id: trainerId },
      data: { rating: avgRating }
    });

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
  }
};
