require("dotenv").config();
const { Server } = require("socket.io");
const { createServer } = require("http");

const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";

// const port = process.env.PORT || 1337;
// const http = createServer((req, res) => {
//     res.writeHead(200);
//     res.end('This is my socketio server\n');
//   }).listen(port, () => {console.log("Server is running")});

const http = createServer((req, res) => {
  res.writeHead(200);
  res.end("This is my socketio server\n");
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const io = new Server(http, {
  cors: {
    origin: "*",
  },
});

let adminSId;
io.sockets.on("connection", (socket) => {
  console.log(Date.now(), socket.id, "New user connected");

  socket.on("join", function (roomName, isAdmin) {
    socket.join(roomName);
    if (isAdmin) {
      adminSId = socket.id;
      console.log("Is admin :", adminSId);
    } else {
      console.log("Simple user", socket.id);
    }
  });

  //Triggered when the person who joined the room is ready to communicate.
  socket.on("ready", function (roomName) {
    socket.broadcast.to(roomName).emit("ready"); //Informs the other peer in the room.
  });

  //Triggered when server gets an offer from a peer in the room.
  socket.on("mess", function (mess) {
    console.log(mess);
    io.sockets.emit("mess", mess);
  });

  socket.on("mess2", function (mess) {
    console.log(mess);
    console.log(adminSId);
    socket.emit("mess2", mess);
  });

  socket.on("disconnect", function () {
    console.log(Date.now(), socket.id, "User has disconnected");
    io.sockets.emit("disuser", socket.id);
  });
});
