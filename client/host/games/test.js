function Game() {
  this.clients = [];
  this.clientModules = ["write", "multiButton", "footerWrite"];
  this.clientContent = {
      modules: [
        {module: "text", data: {text: "text"}},
        {module: "text", data: {text: "left", align: "left"}},
        {module: "text", data: {text: "right", align: "right"}},
        {module: "write", data: {text: "text"}},
        {module: "button", data: {value: "value", text: "text"}},
        {module: "multiButton", data: {values: [1, 2, 3, 4], texts: ["one", "two", "three", "four"]}},
        {module: "multiButton", data: {values: ["none", "write"], texts: ["none", "write"]}}
      ]
    };

  this.init = function(clients) {
    this.clients = clients;

    roomLoadModules(this.clientModules);
  };

  this.start = function() {
    clear();
    addDisplayText(JSON.stringify(this.clients));

    toRoom("clearAndAddModules", this.clientContent);
  };

  this.next = function() {

  };

  this.clientData = function(client, data) {
    addDisplayText(client + ": " + JSON.stringify(data));
    if (data.type === "clientData" && data.value === "write") {
      toClient(client, "setFooter", {module: "footerWrite", data: {text: "write"}});
    } else if (data.type === "clientData" && data.value === "none") {
      toClient(client, "disableFooter", {});
    }
  };

  this.join = function(name, id) {
    addDisplayText(name + ": " + id);
    this.clients.push(name);
    acceptClient(name, id, this.clientModules, "clearAndAddModules", this.clientContent);
  };
}
