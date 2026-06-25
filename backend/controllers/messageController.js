import prisma from '../config/db.js';

// Get all conversations for the current user (latest message per contact)
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get all messages involving the current user
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true, role: true } },
        receiver: { select: { id: true, name: true, avatar: true, role: true } },
      },
      orderBy: { sentAt: 'desc' },
    });

    // Group by "other user" – keep only the latest message per contact
    const conversationMap = new Map();
    for (const msg of messages) {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversationMap.has(otherId)) {
        conversationMap.set(otherId, {
          otherUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
      // Count messages FROM other user that are unread (no isRead field yet)
      if (msg.receiverId === userId && !msg.isRead) {
        const existing = conversationMap.get(otherId);
        if (existing) existing.unreadCount += 1;
      }
    }

    const conversations = Array.from(conversationMap.values())
      .slice(skip, skip + limit);

    res.json({
      success: true,
      data: conversations,
      pagination: {
        page,
        limit,
        total: conversationMap.size,
        totalPages: Math.ceil(conversationMap.size / limit),
      },
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get paginated message history with a specific user
export const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
          receiver: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { sentAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.message.count({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
      }),
    ]);

    // Mark messages as read
    await prisma.message.updateMany({
      where: { senderId: otherUserId, receiverId: userId, isRead: false },
      data: { isRead: true },
    });

    res.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get conversation messages error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Send a message (only for subscribers)
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ success: false, message: 'receiverId and content are required' });
    }

    // subscription check
    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { studentId: senderId, trainer: { userId: receiverId } },
          { studentId: receiverId, trainer: { userId: senderId } },
        ],
        isActive: true,
        endDate: {
          gt: new Date(),
        },
      },
    });

    if (!subscription) {
      return res.status(403).json({ success: false, message: 'You must have an active subscription to send messages' });
    }

    const message = await prisma.message.create({
      data: { senderId, receiverId, content: content.trim() },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get total unread message count for notification badge
export const getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.message.count({
      where: { receiverId: req.user.id, isRead: false },
    });
    res.json({ success: true, data: { unreadCount: count } });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};