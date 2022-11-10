const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const helloWorld = async () => {
  await console.log("Hello World");
}

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
    console.log("message: " + msg);
    socket.broadcast.emit("chat message", msg);
  });
  //send message to client
});

server.listen(4005, () => {
  console.log("listening on *:4005");
});
