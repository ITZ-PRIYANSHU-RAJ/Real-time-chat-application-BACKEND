const onlineUsers = new Map();

export const configureSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("setup", (userId) => {
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      io.emit("presence:update", Array.from(onlineUsers.keys()));
    });

    socket.on("chat:join", (chatId) => {
      socket.join(chatId);
    });

    socket.on("chat:leave", (chatId) => {
      socket.leave(chatId);
    });

    socket.on("message:new", ({ chatId, message, participants }) => {
      socket.to(chatId).emit("message:received", message);

      if (Array.isArray(participants)) {
        participants.forEach((participantId) => {
          if (String(participantId) !== String(message.sender._id)) {
            socket.to(String(participantId)).emit("chat:refresh", { chatId });
          }
        });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("presence:update", Array.from(onlineUsers.keys()));
    });
  });
};
