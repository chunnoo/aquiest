function Game() {
  this.clients = [];
  this.clientModules = ["point", "path", "draw"];

  this.clientList = null;

  this.init = function(clients) {
    this.clients = clients;

    loadModules(["point", "path", "displayDraw", "clientList"]);

    roomLoadModules(this.clientModules);
  };

  this.start = function() {
    clear();
    this.clientList = addModule("clientList", {clients: this.clients});

    toRoom("clearAndAddModule", {module: "draw", data: {}});
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    clear();

    this.clientList = addModule("clientList", {clients: this.clients});
    updateModule(this.clientList, {highlight: client});
    addModule("displayDraw", {paths: data.paths});
  };

  this.join = function(name, id) {
    this.clients.push(name);

    acceptClient(name, id, this.clientModules, "clearAndAddModule", {module: "draw", data: {}});
  };
}
