function Teledraw(clients, host, room) {
  this.clients = [];
  for (name in clients) {
    this.clients.push({name: name, id: clients[name]});
  }
  this.host = host;
  this.room = room;

  this.gameFinished = false;
  this.round = 0;
  this.received = 0;
  this.data = {};

  this.start = function(io, socket) {
    this.round = 0;
    this.received = 0;

    for (let i = 0; i < this.clients.length; i++) {
      this.data[this.clients[i].name] = [];
    }

    console.log("TeledrawStart");
    console.log(this.clients);
    console.dir(this.data);

    socket.emit("text", {text: "Write something"});
    socket.broadcast.to(this.room).emit("write", {text: "Type something"});
  };

  this.clientData = function(io, socket, client, data) {
    if (!this.gameFinished) {
      console.log("TeledrawClientData");
      console.dir(this.clients);
      console.dir(this.data);

      this.received++;

      this.data[client].push(data);

      socket.emit("text", {text: "Wait for other players"});

      if (this.received == this.clients.length) {
        io.sockets.to(this.host).emit("next");
      }
    } else {
      this.received++;
      socket.emit("text", {text: "Wait for others"});
      if (this.received == this.clients.length) {
        io.sockets.to(this.host).emit("next");
      }
    }
  };

  this.next = function(io, socket) {
    if (!this.gameFinished) {
      this.received = 0;
      this.round++;

      if (this.round == this.clients.length) {
        this.gameFinished = true;
        this.round = 0;
        socket.emit("next");
        io.sockets.to(this.room).emit("text", {text: "Game finished"});
      } else {
        if (this.round % 2 == 0) {
          socket.emit("text", {text: "Write what you see"});

          for (let i = 0; i < this.clients.length; i++) {
            let msg = this.data[this.clients[(i + this.clients.length - 1) % this.clients.length].name][this.round - 1];
            io.sockets.to(this.clients[i].id).emit("displayCanvasAndWrite", msg);
          }
        } else if (this.round % 2 == 1) {
          socket.emit("text", {text: "Draw your word"});

          for (let i = 0; i < this.clients.length; i++) {
            let msg = this.data[this.clients[(i + this.clients.length - 1) % this.clients.length].name][this.round - 1];
            io.sockets.to(this.clients[i].id).emit("displayTextAndDraw", msg);
          }
        }
      }
    } else {
      this.received = 0;

      io.sockets.to(this.room).emit("button", {text: "Next", value: "clientData"});

      if (this.round == this.clients.length * this.clients.length) {
        io.sockets.to(this.room).emit("text", {text: "Game finished"});
      } else if ((this.round % this.clients.length) % 2 == 0) {
        let data = this.data[this.clients[(this.round + Math.floor(this.round / this.clients.length)) % this.clients.length].name][this.round % this.clients.length];
        socket.emit("displayText", data);
      } else if ((this.round % this.clients.length) % 2 == 1) {
        let data = this.data[this.clients[(this.round + Math.floor(this.round / this.clients.length)) % this.clients.length].name][this.round % this.clients.length];
        socket.emit("displayCanvas", data);
      }
      this.round++;
    }
  };
}

module.exports = Teledraw;

/*
1: 1 2 4 3
2: 2 3 1 4
3: 3 4 2 1
4: 4 1 3 2

1 3 2 2
2 4 3 3
3 1 4 4
4 2 1 1
*/
