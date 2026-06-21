import { Router } from 'express';
import { updateCurrentUser, deleteCurrentUser } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/middleware';
const router = Router()

router.put('/profile', isAuthenticated, authorizeRoles('STUDENT'), updateCurrentUser);
router.delete('/account', isAuthenticated, deleteCurrentUser);

export default router;