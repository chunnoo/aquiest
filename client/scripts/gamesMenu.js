function GamesMenu() {
  this.games = [];

  this.menu = document.createElement("div");
  this.menu.id = "gamesMenu";
  this.menu.className = "gamesMenu";

  let content = document.getElementById("content");
  content.appendChild(this.menu);

  this.init = function() {

  };

  this.addGame = function(game) {
    let newGame = {
      name: game.name,
      maxClients: game.maxClients,
      element: document.createElement("button")
    };
    newGame.element.id = newGame.name;
    newGame.element.className = "menuGame";
    newGame.element.innerHTML = newGame.name;
    newGame.element.onclick = function() {
      socket.emit("requestGameScript", {name: this.name});
    }.bind(newGame);
    this.menu.appendChild(newGame.element);
    this.games.push(newGame);
  };

  this.addGames = function(games) {
    for (let i = 0; i < games.length; i++) {
      this.addGame(games[i]);
    }
  };

  this.delete = function() {
    for (let i = 0; i < this.games.length; i++) {
      this.menu.removeChild(this.games[i].element);
    }
    let content = document.getElementById("content");
    content.removeChild(this.menu);
    this.games = [];
  };

}
