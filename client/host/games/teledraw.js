function Game() {
  this.clients = [];

  this.finished = false;
  this.round = 0;
  this.received = 0;
  this.data = {};

  this.start = function(clients) {
    this.clients = clients;
    for (let i = 0; i < this.clients.length; i++) {
      this.data[this.clients[i]] = [];
    }
    this.round = 0;
    this.received = 0;

    for (let i = 0; i < this.clients.length; i++) {
      this.data[this.clients] = [];
    }

    console.log("TeledrawStart");
    console.log(this.clients);
    console.dir(this.data);

    clear();
    addDisplayText("Write Something");

    emitToRoom("write", {text: "Type something"});
  };

  this.next = function() {
    if (!this.finished) {
      this.received = 0;
      this.round++;

      if (this.round == this.clients.length) {
        this.finished = true;
        this.round = 0;
        emitToRoom("text", {text: "Game finished"});
        next();
      } else {
        if (this.round % 2 == 0) {
          clear();
          addDisplayText("Write what you see");

          for (let i = 0; i < this.clients.length; i++) {
            let msg = this.data[this.clients[(i + this.clients.length - 1) % this.clients.length]][this.round - 1];
            emitToClient(this.clients[i], "displayCanvasAndWrite", msg);
          }
        } else if (this.round % 2 == 1) {
          clear();
          addDisplayText("Draw your word");

          for (let i = 0; i < this.clients.length; i++) {
            let msg = this.data[this.clients[(i + this.clients.length - 1) % this.clients.length]][this.round - 1];
            emitToClient(this.clients[i], "displayTextAndDraw", msg);
          }
        }
      }
    } else {
      this.received = 0;

      emitToRoom("button", {text: "Next", value: "clientData"});

      if (this.round == this.clients.length * this.clients.length) {
        emitToRoom("text", {text: "Game finished"});
        clear();
        addDisplayText("Game finished");
      } else if ((this.round % this.clients.length) % 2 == 0) {
        let data = this.data[this.clients[(this.round + Math.floor(this.round / this.clients.length)) % this.clients.length]][this.round % this.clients.length];
        clear();
        addDisplayText(data.text);
      } else if ((this.round % this.clients.length) % 2 == 1) {
        let data = this.data[this.clients[(this.round + Math.floor(this.round / this.clients.length)) % this.clients.length]][this.round % this.clients.length];
        clear();
        addDisplayCanvas(data.paths);
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

      emitToClient(client, "text", {text: "Wait for other players"});

      if (this.received == this.clients.length) {
        next();
      }
    } else {
      this.received++;
      emitToClient(client, "text", {text: "Wait for others"});
      if (this.received == this.clients.length) {
        next();
      }
    }
  };
}
