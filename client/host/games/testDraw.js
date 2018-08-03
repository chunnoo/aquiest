function Game() {
  this.clients = [];
  this.clientModules = ["point", "path", "draw"];

  this.init = function(clients) {
    this.clients = clients;

    loadModules(["point", "path", "displayDraw"]);

    roomLoadModules(this.clientModules);
  };

  this.start = function() {
    clear();
    addModule("text", {text: JSON.stringify(this.clients)});

    toRoom("clearAndAddModule", {module: "draw", data: {}});
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    clear();
    //addDisplayText(client + ":");
    addModule("displayDraw", {paths: data.paths});
  };

  this.join = function(name, id) {
    this.clients.push(name);

    acceptClient(name, id, this.clientModules, "clearAndAddModule", {module: "draw", data: {}});
  };
}
