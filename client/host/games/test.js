function Game() {
  this.clients = [];
  this.clientModules = ["write", "multiButton", "footerWrite"];
  this.clientContent = {
      modules: [
        {module: "text", data: {text: "text", animationDelay: "0s"}},
        {module: "text", data: {text: "left", align: "left", animationDelay: "0.1s"}},
        {module: "text", data: {text: "right", align: "right", animationDelay: "0.2s"}},
        {module: "write", data: {text: "text", animationDelay: "0.3s"}},
        {module: "button", data: {value: "value", text: "text", animationDelay: "0.4s"}},
        {module: "multiButton", data: {values: [1, 2, 3, 4], texts: ["one", "two", "three", "four"], animationDelay: "0.5s"}},
        {module: "multiButton", data: {values: ["none", "write"], texts: ["none", "write"], animationDelay: "0.6s"}}
      ]
    };

  this.clientList = null;
  this.text = null;

  this.init = function(clients) {
    this.clients = clients;

    loadModules(["clientList", "multilineText"]);

    roomLoadModules(this.clientModules);
  };

  this.start = function() {
    clear();

    this.clientList = addModule("clientList", {clients: this.clients});
    this.text = addModule("multilineText", {text: JSON.stringify(this.clients)});

    toRoom("clearAndAddModules", this.clientContent);
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    updateModule(this.text, {text: client + ": " + JSON.stringify(data)});
    updateModule(this.clientList, {highlight: client});
    //addModule("text", {text: client + ": " + JSON.stringify(data)});
    if (data.value === "write") {
      toClient(client, "setFooter", {module: "footerWrite", data: {text: "write"}});
    } else if (data.value === "none") {
      toClient(client, "disableFooter", {});
    }
  };

  this.join = function(name, id) {
    updateModule(this.text, {text: name + ": " + id});
    //addModule("text", {text: name + ": " + id});
    this.clients.push(name);
    acceptClient(name, id, this.clientModules, "clearAndAddModules", this.clientContent);

    updateModule(this.clientList, {client: name});
  };
}
