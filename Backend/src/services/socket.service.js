import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;
const userSockets = new Map(); // userId -> Set of socketIds (to support multiple tabs)

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id || socket.user._id;
    if (!userId) return;

    // Map user to socket
    if (!userSockets.has(userId.toString())) {
      userSockets.set(userId.toString(), new Set());
    }
    userSockets.get(userId.toString()).add(socket.id);

    // Join user-specific room
    socket.join(userId.toString());
    console.log(`🔌 User connected: ${userId} (Socket ID: ${socket.id}). Total active users: ${userSockets.size}`);

    socket.on('disconnect', () => {
      const userIds = userSockets.get(userId.toString());
      if (userIds) {
        userIds.delete(socket.id);
        if (userIds.size === 0) {
          userSockets.delete(userId.toString());
        }
      }
      console.log(`🔌 User disconnected: ${userId} (Socket ID: ${socket.id})`);
    });
  });

  return io;
};

/**
 * Sends a real-time event to a specific user.
 * @param {string} userId - Target user ID
 * @param {string} event - Event name
 * @param {any} data - Event payload
 */
export const sendRealTimeNotification = (userId, event, data) => {
  if (io && userId) {
    io.to(userId.toString()).emit(event, data);
    return true;
  }
  return false;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
