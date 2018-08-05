function Game() {
  this.clients = [];
  this.clientModules = ["point", "path", "draw"];

  this.clientList = null;
  this.canvas = null;

  this.init = function(clients) {
    this.clients = clients;

    loadModules(["point", "path", "displayDraw", "clientList"]);

    roomLoadModules(this.clientModules);
  };

  this.start = function() {
    clear();
    this.clientList = addModule("clientList", {clients: this.clients});
    this.canvas = addModule("displayDraw", {});

    toRoom("clearAndAddModule", {module: "draw", data: {live: true}});
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    if (data.paths) {
      updateModule(this.canvas, {paths: data.paths});
    }
    if (data.path) {
      updateModule(this.canvas, {path: data.path});
    }
  };

  this.join = function(name, id) {
    this.clients.push(name);

    acceptClient(name, id, this.clientModules, "clearAndAddModule", {module: "draw", data: {live: true}});
    updateModule(this.clientList, {client: name});
  };
}
