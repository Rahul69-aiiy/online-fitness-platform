import { Router } from 'express';
import {
  getConversations,
  getConversationMessages,
  sendMessage,
  getUnreadCount,
} from '../controllers/messageController.js';
import { isAuthenticated } from '../middlewares/middleware.js';

const router = Router();

// All message routes require authentication
router.use(isAuthenticated);

router.get('/conversations', getConversations);
router.get('/conversations/:otherUserId', getConversationMessages);
router.post('/send', sendMessage);
router.get('/unread-count', getUnreadCount);

export default router;
