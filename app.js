const { Server } = require("socket.io");
const express = require("express");
const uri = 'mongodb://root:1234@mongodb:27017';
const http = require("http");
const app = express();
const port = process.env.PORT || 8008;
const server = http.createServer(app);
const io = new Server(server);
const users = [];

server.listen(port, () => {
  console.log(`서버시작 포트는 ${port}`);
});

// 몽구스 연결
const mongoose = require("mongoose");
mongoose.connect(uri,{
      // useNewUrlPaser: true,
      // useUnifiedTofology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }
  )
  .then(() => console.log('***** MongoDB conected *****'))
  .catch((err) => {
    console.log(err);
  });

// 스키마 생성
const Schema = mongoose.Schema;
const chatMessage = new Schema({
  user: String,
  room: String,
  userName: String,
  message: String,
  time: Date,
});

// 모델 생성
const Chat = mongoose.model('Chat', chatMessage);

// 데이터 생성
async function chatSave(chatDoc) {
  const chatmsg = new Chat(chatDoc);
  chatmsg.save((err, result) => {
    if (err) throw err;
    console.log(result);
  });
};
// 몽구스 종료

app.get("/", async (req, res) => {
  res.status(200).json({ msg: "Server Moa Gudok Chat Server" });
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
