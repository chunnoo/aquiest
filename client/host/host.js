var socket = io("http://" + CONFIG_IP + ":8080");
var room = null;

var _moduleScripts = [];
var _pushingModules = false;
var _loading = false;
var _modules = {};

var _gamesMenu = null;
var _menuClientList = null;

var _loadingElement = new Loading();
_loadingElement.init(true);

var _content = [];
var _headerCenter = null;
var _game = null;
var _dictionary = null;

var _clientsLoaded = false;
var _loadingModules = false;
var _loadingDictionaries = false;

var _actionQueue = [];
var _contentQueue = [];
var _headerCenterQueue = null;

function startLoading() {
  _loading = true;
  _loadingElement.update(true);
}

function doneLoading() {
  if (!_loadingModules && !_loadingDictionaries) {
    _loading = false;
    _loadingElement.update(false);
    addQueue();
  }
}

function loadModulesWithCallback(modules, callback) {
  _pushingModules = true;
  _loadingModules = true;
  startLoading();
  for (let i = 0; i < modules.length; i++) {
    let moduleScript = new ModuleScript(modules[i], callback);
    _moduleScripts.push(moduleScript);
  }
  _pushingModules = false;
}

function pushContentQueue(next) {
  _contentQueue.push(next);
  return _content.length + _contentQueue.length - 1;
}

function addQueue() {
  while (_actionQueue.length > 0) {
    let nextAction = _actionQueue[0];
    _actionQueue.shift();
    if (nextAction === "next") {
      next();
    }
  }
  _actionQueue = [];
  while (_contentQueue.length > 0) {
    let next = _contentQueue[0];
    _contentQueue.shift();
    if (next === "clear") {
      clear();
    } else {
      addModule(next.name, next.data);
    }
  }
  _contentQueue = [];
  if (_headerCenterQueue !== null) {
    if (_headerCenterQueue === "none") {
      disableHeader();
    } else {
      setHeader(_headerCenterQueue.module, _headerCenterQueue.data);
    }
  }
  _headerCenterQueue = null;
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
      _loadingModules = false;
      doneLoading();
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
  return _content.length - 1;
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
    return pushContentQueue(next);
  } else {
    let newModule = new _modules[name]();
    newModule.init(data);
    return addToContent(newModule);
  }
}

function addModules(modules) {
  for (let i = 0; i < modules.length; i++) {
    addModule(modules[i].module, modules[i].data);
  }
}

function updateModule(contentIndex, data) {
  _content[contentIndex].update(data);
}

function loadDictionary(dictionary) {
  socket.emit("requestDictionary", {dictionary: dictionary});
  _loadingDictionaries = true;
  startLoading();
}

function getRandomDictionaryWord() {
  return _dictionary.words[Math.floor(Math.random() * _dictionary.words.length)];
}

function disableHeader() {
  if (_loading) {
    _headerCenterQueue = "none";
  } else {
    if (_headerCenter) {
      _headerCenter.delete();
      _headerCenter = null;
    }
  }
}

function setHeader(module, data) {
  if (_loading) {
    _headerCenterQueue = {module: module, data: data};
  } else {
    disableHeader();
    let headerModule = new _modules[module]();
    headerModule.init(data);
    _headerCenter = headerModule;
  }
}

function updateHeader(data) {
  if (_headerCenter !== null) {
    _headerCenter.update(data);
  }
}

function getHeaderData() {
  if (_headerCenter.getData) {
    return _headerCenter.getData();
  } else {
    return {};
  }
}

function headerIsSet() {
  return (_headerCenter !== null);
}

function headerCallback() {
  disableHeader();
  next();
}

function addGamesMenu(games) {
  let gamesMenu = new GamesMenu();
  gamesMenu.init();
  gamesMenu.addGames(games);
  _gamesMenu = gamesMenu;
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
  if (!_loading) {
    _game.next();
  } else {
    _actionQueue.push("next");
  }
}

socket.on("connect", function() {
  loadModulesWithCallback(["text"], "init");
});

socket.on("newRoom", function(msg) {
  room = msg.room;
  document.getElementById("headerInfo").innerHTML = room;

  _menuClientList = new MenuClientList();
  _menuClientList.init({});

  socket.emit("requestGames", {});
});

socket.on("games", function(msg) {
  clear();
  addGamesMenu(msg.games);
});

socket.on("gameScript", function(msg) {
  clear();
  _gamesMenu.delete();
  _gamesMenu = null;
  _menuClientList.update({state: "center"});
  addGameScript(msg.game);
});

socket.on("newMember", function(msg) {
  _menuClientList.update({client: msg.name});
});

socket.on("join", function(msg) {
  _game.join(msg.name, msg.id);
});

socket.on("dictionary", function(msg) {
  _dictionary = msg;
  _loadingDictionaries = false;
  doneLoading();
});

socket.on("allReady", function(msg) {
  _menuClientList.delete();
  _menuClientList = null;
  _game.init(msg.clients);
});

socket.on("allLoaded", function(msg) {
  _clientsLoaded = true;
  if (!_loading) {
    _game.start();
  }
});

socket.on("clientData", function(msg) {
  _game.clientData(msg.client, msg.data);
});
