var fs = require("fs");
var url = require("url");
var http = require("http");
var bodyParser = require("body-parser");

var express = require("express");
//var session = require("express-session"); //Read up on this, spesifically storage
//var MemoryStore = require('memorystore')(session); //consider changing this
var app = express();
/*app.use(session({
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: "sessionSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false, maxAge: 60000}
}));*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var path = require("path");

var serverPort = 8080;

var server = http.createServer(app);
var io = require('socket.io')(server);

var teledraw = require("./server/teledraw.js");

var rooms = {};
var roomOwners = {};
var roomMembers = {};

var games = {};

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
/*app.get("/client/joinRoom", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/client/joinRoom.html"));
});*/

//these are just for testing and can be removed in production
app.get("/scripts/clientTest", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/scripts/clientTest.html"));
});
app.get("/scripts/hostTest", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/scripts/hostTest.html"));
});

/*app.use(function(req, res, next) {
  if (!req.session.client) {
    req.session.client = {};
  }
  console.log(req.session);
  return next();
});*/
//handle errors
/*app.post("/client/joinRoom", function(req, res) { //escape requests
  if (!(req.body.room in rooms) || (req.body.room in rooms[req.body.room].members)) {
    console.log(req.body.name + " tried to join non exixting room " + req.body.room);
    res.redirect("/client/joinRoom");
  } else {
    console.log("Client joined romm with: " + req.body.name + ", " + req.body.room);
    req.session.client = {name: req.body.name, room: req.body.room};
    res.redirect("/client/client");
    console.log(req.session);
  }
});
app.post("/client/client", function(req, res) {
  console.log(req.session);
  if (!req.session.client) {
    //res.send("error");
    console.log("errror");
  } else {
    //res.setHeader("Content-Type", "application/json");
    //res.send(JSON.stringify(req.session.client));
    res.json(req.session.client);
  }
});*/

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
    rooms[newRoomCode] = {owner: socket.id, game: "none", members: {}, memberNames: {}, ready: 0};
    roomOwners[socket.id] = newRoomCode;
    socket.join(newRoomCode);
    io.sockets.in(newRoomCode).emit("newRoom", {room: newRoomCode});
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
      console.log("Client joined romm with: " + req.name + ", " + req.room);
      //req.session.client = {name: req.body.name, room: req.body.room};
      console.log(req);
      rooms[req.room].members[req.name] = socket.id;
      rooms[req.room].memberNames[socket.id] = req.name;
      roomMembers[socket.id] = req.room;
      socket.join(req.room);
      socket.emit("accepted", {name: req.name, room: req.room});
      io.sockets.to(rooms[req.room].owner).emit("newMember", {name: req.name});
      socket.emit("addButton", {text: "ready", value: "ready"});
    }
  });
  socket.on("button", function(msg) {
    if (msg.value === "ready") {
      let roomCode = roomMembers[socket.id];
      rooms[roomCode].ready++;
      socket.emit("text", {text: "ready"});
      if (rooms[roomCode].ready == Object.keys(rooms[roomCode].members).length) {
        io.sockets.to(roomMembers[socket.id]).emit("start", {});
      }
    } else if (msg.value === "clientData") {
      let roomCode = roomMembers[socket.id];
      games[roomCode].clientData(io, socket, rooms[roomCode].memberNames[socket.id], msg);
    }
  });
  socket.on("start", function(msg) {
    if (socket.id in roomOwners) {
      let roomCode = roomOwners[socket.id];
      games[roomCode] = new teledraw(rooms[roomCode].members, socket.id, roomCode);
      games[roomCode].start(io, socket);
    }
  });
  socket.on("clientData", function(msg) {
    let roomCode = roomMembers[socket.id];
    games[roomCode].clientData(io, socket, rooms[roomCode].memberNames[socket.id], msg);
  });
  socket.on("next", function(msg) {
    let roomCode = roomOwners[socket.id];
    games[roomCode].next(io, socket);
  });

  socket.on("text", function(msg) {
    let roomCode = roomMembers[socket.id];
    games[roomCode].clientData(io, socket, rooms[roomCode].memberNames[socket.id], msg);
  });

  socket.on("paths", function(msg) {
    let roomCode = roomMembers[socket.id];
    games[roomCode].clientData(io, socket, rooms[roomCode].memberNames[socket.id], msg);
  });

  //these are for testing
  socket.on("testDisplayCanvas", function(msg) {
    let resMsg = {
      paths: [
        {
          pts:
            [
              {x: 0.25, y: 0.25},
              {x: 0.75, y: 0.75}
            ]
        },
        {
          pts:
            [
              {x: 0.25, y: 0.75},
              {x: 0.75, y: 0.25}
            ]
        }
      ]
    };
    socket.emit("testDisplayCanvas", resMsg);
  });
  /*socket.on("paths", function(msg) {
    console.log(msg.paths.length);
    io.sockets.emit("paths", msg);
  });
  socket.on("text", function(msg) {
    console.log(msg.text);
    io.sockets.emit("text", msg);
  });*/

  //on disconnect remove room
});

server.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
});
