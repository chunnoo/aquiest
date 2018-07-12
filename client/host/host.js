var socket = io("http://" + CONFIG_IP + ":8080");
var room = null;

var content = [];
var game = null;

function emitToRoom(command, data) {
  socket.emit("toRoom", {command: command, data: data});
}

function emitToClient(client, command, data) {
  socket.emit("toClient", {client: client, command: command, data: data});
}

function clear() {
  for (let i = 0; i < content.length; i++) {
    content[i].delete();
  }
  content = [];
}

function addGamesMenu(games) {
  let gamesMenu = new GamesMenu();
  gamesMenu.init();
  gamesMenu.addGames(games);
  content.push(gamesMenu);
}

function addGameScript(game) {
  let gameScript = new GameScript(game);
  content.push(gameScript);
}

function initGame() {
  game = new Game();
  socket.emit("hostReady", {});
}

function next() {
  game.next();
}

function addDisplayText(msgText) {
  let displayText = new DisplayText();
  displayText.setText(msgText);
  content.push(displayText);
}

function addDisplayCanvas(msgPaths) {
  let displayCanvas = new DisplayCanvas();
  displayCanvas.init();
  displayCanvas.addPaths(msgPaths);
  content.push(displayCanvas);
}

socket.on("connect", function() {
  socket.emit("requestNewRoom", {});
});

socket.on("newRoom", function(msg) {
  room = msg.room;
  document.getElementById("headerInfo").innerHTML = room;

  socket.emit("requestGames", {});
});

socket.on("games", function(msg) {
  clear();
  addGamesMenu(msg.games);
});

socket.on("gameScript", function(msg) {
  clear();
  addGameScript(msg.game);
});

socket.on("newMember", function(msg) {
  addDisplayText(msg.name);
});

socket.on("start", function(msg) {
  game.start(msg.clients);
});

socket.on("text", function(msg) {
  clear();
  addDisplayText(msg.text);
});

socket.on("clientData", function(msg) {
  game.clientData(msg.client, msg.data);
});

socket.on("displayText", function(msg) {
  clear();
  addDisplayText(msg.text);
});

socket.on("displayCanvas", function(msg) {
  clear();
  addDisplayCanvas(msg.paths);
});
