function Game() {
  this.clients = [];
  this.clientModules = ["footerWrite"];

  this.text = null;

  this.init = function(clients) {
    this.clients = clients;

    loadModules(["multilineText"]);

    roomLoadModules(this.clientModules);
  };

  this.start = function() {

    clear();

    this.text = addModule("multilineText", {});

    toRoom("clear", {});
    toRoom("setFooter", {module: "footerWrite", data: {text: "chat"}});
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    let str = client + ": " + data.text;

    updateModule(this.text, {text: str});
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
