const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const users = {};

app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend/build")));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ username, room }) => {
    if (!username || !room) {
      console.error("Username or room is missing!");
      return;
    }

    console.log(`User ${username} joined room ${room}`);

    socket.join(room);
    users[socket.id] = { username, room };

    socket.emit("message", {
      username: "Admin",
      text: `Welcome to the chat, ${username}!`,
      time: new Date().toLocaleTimeString(),
    });

    socket.broadcast.to(room).emit("message", {
      username: "Admin",
      text: `${username} has joined the chat.`,
      time: new Date().toLocaleTimeString(),
    });

    io.to(room).emit("roomUsers", {
      room,
      users: Object.values(users).filter((user) => user.room === room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit("message", {
        username: msg.username || user.username,
        text: msg.text,
        time: new Date().toLocaleTimeString(),
      });
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit("message", {
        username: "Admin",
        text: `${user.username} has left the chat.`,
        time: new Date().toLocaleTimeString(),
      });

      delete users[socket.id];

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: Object.values(users).filter((u) => u.room === user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
