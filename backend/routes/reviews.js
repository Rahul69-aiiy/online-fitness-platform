import { Router } from 'express';
import { createReview, getReviewsByTrainer, updateReview, deleteReview } from "../controllers/reviewController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/middleware.js";
import { validateCreateReview, validateUpdateReview } from "../validators/reviewValidator.js";

const router = Router();

router.get('/trainer/:id', getReviewsByTrainer);

router.post('/', isAuthenticated, authorizeRoles('STUDENT'), validateCreateReview, createReview);
router.put('/:id', isAuthenticated, authorizeRoles('STUDENT'), validateUpdateReview, updateReview);
router.delete('/:id', isAuthenticated, authorizeRoles('STUDENT'), deleteReview);

export default router;