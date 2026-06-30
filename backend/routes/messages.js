import { Router } from 'express';
import {
  getConversations,
  getConversationMessages,
  sendMessage,
  markAsRead,
} from '../controllers/messageController.js';
import { isAuthenticated } from '../middlewares/middleware.js';

const router = Router();

// All message routes require authentication
router.use(isAuthenticated);

router.get('/conversations', getConversations);
router.get('/conversations/:otherUserId', getConversationMessages);
router.post('/send', sendMessage);
router.post('/read/:otherUserId', markAsRead);

export default router;
