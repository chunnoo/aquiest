function Game() {
  this.clients = [];

  this.start = function(clients) {
    this.clients = clients;

    clear();
    addDisplayText(JSON.stringify(this.clients));

    emitToRoom("testDraw", {});
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    clear();
    addDisplayText(client + ":");
    addDisplayCanvas(data.paths);
  };

  this.join = function(name, id) {
    this.clients.push(name);

    acceptClient(name, id, "testDraw", {});
  };
}
