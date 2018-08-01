var socket = io("http://" + CONFIG_IP + ":8080");
var room = null;

var _content = [];
var _game = null;

function toRoom(command, data) {
  socket.emit("toRoom", {command: command, data: data});
}

function toClient(client, command, data) {
  socket.emit("toClient", {client: client, command: command, data: data});
}

function roomLoadModules(modules) {
  socket.emit("roomLoadModules", {modules: modules});
}

function clientLoadModules(client, modules) {
  socket.emit("clientLoadModules", {client: client, modules: modules});
}

function acceptClient(name, id, modules, command, data) {
  socket.emit("acceptClient", {name: name, id: id, modules: modules, command: command, data: data});
}

function rejectClient(id, text) {
  socket.emit("rejectClient", {id: id, text: text});
}

function addToContent(element) {
  _content.push(element);
  let content = document.getElementById("content");
  content.scrollTop = content.scrollHeight;
}

function clear() {
  for (let i = 0; i < _content.length; i++) {
    _content[i].delete();
  }
  _content = [];
}

function addGamesMenu(games) {
  let gamesMenu = new GamesMenu();
  gamesMenu.init();
  gamesMenu.addGames(games);
  addToContent(gamesMenu);
}

function addGameScript(game) {
  let gameScript = new GameScript(game);
  addToContent(gameScript);
}

function initGame() {
  _game = new Game();
  socket.emit("hostReady", {});
}

function next() {
  _game.next();
}

function addDisplayText(msgText) {
  let displayText = new DisplayText();
  displayText.setText(msgText);
  addToContent(displayText);
}

function addDisplayTextAlign(msgText, align) {
  let displayText = new DisplayText();
  displayText.setText(msgText);
  displayText.setAlign(align);
  addToContent(displayText);
}

function addDisplayCanvas(msgPaths) {
  let displayCanvas = new DisplayCanvas();
  displayCanvas.init();
  displayCanvas.addPaths(msgPaths);
  addToContent(displayCanvas);
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

socket.on("join", function(msg) {
  _game.join(msg.name, msg.id);
});

socket.on("allReady", function(msg) {
  _game.init(msg.clients);
});

socket.on("allLoaded", function(msg) {
  _game.start();
});

socket.on("text", function(msg) {
  clear();
  addDisplayText(msg.text);
});

socket.on("clientData", function(msg) {
  _game.clientData(msg.client, msg.data);
});

socket.on("displayText", function(msg) {
  clear();
  addDisplayText(msg.text);
});

socket.on("displayCanvas", function(msg) {
  clear();
  addDisplayCanvas(msg.paths);
});
