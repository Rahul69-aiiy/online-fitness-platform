import { Server } from 'socket.io';

// User online tracking
const onlineUsers = new Map(); // userId -> socketId
let io = null;

export function emitToUser(userId, event, data) {
  if (!io) return;
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
}

export default function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL],
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
    });

    // User disconnects
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
      }
    });
  });

  return io;
}
