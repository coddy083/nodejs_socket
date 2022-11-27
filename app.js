import { Server } from 'socket.io';
import { hello } from './hello.js';
import { chatSave, Chat } from './serializer.js';
import express from 'express';
import http from 'http';
const app = express();
const port = process.env.PORT || 8008;
const server = http.createServer(app);
const io = new Server(server);
const users = [];

server.listen(port, () => {
  console.log(`서버시작 포트는 ${port}`);
});

app.get("/", async (req, res) => {
  chatSave({
    user: "user",
    room: "room1",
    userName: "user1",
    message: "hello world",
    time: new Date(),
  });
  res.status(200).json({ msg: hello() });
});

app.get("/chatList", (req, res) => {
  const room = req.query.room;
  Chat.find({ room: room }, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  }
  );
});

const chat = io.of("/chat");

chat.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  socket.on("join", (room, user) => {
    socket.join(room);
    users.push({
      room: room,
      user: user,
    });
    socket.broadcast.emit("join users", users);
    console.log(`${user} has joined the room`);
    console.log(users);
  });
  socket.on("leave", (room, user) => {
    socket.leave(room)
    users.splice(users.findIndex((item) => item.user === user), 1);
    console.log(`User left ${room}`);
    console.log(users);
  });
  socket.on("chat message", (room, user, userName, message) => {
    socket.in(room).emit("chat message", room, user, message, users);
    console.log(user, room, userName, message);
    const chatDoc = {
      user: user,
      room: room,
      userName: userName,
      message: message,
      time: new Date(),
    };
    chatSave(chatDoc);
  });
});
