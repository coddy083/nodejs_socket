const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const app = express();
const port = process.env.PORT || 4005;
const server = http.createServer(app);
const io = new Server(server);
const { ObjectId } = require("mongodb");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyParser = require("body-parser").json();
const uri =
  "mongodb+srv://user:10041004@cluster0.avef3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: { version: ServerApiVersion.v1 },
});
client.connect((err) => {
  const collection = client.db("UserDB").collection("User");
  // perform actions on the collection object
});

const UserDB = client.db("UserDB").collection("User");

// const interval = setInterval(() =>{
//   console.log("Hello World");
// }, 2000);

app.get("/", (req, res) => {
  // interval;
  res.status(200).json({ msg: "hello world" });
});

app.get("/users", (req, res) => {
  UserDB.find({}).toArray((err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

app.get("/users", async (req, res) => {
  req.query.id
    ? await UserDB.findOne({ _id: ObjectId(req.query.id) }, (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
      })
    : await UserDB.find({}).toArray((err, result) => {
        if (err) throw err;
        res.status(200).json(result);
      });
});

app.post("/users", bodyParser, (req, res) => {
  const { name, age } = req.body;
  UserDB.insertOne({ name, age }, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

app.put("/users", bodyParser, (req, res) => {
  const { id, name, age } = req.body;
  UserDB.updateOne(
    { _id: ObjectId(id) },
    { $set: { name, age } },
    (err, result) => {
      if (err) throw err;
      res.status(200).json(result);
    }
  );
});

app.delete("/users", bodyParser, (req, res) => {
  const { id } = req.body;
  UserDB.deleteOne({ _id: ObjectId(id) }, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

const chat = io.of("/chat");

chat.on("connection", (socket) => {
  console.log("User connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  // socket.on("message", (message) => {
  //   console.log(message);
  //   chat.emit("message", message);
  // });
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User joined ${room}`);
  });
  socket.on("leave", (room) => {
    socket.leave(room);
    console.log(`User left ${room}`);
  });
  socket.on("chat message", (message) => {
    console.log(message);
    // chat.to(room).emit("message", message);
    // chat.in(room).emit("chat message", message);
    socket.broadcast.emit("Welcome", msg);
  }
  );
});

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
//   socket.on("chat message", (msg) => {
//     console.log("chat message: " + msg);
//     socket.broadcast.emit("chat message", msg);
//   });
//   socket.on("Welcome", (msg) => {
//     console.log("Welcome: " + msg);
//     socket.broadcast.emit("Welcome", msg);
//   });
//   socket.on("typing", (data) => {
//     socket.broadcast.emit("typing", data);
//   });
// });

server.listen(port, () => {
  console.log(`서버시작 포트${port}`);
});
