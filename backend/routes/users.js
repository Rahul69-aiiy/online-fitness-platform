import { Router } from 'express';
import { updateCurrentUser, deleteCurrentUser } from '../controllers/userController.js';
import { isAuthenticated} from '../middlewares/middleware.js';
const router = Router()

router.put('/profile', isAuthenticated, updateCurrentUser);
router.delete('/account', isAuthenticated, deleteCurrentUser);

export default router;