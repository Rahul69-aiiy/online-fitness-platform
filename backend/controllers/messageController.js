import prisma from '../config/db.js';

// Only subscribed ones can message

export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.user.id }
        ]
      },
      include: { sender: true, receiver: true },
      orderBy: { sentAt: 'asc' }
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Send a Message (Socket.io will also handle this in real-time)
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        content
      },
      include: { sender: true, receiver: true }
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};