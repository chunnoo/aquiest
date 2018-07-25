function Game() {
  this.clients = [];

  this.start = function(clients) {
    this.clients = clients;

    clear();
    addDisplayText(JSON.stringify(this.clients));

    emitToRoom("test", {});
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    addDisplayText(client + ": " + JSON.stringify(data));
  };

  this.join = function(name, id) {
    this.clients.push(name);
    acceptClient(name, id, "test", {});
  };
}
