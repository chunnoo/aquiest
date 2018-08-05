function Game() {
  this.clients = [];
  this.scores = [];
  this.words = [];

  this.dictionary = "wordsNo";

  this.clientModules = ["footerWrite", "headerTimer"];

  this.clientList = null;

  this.init = function(clients) {
    this.clients = clients;
    for (let i = 0; i < this.clients.length; i++) {
     this.scores.push(0);
    }

    loadModules(["clientList", "headerTimer"]);
    loadDictionary(this.dictionary);

    roomLoadModules(this.clientModules);
  };

  this.start = function() {
    clear();
    setHeader("headerTimer", {time: 60});
    addModule("clientList", {clients: this.clients, clientData: this.scores, position: "center"});

    toRoom("setHeader", {module: "headerTimer", data: {time: 60}});
    toRoom("setFooter", {module: "footerWrite", data: {text: "type"}});

    for (let i = 0; i < this.clients.length; i++) {
      this.words[i] = getRandomDictionaryWord();
      toClient(this.clients[i], "clearAndAddModule", {module: "text", data: {text: this.words[i], align: "left"}});
    }

  };

  this.next = function() {
    toRoom("disableFooter", {});
    toRoom("disableHeader", {});
    toRoom("clearAndAddModule", {module: "text", data: {text: "Time's up!"}});
  };

  this.clientData = function(client, data) {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i] === client) {
        if (data.text === this.words[i]) {
          this.scores[i]++;
          clear();
          addModule("clientList", {clients: this.clients, clientData: this.scores, position: "center"});

          this.words[i] = getRandomDictionaryWord();
          toClient(this.clients[i], "clearAndAddModule", {module: "text", data: {text: this.words[i], align: "left"}});
        } else {
          toClient(this.clients[i], "addModule", {module: "text", data: {text: data.text, align: "right"}});
        }
      }
    }
  };

  this.join = function(name, id) {
    rejectClient(id, "Can't join during game");
  };
}
