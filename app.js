const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const helloWorld = async () => {
  await console.log("Hello World");
};

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

io.on("connection", (socket) => {
  helloWorld();
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    console.log("chat message: " + msg);
    socket.broadcast.emit("chat message", msg);
  });
  socket.on("Welcome", (msg) => {
    console.log("Welcome: " + msg);
    socket.broadcast.emit("Welcome", msg);
  });
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});

server.listen(4005, () => {
  console.log("listening on *:4005");
});
