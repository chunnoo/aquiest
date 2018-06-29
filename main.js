var fs = require("fs");
var url = require("url");
var http = require("http");
var bodyParser = require("body-parser");

var express = require("express");
var session = require("express-session"); //Read up on this, spesifically storage
var MemoryStore = require('memorystore')(session); //consider changing this
var app = express();
app.use(session({
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: "sessionSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false, maxAge: 60000}
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var path = require("path");

var serverPort = 8080;

var server = http.createServer(app);
var io = require('socket.io')(server);

var rooms = {};
var roomOwners = {};

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
app.get("/client/joinRoom", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/client/joinRoom.html"));
});

/*app.use(function(req, res, next) {
  if (!req.session.client) {
    req.session.client = {};
  }
  console.log(req.session);
  return next();
});*/
//handle errors
app.post("/client/joinRoom", function(req, res) { //escape requests
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
});

app.get("/*.css", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/" + url.parse(req.url, true).pathname));
});
app.get("/*.js", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/" + url.parse(req.url, true).pathname));
});

io.on("connection", function(socket) {
  socket.on("requestNewRoom", function(req) {
    let newRoomCode = generateRandomString(4);
    rooms[newRoomCode] = {owner: socket.id, members: {}};
    roomOwners[socket.id] = {room: newRoomCode};
    socket.join(newRoomCode);
    io.sockets.in(newRoomCode).emit("newRoom", {room: newRoomCode});
    console.log("New room: " + newRoomCode + ", owner: " + socket.id);
  });
  socket.on("joinRoom", function(req) { //check for room existence
    console.log(req);
    rooms[req.room].members[req.name] = socket.id;
    socket.join(req.room);
    io.sockets.to(socket.id).emit("accepted", {});
    io.sockets.to(rooms[req.room].owner).emit("newMember", {name: req.name});
  });
  //on disconnect remove room
});

server.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
});
