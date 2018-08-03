function Game() {
  this.clients = [];

  this.finished = false;
  this.round = 0;
  this.received = 0;
  this.data = {};

  this.init = function(clients) {
    this.clients = clients;
    for (let i = 0; i < this.clients.length; i++) {
      this.data[this.clients[i]] = [];
    }
    this.round = 0;
    this.received = 0;

    loadModules(["point", "path", "displayDraw"]);

    roomLoadModules(["point", "path", "draw", "write", "displayDraw"]);
  }

  this.start = function() {
    console.log("TeledrawStart");
    console.log(this.clients);
    console.dir(this.data);

    clear();
    addModule("text", {text: "Write Something"});

    toRoom("clearAndAddModule", {module: "write", data: {text: "Type something"}});
  };

  this.next = function() {
    if (!this.finished) {
      this.received = 0;
      this.round++;

      if (this.round == this.clients.length) {
        this.finished = true;
        this.round = 0;
        toRoom("clearAndAddModule", {module: "text", data: {text: "Game finished"}});
        next();
      } else {
        if (this.round % 2 == 0) {
          clear();
          addModule("text", {text: "Write what you see"});

          for (let i = 0; i < this.clients.length; i++) {
            let msg = this.data[this.clients[(i + this.clients.length - 1) % this.clients.length]][this.round - 1];
            toClient(this.clients[i], "clearAndAddModules", {
              modules: [
                {module: "displayDraw", data: {paths: msg.paths, animationDelay: "0s"}},
                {module: "write", data: {text: "write", animationDelay: "0s"}}
              ]
            });
          }
        } else if (this.round % 2 == 1) {
          clear();
          addModule("text", {text: "Draw your word"});

          for (let i = 0; i < this.clients.length; i++) {
            let msg = this.data[this.clients[(i + this.clients.length - 1) % this.clients.length]][this.round - 1];
            toClient(this.clients[i], "clearAndAddModules", {
              modules: [
                {module: "text", data: {text: msg.text, animationDelay: "0s"}},
                {module: "draw", data: {animationDelay: "0s"}}
              ]
            });
          }
        }
      }
    } else {
      this.received = 0;

      toRoom("clearAndAddModule", {module: "button", data: {text: "Next", value: "next"}});

      if (this.round == this.clients.length * this.clients.length) {
        toRoom("clearAndAddModule", {module: "text", data: {text: "Game finished"}});
        clear();
        addModule("text", {text: "Game finished"});
      } else if ((this.round % this.clients.length) % 2 == 0) {
        let data = this.data[this.clients[(this.round + Math.floor(this.round / this.clients.length)) % this.clients.length]][this.round % this.clients.length];
        clear();
        addModule("text", {text: data.text});
      } else if ((this.round % this.clients.length) % 2 == 1) {
        let data = this.data[this.clients[(this.round + Math.floor(this.round / this.clients.length)) % this.clients.length]][this.round % this.clients.length];
        clear();
        addModule("displayDraw", {paths: data.paths});
      }
      this.round++;
    }
  };

  this.clientData = function(client, data) {
    if (!this.finished) {
      console.log("TeledrawClientData");
      console.dir(this.clients);
      console.dir(this.data);

      this.received++;

      this.data[client].push(data);

      toClient(client, "clearAndAddModule", {module: "text", data: {text: "Wait for other players"}});

      if (this.received == this.clients.length) {
        next();
      }
    } else {
      this.received++;
      toClient(client, "clearAndAddModule", {module: "text", data: {text: "Wait for others"}});
      if (this.received == this.clients.length) {
        next();
      }
    }
  };

  this.join = function(name, id) {
    rejectClient(id, "Can't join during game");
  };
}
