import { Server } from "socket.io";

let io: Server | null = null;

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-project", ({ projectId, userId }) => {
      socket.join(projectId);
      socket.to(projectId).emit("user-joined", { userId });
    });

    socket.on("file-change", ({ projectId, file }) => {
      socket.to(projectId).emit("file-updated", file);
    });

    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) => {
        socket.to(room).emit("user-left", { socketId: socket.id });
      });
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}
