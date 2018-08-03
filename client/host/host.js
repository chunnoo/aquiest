var socket = io("http://" + CONFIG_IP + ":8080");
var room = null;

var _moduleScripts = [];
var _pushingModules = false;
var _loading = false;
var _modules = {};

var _loadingElement = new Loading();
_loadingElement.init(true);

var _content = [];
var _game = null;

var _clientsLoaded = false;

var _contentQueue = [];

function loadModulesWithCallback(modules, callback) {
  _pushingModules = true;
  _loading = true;
  _loadingElement.update(true);
  for (let i = 0; i < modules.length; i++) {
    let moduleScript = new ModuleScript(modules[i], callback);
    _moduleScripts.push(moduleScript);
  }
  _pushingModules = false;
}

function addQueue() {
  while (_contentQueue.length > 0) {
    let next = _contentQueue[0];
    _contentQueue.shift();
    if (next === "clear") {
      clear();
    } else {
      addModule(next.name, next.data);
    }
  }
}

function moduleLoaded(callback) {
  if (!_pushingModules) {
    let allLoaded = true;
    for (let i = 0; i < _moduleScripts.length; i++) {
      allLoaded = allLoaded && _moduleScripts[i].loaded;
    }
    if (allLoaded) {
      if (callback === "start") {
         if (_clientsLoaded) {
           _game.start();
         }
      } else if (callback === "init") {
        socket.emit("requestNewRoom", {});
      }
      _loading = false;
      _loadingElement.update(false);
      addQueue();
    }
  }
}

function toRoom(command, data) {
  socket.emit("toRoom", {command: command, data: data});
}

function toClient(client, command, data) {
  socket.emit("toClient", {client: client, command: command, data: data});
}

function loadModules(modules) {
  loadModulesWithCallback(modules, "start")
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

function addModule(name, data) {
  if (_loading) {
    let next = {name: name, data: data};
    _contentQueue.push(next);
  } else {
    let newModule = new _modules[name]();
    newModule.init(data);
    addToContent(newModule);
  }
}

function addModules(modules) {
  for (let i = 0; i < modules.length; i++) {
    addModule(modules[i].module, modules[i].data);
  }
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

/*function addDisplayText(msgText) {
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
}*/

socket.on("connect", function() {
  loadModulesWithCallback(["text"], "init");
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
  addModule("text", {text: msg.name});
});

socket.on("join", function(msg) {
  _game.join(msg.name, msg.id);
});

socket.on("allReady", function(msg) {
  _game.init(msg.clients);
});

socket.on("allLoaded", function(msg) {
  _clientsLoaded = true;
  if (!_loading) {
    _game.start();
  }
});

/*socket.on("text", function(msg) {
  clear();
  addDisplayText(msg.text);
});*/

socket.on("clientData", function(msg) {
  _game.clientData(msg.client, msg.data);
});

/*socket.on("displayText", function(msg) {
  clear();
  addDisplayText(msg.text);
});

socket.on("displayCanvas", function(msg) {
  clear();
  addDisplayCanvas(msg.paths);
});*/
