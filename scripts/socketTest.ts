import { io, Socket } from "socket.io-client";

type JoinPayload = {
  userId: string;
};

type FilePayload = {
  name: string;
  content: string;
};

const socket: Socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join-project", {
    projectId: "test-project",
    userId: "test-user",
  });

  socket.emit("file-change", {
    projectId: "test-project",
    file: {
      name: "index.ts",
      content: "console.log('hi')",
    },
  });
});

socket.on("user-joined", (data: JoinPayload) => {
  console.log("User joined:", data.userId);
});

socket.on("file-updated", (data: FilePayload) => {
  console.log("File updated:", data.name);
});
