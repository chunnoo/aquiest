var socket = io("http://" + CONFIG_IP + ":8080");
var name = null;
var room = null;

var _moduleScripts = [];
var _pushingModules = false;
var _loading = false;
var _modules = {};

var _content = [];
var _footer = null;

var _contentQueue = [];
var _footerQueue = null;

function addToContent(element) {
  _content.push(element);
  let content = document.getElementById("content");
  content.scrollTop = content.scrollHeight;
}

function setClientData(receivedName, receivedRoom) {
  name = receivedName;
  room = receivedRoom;
  document.getElementById("headerText").innerHTML = name;
  document.getElementById("headerInfo").innerHTML = room;
}

function addJoin(firstPlaceholder, secondPlaceholder) {
  let join = new Join();
  join.init();
  join.setPlaceholders(firstPlaceholder, secondPlaceholder);
  addToContent(join);
}

function loadModules(modules, callback) {
  _pushingModules = true;
  _loading = true;
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
  if (_footerQueue !== null) {
    if (_footerQueue === "none") {
      disableFooter();
    } else {
      setFooter(_footerQueue.module, _footerQueue.data);
    }
  }
  _footerQueue = null;
}

function moduleLoaded(callback) {
  if (!_pushingModules) {
    let allLoaded = true;
    for (let i = 0; i < _moduleScripts.length; i++) {
      allLoaded = allLoaded && _moduleScripts[i].loaded;
    }
    if (allLoaded) {
      if (callback === "respond") {
        socket.emit("loaded", {});
      } else if (callback === "init") {
        addJoin("Name", "Room");
      }
      _loading = false;
      addQueue();
    }
  }
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

function addText(text) {
  let displayText = new _modules["text"]();
  displayText.init({text: text});
  addToContent(displayText);
}

function addButton(type, value, text) {
  let button = new _modules["button"]();
  button.init({type: type, value: value, text: text});
  addToContent(button);
}

function disableFooter() {
  if (_loading) {
    _footerQueue = "none";
  } else {
    if (_footer) {
      _footer.delete();
      _footer = null;
    }
  }
}

function setFooter(module, data) {
  if (_loading) {
    _footerQueue = {module: module, data: data};
  } else {
    disableFooter();
    let footerModule = new _modules[module]();
    footerModule.init(data);
    _footer = footerModule;
  }
}

socket.on("connect", function() {
  clear();
  loadModules(["button", "text"], "init");
});

socket.on("rejected", function(msg) {
  clear();
  addJoin("Name", "Room");
  addText(msg.text);
});

socket.on("accepted", function(msg) {
  clear();
  setClientData(msg.name, msg.room);
  if (msg.text !== "") {
    addText("Accepted into room");
  }
});

socket.on("loadModules", function(msg) {
  if (!msg.callback) {
    loadModules(msg.modules, "respond");
  } else {
    loadModules(msg.modules, msg.callback);
  }
});

socket.on("clear", function(msg) {
  clear();
});

socket.on("addModule", function(msg) {
  addModule(msg.module, msg.data);
});

socket.on("clearAndAddModule", function(msg) {
  clear();
  addModule(msg.module, msg.data);
});

socket.on("addModules", function(msg) {
  for (let i = 0; i < msg.modules.length; i++) {
    addModule(msg.modules[i].module, msg.modules[i].data);
  }
});

socket.on("clearAndAddModules", function(msg) {
  clear();
  for (let i = 0; i < msg.modules.length; i++) {
    addModule(msg.modules[i].module, msg.modules[i].data);
  }
});

socket.on("disableFooter", function(msg) {
  disableFooter();
});

socket.on("setFooter", function(msg) {
  setFooter(msg.module, msg.data);
});
