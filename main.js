var fs = require("fs");
var url = require("url");
var http = require("http");
var bodyParser = require("body-parser");

var express = require("express");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var path = require("path");

var serverPort = 8080;

var server = http.createServer(app);
var io = require('socket.io')(server);

var gamesArray = [
  {name: "teledraw", maxClients: 16},
  {name: "chat", maxClients: 16},
  {name: "pictionary", maxClients: 16},
  {name: "test", maxClients: 16},
  {name: "testDraw", maxClients: 16}
];

var rooms = {}; // {owner: id, game: "name", members: {name: id}, memberNames: {id: name}, hostReady: bool, ready: numberOfMembersWhoIsReady, loaded: numberOfMembersWhoHasLoadedMudules, gameStarted: bool};
var roomOwners = {};
var roomMembers = {}; //{id: room}

var roomCaracters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function generateRandomString(length) {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += roomCaracters[Math.floor(Math.random()*roomCaracters.length)];
  }
  if (str in rooms) {
    return generateRandomString(length);
  } else {
    return str;
  }
}

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/index.html"));
});
app.get("/host/host", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/host/host.html"));
});
app.get("/client/client", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/client/client.html"));
});

//these are just for testing and can be removed in production
app.get("/scripts/clientTest", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/scripts/clientTest.html"));
});
app.get("/scripts/hostTest", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/scripts/hostTest.html"));
});

app.get("/*.css", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/" + url.parse(req.url, true).pathname));
});
app.get("/*.js", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/" + url.parse(req.url, true).pathname));
});

io.on("connection", function(socket) {
  console.log("new socket connection");
  socket.on("requestNewRoom", function(req) {
    let newRoomCode = generateRandomString(4);
    rooms[newRoomCode] = {owner: socket.id, game: "", members: {}, memberNames: {}, hostReady: false, ready: 0, loaded: 0, gameStarted: false};
    roomOwners[socket.id] = newRoomCode;
    socket.emit("newRoom", {room: newRoomCode});
    console.log("New room: " + newRoomCode + ", owner: " + socket.id);
  });
  socket.on("join", function(req) { //check for room existence
    if (!(req.room in rooms)) {
      console.log(req.name + " tried to join non exixting room " + req.room);
      socket.emit("rejected", {text: "Room does not exist"});
    } else if (req.name in rooms[req.room].members) {
      console.log(req.name + " already taken in room " + req.room);
      socket.emit("rejected", {text: "Name already taken"});
    } else {
      if (!rooms[req.room].gameStarted) {
        console.log("Client joined room with: " + req.name + ", " + req.room);
        rooms[req.room].members[req.name] = socket.id;
        rooms[req.room].memberNames[socket.id] = req.name;
        roomMembers[socket.id] = req.room;
        socket.join(req.room);
        socket.emit("accepted", {name: req.name, room: req.room, text: "Accepted into room"});
        io.sockets.to(rooms[req.room].owner).emit("newMember", {name: req.name});
        if (rooms[req.room].hostReady) {
          socket.emit("addModule", {module: "button", data: {type: "ready", value: "ready", text: "ready"}});
        }
      } else {
        console.log("Client tried to join room with: " + req.name + ", " + req.room);
        io.sockets.to(rooms[req.room].owner).emit("join", {name: req.name, id: socket.id});
      }
    }
  });
  socket.on("requestGames", function(req) {
    socket.emit("games", {games: gamesArray});
  });
  socket.on("requestGameScript", function(req) {
    console.log("Host of " + roomOwners[socket.id] + " requested game script " + req.name);
    rooms[roomOwners[socket.id]].game = req.name;
    socket.emit("gameScript", {game: req.name});
  });
  socket.on("hostReady", function(msg) {
    let roomCode = roomOwners[socket.id];
    rooms[roomCode].hostReady = true;
    console.log("Host of " + roomCode + " is ready");
    io.sockets.to(roomCode).emit("addModule", {module: "button", data: {type: "ready", value: "ready", text: "ready"}});
  });
  socket.on("toRoom", function(msg) {
    let roomCode = roomOwners[socket.id];
    io.sockets.to(roomCode).emit(msg.command, msg.data);
  });
  socket.on("toClient", function(msg) {
    let roomCode = roomOwners[socket.id];
    let clientId = rooms[roomCode].members[msg.client];
    io.sockets.to(clientId).emit(msg.command, msg.data);
  });
  socket.on("roomLoadModules", function(msg) {
    let roomCode = roomOwners[socket.id];
    io.sockets.to(roomCode).emit("loadModules", msg);
  });
  socket.on("clientLoadModules", function(msg) {
    let roomCode = roomOwners[socket.id];
    let clientId = rooms[roomCode].members[msg.client];
    io.sockets.to(clientId).emit("loadModules", {modules: msg.modules});
  });
  socket.on("loaded", function(msg) {
    let roomCode = roomMembers[socket.id];
    rooms[roomCode].loaded++;
    if (rooms[roomCode].loaded == Object.keys(rooms[roomCode].members).length) {
      io.sockets.to(rooms[roomCode].owner).emit("allLoaded", {});
    }
  });
  socket.on("acceptClient", function(msg) {
    let roomCode = roomOwners[socket.id];
    rooms[roomCode].members[msg.name] = msg.id;
    rooms[roomCode].memberNames[msg.id] = msg.name;
    roomMembers[msg.id] = roomCode;
    io.sockets.connected[msg.id].join(roomCode);
    io.sockets.to(msg.id).emit("accepted", {name: msg.name, room: roomCode, text: ""});
    io.sockets.to(msg.id).emit("loadModules", {modules: msg.modules, callback: "none"});
    io.sockets.to(msg.id).emit(msg.command, msg.data);
  });
  socket.on("rejectClient", function(msg) {
    io.sockets.to(msg.id).emit("rejected", {text: msg.text});
  });
  socket.on("button", function(msg) {
    if (msg.type === "ready") {
      let roomCode = roomMembers[socket.id];
      rooms[roomCode].ready++;
      socket.emit("clearAndAddModule", {module: "text", data: {text: "ready"}});
      if (rooms[roomCode].ready == Object.keys(rooms[roomCode].members).length) {
        io.sockets.to(rooms[roomCode].owner).emit("allReady", {clients: Object.keys(rooms[roomCode].members)});
        rooms[roomCode].gameStarted = true;
      }
    } else if (msg.type === "clientData") {
      let roomCode = roomMembers[socket.id];
      io.sockets.to(rooms[roomCode].owner).emit("clientData", {client: rooms[roomCode].memberNames[socket.id], data: {value: msg.value}});
    }
  });
  socket.on("clientData", function(msg) {
    let roomCode = roomMembers[socket.id];
    io.sockets.to(rooms[roomCode].owner).emit("clientData", {client: rooms[roomCode].memberNames[socket.id], data: msg});
  });

  socket.on("text", function(msg) {
    let roomCode = roomMembers[socket.id];
    io.sockets.to(rooms[roomCode].owner).emit("clientData", {client: rooms[roomCode].memberNames[socket.id], data: msg});
  });

  //on disconnect remove room
});

server.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
});
