function GameScript(game) {
  this.game = game;

  this.script = document.createElement("script");

  this.script.onload = function() {
    initGame();
  };

  let content = document.getElementById("content");
  this.script.src = "/host/games/" + game + ".js";
  content.appendChild(this.script);


  this.delete = function() {
    let content = document.getElementById("content");
    content.removeChild(this.script);
    this.script = null;
  }
}
