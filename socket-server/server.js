const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room (buyer + seller same room)
  socket.on("join_room", (roomId) => {
    console.log("User Connected this Room ID -", roomId);
    socket.join(roomId);
  });

  // Send message
  socket.on("send_message", (data) => {
    console.log("recived this message -", data);
    /*
      data = {
        roomId,
        sender,
        message,
        time
      }
    */
    io.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Socket server running on port 3001");
});
