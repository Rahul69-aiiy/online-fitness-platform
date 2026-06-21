import { Router } from 'express';
import { createReview, getReviewsByTrainer } from "../controllers/reviewController";
import { authorizeRoles, isAuthenticated } from "../middlewares/middleware";

const router = Router();

router.get('/trainer/:id', getReviewsByTrainer);

router.post('/', isAuthenticated, authorizeRoles('STUDENT'), createReview)

export default router;