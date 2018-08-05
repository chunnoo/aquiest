function Game() {
  this.clients = [];
  this.scores = [];
  this.correctGuesses = 0;

  this.dictionary = "wordsNo";

  this.clientModules = ["point", "path", "draw", "footerWrite", "headerTimer"];

  this.currentDrawer = -1;
  this.currentWord = "";

  this.clientList = null;
  this.canvas = null;

  this.init = function(clients) {
    this.clients = clients;
    for (let i = 0; i < this.clients.length; i++) {
     this.scores.push(0);
    }

    loadModules(["point", "path", "displayDraw", "clientList", "headerTimer"]);
    loadDictionary(this.dictionary);

    roomLoadModules(this.clientModules);

    //in next function, pause on _loading. Then during game dictionary load might be possible.
  };

  this.start = function() {
    clear();

    next();
  };

  this.next = function() {
    clear();
    this.currentDrawer = (this.currentDrawer + 1) % this.clients.length;
    this.currentWord = getRandomDictionaryWord();
    this.correctGuesses = 0;

    this.clientList = addModule("clientList", {clients: this.clients, clientData: this.scores, highlight: this.clients[this.currentDrawer]});
    this.canvas = addModule("displayDraw", {});
    setHeader("headerTimer", {time: 60});

    toClient(this.clients[this.currentDrawer], "disableFooter", {});
    toClient(this.clients[this.currentDrawer], "setHeader", {module: "headerTimer", data: {time: 60}});
    toClient(this.clients[this.currentDrawer], "clearAndAddModules", {modules: [{module: "text", data: {text: this.currentWord}}, {module: "draw", data: {live: true}}]});

    for (let i = 0; i < this.clients.length; i++) {
      if (i != this.currentDrawer) {
        toClient(this.clients[i], "clear", {});
        toClient(this.clients[i], "disableHeader", {});
        toClient(this.clients[i], "setFooter", {module: "footerWrite", data: {text: "text"}});
      }
    }
  };

  this.clientData = function(client, data) {
    if (client === this.clients[this.currentDrawer]) {
      if (data.paths) {
        updateModule(this.canvas, {paths: data.paths});
      }
      if (data.path) {
        updateModule(this.canvas, {path: data.path});
      }
    } else  {
      if (data.text && data.text === this.currentWord) {
        this.correctGuesses++;
        for (let i = 0; i < this.clients.length; i++) {
          if (client === this.clients[i]) {
            toClient(client, "disableHeader", {});
            toClient(client, "disableFooter", {});
            this.scores[i] += getHeaderData().time;
          }
        }
        if (this.correctGuesses == 1) {
          this.scores[this.currentDrawer] += getHeaderData().time;
        }
        if (this.correctGuesses == this.clients.length - 1) {
          next();
        }
      } else if (data.text) {
        for (let i = 0; i < this.clients.length; i++) {
          if (i != this.currentDrawer) {
            if (this.clients[i] === client) {
              toClient(client, "addModule", {module: "text", data: {text: data.text, align: "right"}});
            } else {
              let str = client + ": " + data.text;
              toClient(this.clients[i], "addModule", {module: "text", data: {text: str, align: "left"}});
            }
          }
        }
      }
    }
  };

  this.join = function(name, id) {
    this.clients.push(name);

    acceptClient(name, id, this.clientModules, "clearAndAddModule", {module: "draw", data: {live: true}});
    updateModule(this.clientList, {client: name});
  };
}
