import { Server } from 'socket.io';
import prisma from '../config/db.js';

// User online tracking
const onlineUsers = new Map(); // userId -> socketId

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins
    socket.on('userOnline', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`User ${userId} is online`);
      
      // Notify others user is online
      io.emit('userStatusChanged', { userId, online: true });
    });

    // Send message
    socket.on('sendMessage', async (data) => {
      try {
        // Save message to DB
        const message = await prisma.message.create({
          data: {
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: data.content
          },
          include: { sender: true, receiver: true }
        });

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', message);
        }
        
        // Send confirmation to sender
        socket.emit('messageSent', message);
      } catch (error) {
        console.error('Socket send message error:', error);
      }
    });

    // Live streaming signaling
    socket.on('joinStream', (streamId) => {
      socket.join(`stream-${streamId}`);
      console.log(`Client ${socket.id} joined stream ${streamId}`);
    });

    socket.on('leaveStream', (streamId) => {
      socket.leave(`stream-${streamId}`);
    });

    socket.on('streamSignal', (data) => {
      socket.to(`stream-${data.streamId}`).emit('streamSignal', data);
    });

    // User disconnects
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('userStatusChanged', { userId: socket.userId, online: false });
      }
    });
  });

  return io;
}
