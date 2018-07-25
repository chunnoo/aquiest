function Game() {
  this.clients = [];

  this.start = function(clients) {
    this.clients = clients;

    clear();
    emitToRoom("clear", {});
    emitToRoom("footerWrite", {text: "chat"});
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    let str = client + ": " + data.text;

    addDisplayText(str);
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i] === client) {
        emitToClient(client, "addText", {text: data.text, align: "right"});
      } else {
        emitToClient(this.clients[i], "addText", {text: str, align: "left"});
      }
    }
  };

  this.join = function(name, id) {
    this.clients.push(name);

    acceptClient(name, id, "footerWrite", {text: "chat"});
  };
}
