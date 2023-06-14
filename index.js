const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

const io = new Server(server);

app.use(express.static("public"));

const users = {};

app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});

io.on("connection", (socket) => {
  socket.on("user", (name)=>{
    users[socket.id] = name;
  })
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});

io.on("connection", (socket) => {
  socket.on('chat message', (msg)=>{
    io.emit("chat message", {message: msg, name: users[socket.id]});
  })
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle socket events here

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
