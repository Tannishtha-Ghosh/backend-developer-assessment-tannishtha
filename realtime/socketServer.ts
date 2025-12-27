import { Server } from "socket.io";
import http from "http";

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
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

server.listen(4000, () => {
  console.log("Socket server running on port 4000");
});
