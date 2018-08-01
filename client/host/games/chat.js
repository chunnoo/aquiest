function Game() {
  this.clients = [];
  this.clientModules = ["footerWrite"];

  this.init = function(clients) {
    this.clients = clients;

    roomLoadModules(this.clientModules);
  };

  this.start = function() {

    clear();

    toRoom("clear", {});
    toRoom("setFooter", {module: "footerWrite", data: {text: "chat"}});
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    let str = client + ": " + data.text;

    addDisplayText(str);
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i] === client) {
        toClient(client, "addModule", {module: "text", data: {text: data.text, align: "right"}});
      } else {
        toClient(this.clients[i], "addModule", {module: "text", data: {text: str, align: "left"}});
      }
    }
  };

  this.join = function(name, id) {
    this.clients.push(name);

    acceptClient(name, id, this.clientModules, "setFooter", {module: "footerWrite", data: {text: "chat"}});
  };
}
