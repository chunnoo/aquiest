function Game() {
  this.clients = [];
  this.clientModules = ["point", "path", "draw"];

  this.init = function(clients) {
    this.clients = clients;

    roomLoadModules(this.clientModules);
  };

  this.start = function() {
    clear();
    addDisplayText(JSON.stringify(this.clients));

    toRoom("clearAndAddModule", {module: "draw", data: {}});
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    clear();
    //addDisplayText(client + ":");
    addDisplayCanvas(data.paths);
  };

  this.join = function(name, id) {
    this.clients.push(name);

    acceptClient(name, id, this.clientModules, "clearAndAddModule", {module: "draw", data: {}});
  };
}
